//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser")
const app = express()
// const admin = require ("./routes/admin")
const path = require ("path")
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Vaga")
const Vaga = mongoose.model("vagas")
require("./models/Usuario")
const Usuario = mongoose.model("usuarios")
const empresa = require("./routers/empresa")
const candidato = require("./routers/candidato")
const admin = require("./routers/admin")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")

//Configuracoes
    //Sessao
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    //Middlwere
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg") //locals torna a variavel global
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null; //recebe dados do usuário logado e torna global
            next()
        })
    //Body Pars
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //handle bars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');

    //Mongoose
        mongoose.Promise=global.Promise
        mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
            console.log("Conectado ao Mongo")
        }).catch((err)=>{
            console.log("Erro ao Conectar ao Mongo:" + err)
        })
    
    //Public
        app.use(express.static(path.join(__dirname,"public")))

        app.use((req, res, next)=>{//middleware
            
            next()//precisa por isso caso contrario a aplicação para aqui; sera chamado para todas as reqs
        })

//Rotas
    app.get('/', (req, res) => {
        var result = []
        Vaga.find().lean().sort().then((vagas)=>{
            clon = req.body.currentLon;
            clat = req.body.currentLat;

            for(var i = 0; i < vagas.length; i++){
                resultdist = getDistanceFromLatLonInKm(clat, clon, vagas[i].lat, vagas[i].lon)
                if(vagas[i].finalizado == "N" && resultdist <= 30 &&  resultdist >= 0.000001){
                    result.push(vagas[i])
                }
            }        
            res.render('index', {vagas: result})
        }).catch((err)=>{
            //console.log(err)
            req.flash("error_msg", "Erro ao carregar Jobs: "+err)
            res.redirect("/404")
        })
        
    })

    app.get("/vaga/:id", (req, res)=>{
        Vaga.findOne({_id: req.params.id}).populate("usuario").lean().then((vaga)=>{
            if(vaga){
                Usuario.findOne({_id: vaga.criador}).then((usuariocriador)=>{
                    res.render("vaga/index", {vaga: vaga, usuariocriador: usuariocriador.nome, sobre: usuariocriador.sobre,
                        telefone: usuariocriador.telefone, linkedin: usuariocriador.linkedin})
                }).catch((err)=>{
                    req.flash("error_msg", "Erro ao buscar criador: " +err)
                    res.redirect("/")
                })
            }else{
                req.flash("error_msg", "Esta vaga não encontrada: " +err)
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao buscar o Slug: "+err)
            res.redirect("/")
        })
    })

    
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        console.log(d);
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }
    
    app.get("/404", (req,res)=>{
        res.send('Erro 404!')
    })

    app.use('/candidato', candidato) //'/candidato' é o prefixo, logo precisa ser adicionar pos url /candidato;
    app.use('/empresa', empresa)
    app.use("/admin", admin)
    
//Outros
const port = process.env.PORT || 8081 //variavel de ambiente que o Heroku vai atribuir, caso contrario entra na 8081
app.listen(port, ()=> {
    console.log("Servidor online")
})


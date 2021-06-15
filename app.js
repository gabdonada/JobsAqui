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
const candidato = require("./routers/candidato")
const passport = require("passport")
require("./config/auth")(passport)
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
        mongoose.connect("mongodb://localhost/findJobs", {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
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
        Vaga.find().lean().sort({data: "desc"}).then((vagas)=>{
            res.render("index", {vagas: vagas})
        }).catch((err)=>{
            //console.log(err)
            req.flash("error_msg", "Erro ao carregar Jobs: "+err)
            res.redirect("/404")
        })
        
    })

    app.get("/vaga/:slug", (req, res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((vaga)=>{
            if(vaga){
                res.render("vaga/index", {vaga: vaga})
            }else{
                req.flash("error_msg", "Esta postagem não existe: " +err)
                res.redirect("/")
            }
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao buscar o Slug: "+err)
            res.redirect("/")
        })
    })

    
    app.get("/404", (req,res)=>{
        res.send('Erro 404!')
    })

    app.use('/candidato', candidato) //'/candidato' é o prefixo, logo precisa ser adicionar pos url /admin;
    //app.use("/empresa", empresa)
    //app.use("/usuario", usuario)
    
//Outros
const port = 8081
app.listen(port, ()=> {
    console.log("Servidor online")
})
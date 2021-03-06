const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
//require ("../models/Categoria")
//const Categoria = mongoose.model("categorias") //exatamente o nome dado entre "" em Categoria.js... Passa referencia para a constante
require('../models/Vaga')
const Vaga = mongoose.model("vagas")
require('../models/Curriculo')
const Curriculo = mongoose.model("curriculos")

const {eEmpresa} = require ("../helpers/eEmpresa") //pega só a função 'eEmpresa' dentro de eEmpresa file; variavel aqui = eAdmin

//aqui se define rotas
// router.get('/', eEmpresa, (req, res) => {
//     res.render("admin/index")
// })




//pagina de vagas
router.get("/vagas", eEmpresa, (req,res)=>{
    var result = []
    Vaga.find().lean().sort({data:"desc"}).then((vagas)=>{ //vai ter que vir um populate aqui em
        for(var i = 0; i < vagas.length; i++){
            if(vagas[i].criador == req.user.id && vagas[i].finalizado == "N"){
                result.push(vagas[i])
            }
        }        
        res.render("empresa/adminvagas", {vagas:result})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar vagas: "+err)
        res.redirect("/")
    })

})

router.get("/vagas/add", eEmpresa, (req,res) => {
    res.render("empresa/addvaga", {usuario: req.user.id})
    
})

router.post("/vagas/nova", eEmpresa, (req, res)=>{
    
        const novaVaga = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            area: req.body.area,
            beneficios: req.body.beneficios,
            criador: req.user.id
        }

        new Vaga(novaVaga).save().then(()=>{
            req.flash("success_msg","Vaga criada com sucesso!")
            res.redirect("/empresa/vagas")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar: "+err)
            res.redirect("/empresa/vagas")
        })
})

router.get("/vaga/edit/:id", eEmpresa, (req, res)=>{

    Vaga.findOne({_id: req.params.id}).lean().then((vaga)=>{//params pq ta pegando do link
        res.render("empresa/editvaga", {vaga: vaga})
    }).catch((err)=>{
        req.flash("error_msg", "Ocorreu um erro ao carregar o formulario: "+err)
        res.redirect("empresa/vagas")
    }) 
    
})

router.post("/vaga/alterar", eEmpresa, (req,res)=>{

    Vaga.findOne({_id: req.body.id}).then((vaga)=>{
        vaga.nome = req.body.nome,
        vaga.descricao = req.body.descricao,
        vaga.area = req.body.area,
        vaga.beneficios = req.body.beneficios

        vaga.save().then(()=>{
            req.flash("success_msg","Vaga editada com sucesso")
            res.redirect("/empresa/vagas")
        }).catch((err)=>{
            req.flash("error_msg","Erro ao salvar edição: "+err)
            res.redirect("/empresa/vagas")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao editar: "+err)
        res.redirect("/empresa/vagas")
    })
})

router.get("/vaga/finalizar/:id", eEmpresa, (req,res)=>{
    Vaga.findOne({_id: req.params.id}).then((vaga)=>{
        console.log(vaga)
        vaga.finalizado = "Y"

        vaga.save().then(()=>{
            req.flash("success_msg","Vaga finalizada com sucesso")
            res.redirect("/empresa/vagas")
        }).catch((err)=>{
            req.flash("error_msg","Erro ao salvar finalização: "+err)
            res.redirect("/empresa/vagas")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao finalizar: "+err)
        res.redirect("/empresa/vagas")
    })
})

router.get("/visualizarinscritos/:id", eEmpresa, (req,res)=>{
    
    var result = []
    Vaga.findOne({_id: req.params.id}).lean().then((vaga)=>{
        
        Curriculo.find().lean().then( async (curriculos)=>{
            if(curriculos){

                const promises = []                
                for(const candidato of vaga.candidatos){
                    for(const curriculo of curriculos ){
                        promises.push(
                            new Promise((resolve) => {
                                if(candidato == curriculo.usuario){
                                    result.push(curriculo)
                                }
                                resolve(candidato)
                            })
                        )
                    }
                }
               
                Promise.all(promises).then((resposta) => {
                    console.log(result)
                    console.log(result.usuario)
                    res.render("empresa/viewcurriculos", {teste: result})
                })
               
            }else{
                req.flash("error_msg", "Não há curriculos relacionados")
                res.redirect("/empresa/vagas")
            }
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao buscar usuários relacionados a vaga: "+err)
            res.redirect("/empresa/vagas")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar vaga: "+err)
        res.redirect("/empresa/vagas")
    })
})

router.get("/curriculocandidato/:id", eEmpresa, (req,res)=>{
    Curriculo.findOne({_id: req.params.id}).lean().then((curriculo)=>{
        res.render("empresa/viewcandidato", {curriculo: curriculo})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar curriculo: "+err)
        res.redirect("/empresa/vagas")
    })
})

module.exports = router

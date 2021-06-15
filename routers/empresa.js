const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
//require ("../models/Categoria")
//const Categoria = mongoose.model("categorias") //exatamente o nome dado entre "" em Categoria.js... Passa referencia para a constante
require('../models/Vaga')
const Vaga = mongoose.model("vagas")
const {eEmpresa} = require ("../helpers/eEmpresa") //pega só a função 'eEmpresa' dentro de eEmpresa file; variavel aqui = eAdmin

//aqui se define rotas
router.get('/', eEmpresa, (req, res) => {
    res.render("admin/index")
})




//pagina de postagens
router.get("/vagas", eEmpresa, (req,res)=>{
    //res.render("admin/postagens")

    Vaga.find().lean().sort({data:"desc"}).then((vagas)=>{ //vai ter que vir um populate aqui em
        res.render("admin/postagens", {vagas:vagas})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar postagens: "+err)
        res.redirect("/admin")
    })

})

router.get("/postagens/add", eEmpresa, (req,res) => {
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/addpostagem", {categorias: categorias}) //encaminhando os dados para a page
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao carregar categorias: "+err)
        res.redirect("/admin")
    })
    
})

router.post("/postagens/nova", eEmpresa, (req, res)=>{
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem")
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg","Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar: "+err)
            res.redirect("/admin/postagens")
        })
    }
})

router.get("/postagens/edit/:id", eEmpresa, (req, res)=>{

    Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{//params pq ta pegando do link
        Categoria.find().lean().then((categorias)=>{
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao listar as categorias: "+err)
            res.redirect("/admin/postagens")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Ocorreu um erro ao carregar o formulario: "+err)
        res.redirect("/admin/postagens")
    }) 
    
})

router.post("/postagem/edit", eEmpresa, (req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash("success_msg","Postagem editada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg","Erro ao salvar edição de postagem: "+err)
            res.redirect("/admin/postagens")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao editar: "+err)
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id", eEmpresa, (req,res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{ //meio não tão seguro por ser get
        req.flash("success_msg","Postagem deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletar postagem: "+err)
        res.redirect("/admin/postagens")
    })
})

module.exports = router

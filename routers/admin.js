const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { route } = require('./empresa')
require("../models/Sugestao")
const Sugestao = mongoose.model("sugestoes")
const {eAdmin} = require ("../helpers/eAdmin")


router.get("/registrarSugestao", (req, res)=>{
    res.render("admin/registrarSugest")
})

router.post("/addSugestao", (req, res)=>{
    const novaSugestao = {
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        linkedin: req.body.linkedin,
        descricao: req.body.descricao
    }

    new Sugestao(novaSugestao).save().then(()=>{
        req.flash("success_msg","Seu Feedback foi registrado com sucesso!")
        res.redirect("/")
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao salvar: "+err)
        res.redirect("/")
    })
})

router.get("/feedbacks", (req,res)=>{
    Sugestao.find().lean().sort().then((sugest)=>{  
        res.render("admin/feedback", {sugest:sugest})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar feedbacks: "+err)
        res.redirect("/")
    })
})


module.exports = router

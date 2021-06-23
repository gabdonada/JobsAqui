const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { route } = require('./empresa')
require("../models/Sugestao")
const Usuario = mongoose.model("sugestoes")

router.get("/registrarSugestao", (req, res)=>{
    res.render("admin/registrarSugest")
})

router.post("/addSugestao", (req, res)=>{
    const novoCurriculo = {
        usuario: req.body.userid,
        nome: req.user.nome,
        telefone: req.user.nome,
        email: req.user.email,
        linkedin: req.user.linkedin,
        sobre: req.user.sobre,
        experiencia: req.body.experiencia,
        educacao: req.body.educacao,
        certificacao: req.body.certificacao,
        idioma: req.body.idioma,
        habilidades: req.body.habilidades,
        outros: req.body.outros
    }

    new Curriculo(novoCurriculo).save().then(()=>{
        req.flash("success_msg","Curriculo criada com sucesso. Agora, registre-se em vagas")
        res.redirect("/")
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao salvar: "+err)
        res.redirect("/")
    })
})


module.exports = router

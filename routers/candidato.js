const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Curriculo")
const Curriculo = mongoose.model("curriculos")
require("../models/Vaga")
const Vaga = mongoose.model("vagas")
const bcrypt= require("bcryptjs")
const passport = require("passport")
const {eCandidato} = require ("../helpers/eCandidato")

router.get("/registro", (req,res)=>{
    res.render("usuario/registro")
})

router.post("/registro", (req,res)=>{
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email invalido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha invalido"})
    }

    if(req.body.senha.length <5){
        erros.push({texto: "Senha possui menos de 5 digitos"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas informadas são diferentes."})
    }

    if(erros.length>0){
        res.render("usuario/registro", {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "Ja existe um usuário com este email")
                res.redirect("/usuario/registro")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    accessType: req.body.accessType,
                    telefone: req.body.telefone,
                    linkedin: req.body.linkedin,
                    sobre: req.body.sobre
                })

                bcrypt.genSalt(10, (erro, salt) =>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro,hash)=>{
                        if(erro){
                            req.flash("error_msg", "Erro ao guardar senha: "+err)
                            res.redirect("/usuario/registro")
                        }else{
                            novoUsuario.senha = hash
                            novoUsuario.save().then(()=>{
                                req.flash("success_msg", "Usuário registrado com sucesso!")
                                res.redirect("/")
                            }).catch((err)=>{
                                req.flash("error_msg", "Erro ao guardar usuário: "+err)
                                res.redirect("/usuario/registro")
                            })
                        }
                    })
                })
            }
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao registrar: "+err)
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res)=>{
    res.render("usuario/login")
})

router.post("/login", (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/candidato/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req,res)=>{
    req.logOut()//passport reconhece sozinho
    req.flash('success_msg', "Deslogado com sucesso")
    res.redirect("/")
})


//curriculo
router.get("/curriculo", eCandidato, (req,res)=>{
    Curriculo.findOne({usuario: req.user.id}).lean().populate("usuario").then((curriculo)=>{
        if(curriculo){
            res.render("candidato/curriculo",{curriculo: curriculo})
        }else{
            req.flash("error_msg","Você não possui curriculo registrado, registre nesta pagina")
            res.redirect("/candidato/criarCurriculo")
        }
    }).catch((err)=>{
        req.flash("error_msg","Erro ao função pagina de curriculo")
        res.redirect("/")
    })
})

router.get("/criarCurriculo", eCandidato, (req,res)=>{
    res.render("candidato/criarCurriculo", {usuarioid: req.user.id})
})

router.post("/criarCurriculo/novo", eCandidato, (req,res) => { 

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

router.get("/editcurriculo/:id", eCandidato, (req,res)=>{
    //console.log("Entrei 1: "+req.params.id)
    Curriculo.findOne({usuario: req.params.id}).lean().then((curriculo)=>{
        res.render("candidato/editarCurriculo",{curriculo: curriculo})
    }).catch((err)=>{
        req.flash("error_msg","Este curriculo não existe, impossível carregar")
        res.redirect("/")
    })
    
})

router.post("/curriculo/edit", eCandidato, (req,res)=>{
    //console.log("Entrei 2: "+req.body.usuarioid)
    Curriculo.findOne({usuario: req.body.usuarioid}).then((curriculo)=>{
        curriculo.experiencia = req.body.experiencia
        curriculo.educacao = req.body.educacao
        curriculo.certificacao = req.body.certificacao
        curriculo.idioma = req.body.idioma
        curriculo.habilidades = req.body.habilidades
        curriculo.outros = req.body.outros


        curriculo.save().then(()=>{
            req.flash("success_msg","Curriculo editado com sucesso. Agora, registre-se em vagas")
            res.redirect("/")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar: "+err)
            res.redirect("/")
        })
    }).catch((err)=>{
        req.flash("error_msg","Curriculo não encontrado: "+err)
        res.redirect("/")
    })
})

router.get("/candidatarse/:id", eCandidato, (req,res)=>{
    Vaga.findOne({_id: req.params.id}).then((vaga)=>{
        Curriculo.findOne({usuario: req.user._id}).then( (curriculo)=>{
            if(curriculo){

                for(const candidato of vaga.candidatos){
                    if(candidato == curriculo.usuario){
                        req.flash("success_msg", "Você já se candidatou a vaga "+vaga.nome)
                        res.redirect("/")
                    }
                }

                if(Array.isArray(vaga.candidatos)){
                    vaga.candidatos.push(JSON.parse(JSON.stringify(req.user._id)));
                } else {
                    vaga.candidatos = [JSON.parse(JSON.stringify(req.user._id))];
                }
                vaga.save().then(()=>{
                    req.flash("success_msg","Você se candidatou com sucesso! Continue encaminhando seu curriculo.")
                    res.redirect("/")
                }).catch((err)=>{
                    req.flash("error_msg", "Houve um erro ao cadastrar candidatura: "+err)
                    res.redirect("/")
                })
            }else{
                req.flash("error_msg", "Você não possui curriculo, registre seu curriculo")
                res.redirect("/candidato/criarCurriculo")
            }
            
        }).catch((err)=>{
            req.flash("error_msg", "Você não possui curriculo, registre seu curriculo: "+err)
            res.redirect("/")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao buscar vaga: "+err)
        res.redirect("/")
    })
})

module.exports = router
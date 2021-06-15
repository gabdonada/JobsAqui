const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt= require("bcryptjs")
const passport = require("passport")

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
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req,res)=>{
    req.logOut()//passport reconhece sozinho
    req.flash('success_msg', "Deslogado com sucesso")
    res.redirect("/")
})

//Roles
router.get('/roles/add', (req,res)=>{
    res.render("candidato/adicionarRoles")
})

router.post('/role/nova', (req,res)=>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }

    if(erros.length > 0){
        res.render("candidato/adicionarRoles",{erros: erros})
    }else{
        const novaRole = {
            nome: req.body.nome,
            sobre: req.body.sobre,
            identificacao: req.body.identificacao,
            inicio: req.body.inicio,
            fim: req.body.fim,
            usuario: req.user.id,
            slug: req.body.nome + '' + req.body.identificacao + '' + req.body.inicio
        }
    
        new Role(novaRole).save().then(()=>{
            req.flash("success_msg", "Role criada com sucesso")
            //console.log("Categoria salva com sucesso!")
            res.redirect("/candidato/curriculo")
        }).catch((err)=>{
            req.flash("erro_msg","Houve um erro ao salvar a categoria: "+err)
            //console.log("Erro ao salvar nova categoria: "+err)
            res.redirect("/candidato/curriculo")
        })
    }

})

router.post("/role/deletar", (req,res) => { 
    Role.findOne({_id: req.body.id}).then((role) =>{ //utilizar body quando e a variavel do Body e params quando é para imputar na tela
        role.deletada = 1

        Role.save().then(() =>{
            req.flash("success_msg", "Role deletada com sucesso!")
            res.redirect("/candidato/curriculo")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar a alteração: "+err)
            res.redirect("/candidato/curriculo")
        })
    }).catch((err)=>{
       req.flash("error_msg", "Houve um erro ao deletar a role: "+err)
       res.redirect("/candidato/curriculo") 
    })
})

//curriculo
router.get("/curriculo/:id", (req, res)=>{
    Curriculo.findOne({_id: req.params.id}).lean.then((curriculo)=>{
        res.render("candidato/curriculo",{curriculo: curriculo})
    }).catch((err)=>{
        req.flash("error_msg","Curriculo não encontrado")
        res.redirect("/")
    })
})

router.get("/curriculo/editContato/:id", (req,res)=>{
    Curriculo.findOne({_id: req.params.id}).lean().then((curriculo)=>{
        res.render("candidato/editarContatos",{curriculo: curriculo})
    }).catch((err)=>{
        req.flash("error_msg","Curriculo não encontrado")
        res.redirect("/")
    })
    
})

module.exports = router
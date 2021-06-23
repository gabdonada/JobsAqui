module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.accessType == 'Admin'){
            return next()
        }else{
            req.flash("error_msg", "Você não é Administrador, registre-se")
            res.redirect("/")
        }
    }
}
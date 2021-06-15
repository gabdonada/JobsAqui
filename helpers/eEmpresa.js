module.exports = {
    eEmpresa: function(req, res, next){
        if(req.isAuthenticated() && req.user.accessType == 'Empresa'){
            return next()
        }else{
            req.flash("error_msg", "Você não é Empresa")
            res.redirect("/")
        }
    }
}
module.exports = {
    eCandidato: function(req, res, next){
        if(req.isAuthenticated() && req.user.accessType == 'Candidato'){
            return next()
        }else{
            req.flash("error_msg", "Você não é Candidato")
            res.redirect("/")
        }
    }
}
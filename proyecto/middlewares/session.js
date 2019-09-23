module.exports = function(req, res, next){ //solicitud, respuesta y el siguiente middleware
    if(!req.session.user_id){ //validamos si teneomos una sesion y que tengamos un user_id
        res.redirect("/login");
    }
    else{
        next();
    }
}
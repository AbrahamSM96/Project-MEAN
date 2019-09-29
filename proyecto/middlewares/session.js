var User = require("../models/user").User;

module.exports = function(req, res, next){ //solicitud, respuesta y el siguiente middleware
    if(!req.session.user_id){ //validamos si tenemos una sesion y que tengamos un user_id
        res.redirect("/login"); //redireccion hacia el login si no tenemos una sesion
    }
    else{
        User.findById(req.session.user_id, function(err,user){
            if(err){
                console.log(err);
                res.redirect("/login"); 
            }else{
                res.locals= {user: user} //sobrescribimos locals 
                next();
            }
     });
   }
}
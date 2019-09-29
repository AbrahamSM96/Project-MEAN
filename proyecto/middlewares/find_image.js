
var Imagen = require("../models/imagenes")
var owner_check = require("./image_permission");
module.exports = function(req,res,next){
   Imagen.findById(req.params.id)
   .populate("creator") // en mongo es como hacer el JOIN 
    .exec(function(err, imagen){
    if(imagen != null && owner_check(imagen,req, res)){
        console.log("Encontre la imagen "+ imagen.creator);
        res.locals.imagen = imagen; //guardamos imagen en los locals
        next();
    }else{
        res.redirect("/app"); // en caso de no encontrar la imagen, redireccionar a app
    }
   }) 
}
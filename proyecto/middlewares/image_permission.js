var Imagen = require("../models/imagenes");

module.exports = function(image, req,res){
    if(typeof image.creator == "undefined") 
    return false;
    // true = tienes permisos
    // false = SI no tienes permisos
    if(req.method === "GET" && req.path.indexOf("edit") < 0){ // si la peticion es GET y no contiene la palabra edit en el path, retornara verdadero
        //ver la imagen
        return true;
    }
    if(typeof image.creator == "undefined") return false;
    
    if(image.creator._id.toString() == res.locals.user._id){ //el id del creador de la imagen es igual al id del que inicio sesion o sea -->
        //Esta imagen yo la subi
        return true;
    } 
    return false;
}
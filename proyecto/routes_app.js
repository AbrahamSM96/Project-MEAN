var express = require("express");
var Imagen = require("./models/imagenes")
var router = express.Router(); // aqui creamos todas las rutas
var fs = require("fs"); // permite mover archivos

var image_finder_middleware = require("./middlewares/find_image");



// app.com/app/  todas las rutas vienen montadas en /app porque lo definimos en app.js
router.get("/", function(req,res){
    Imagen.find({}) // buscamos todas las imagenes
            .populate("creator")
            .exec(function(err, imagenes){
                if(err) console.log(err);
                res.render("app/home", {imagenes: imagenes}) // mostramos las imagenes de la base de datos
            })
});

// REST

router.get("/imagenes/new", function (req,res) { // muestra el formulario
   res.render("app/imagenes/new")
 });

 router.all("/imagenes/:id*", image_finder_middleware) // middleware para optimizar codigo por findbyid

 router.get("/imagenes/:id/edit", function (req,res) { // muestra el formulario
    res.render("app/imagenes/edit");
 });

router.route("/imagenes/:id") //id de imagenes
    .get(function(req,res){
            res.render("app/imagenes/show");
    })
    .put(function (req,res) { 
        res.locals.imagen.title = req.body.title;
        res.locals.imagen.save(function(err){
            if(!err){
                res.render("app/imagenes/show");
            }else{
                res.render("app/imagenes/"+req.params.id+"/edit");
            }
        })
     }) 
     .delete(function(req,res){
        //eliminar imagenes
        Imagen.findOneAndDelete({_id: req.params.id}, function(err){ //params accedemos al :id
            if(!err){
                res.redirect("/app/imagenes");
            }else{
                console.log(err);
                res.redirect("/app/imagenes"+req.params.id);
            }
        });
     });   

router.route("/imagenes") //coleccion de imagenes
    .get(function(req,res){
        Imagen.find({creator: res.locals.user._id}, function(err, imagenes){// creator: nos devuelve las imagenes que solo son visibles por el usuario que las creo
            if(err){
                res.redirect("/app"); return;
            }
            res.render("app/imagenes/index", {imagenes: imagenes})
        });
    })
    .post(function (req,res) {   
        var extension = req.body.archivo.name.split(".").pop(); // el split partira un string a partir del "." como imagen . jpg y pop obtendra el ultimo arreglo que es jpg
        var data = {
            title: req.body.title,
            creator: res.locals.user._id,
            extension: extension
        }
        var imagen = new Imagen(data); //se le pasa el json que esta en data
        imagen.save(function(err){ // guardamos la imagen
            if(!err){
                fs.rename(req.body.archivo.path, "public/imagenes" + imagen._id + "." + extension) //pasamos en donde se encuentra la imagen originalmente por el "path" y el segundo es para indicar para donde vamos a mover las imagenes
                res.redirect("/app/imagenes/"+imagen._id) // si no hay error la redireccionamos imagenes id
            }
            else{
                console.log(imagen);
                res.render(err);
            }
        })
     });

module.exports = router;
var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session")

var app = express();

//Middlewares // son los que se ejecutan antes de una peticion
app.use("/public", express.static('public')); //para acceder a metodos publicos desde el localhost, solo en /public
app.use(bodyParser.json()); // para peticiones application/json
app.use(bodyParser.urlencoded({extended: true})); // define con que algoritmo hara el parser la libreria

// /app/  <-- ruta app


// /  <-- ruta / paginas que no requieran inicio de sesion


app.use(session({
    secret: "123qwerty123", //identificador para nuestra session unico
    resave: false, // true: la sesion se vuelve a guardar aunque no haya sido modificada mediante el proceso de la peticion
                // cuando dos usuarios intentan acceder de manera paralela y se contaminan las sesiones
    saveUninitialized:false  //indica si la sesion debe de guardarse aun si no esta inicializada
    //genid: function(req){ //id unico para la sessio
    //}
}));


app.set("view engine", "jade");

//verbos http  => GET / POST

app.get("/", function(req,res){ //Home de nuestra pagina
    console.log(req.session.user_id);
    res.render("index");
});

app.get("/singup", function(req,res){ // entrada al singup
    User.find(function(err, doc){
        console.log(doc);
        res.render("singup");
    });
});

app.get("/login", function(req,res){ //me redirecciona a login
        res.render("login");

});

app.post("/users", function(req,res){
    var user = new User({email: req.body.email, // crea un nuevo usuario con las peticiones que se mandan
        password: req.body.password, 
        password_confirmation: req.body.password_confirmation,
        username: req.body.username
    });    
    user.save(function(err,user, numero){ // mongo guarda los datos
    if(err){
    console.log(String(err));
    }
    res.send("guardamos tus datos");
  });    

  user.save().then(function(us){ // es un promesa para saber si guardo o no los datos
    res.send("Guardamos el usuario exitosamente"); //se ejecuta si todo salio bien
  }, function(err){
      if(err){ // se ejecuta si algo salio mal
          console.log(String(err));
          res.send("No pudimos guardad la informacion")
          
      }
  });


});

app.post("/sessions", function(req,res){ 

    User.findOne({email: req.body.email, password: req.body.password}, function(err,user){ // Con este metodo recogo los datos guardados
                                                                                            //para poder iniciar secion
        req.session.user_id = user._id; // _i es el id que mongo le asigna al documento para identificarlo en la base de datoss
        res.send("Hola perro")
    });
});


app.use("/app", router_app);
app.use("/app", session_middleware)


app.listen(8080);

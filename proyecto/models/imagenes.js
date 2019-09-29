var mongoose = require("mongoose");
var Schema = mongoose.Schema; 

var img_schema = new Schema({ //esquema de la imagen
    title:{type: String, required: true}, //validacion para que el titulo siempre este presente 
    creator: {type: Schema.Types.ObjectId, ref: "User"}, // es como si fuera una llave foranea ya que hace referencia a User
    extension:{type: String, required: true}
});
var Image = mongoose.model("Imagen", img_schema);

module.exports = Image;
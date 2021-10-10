const mongoose = require("mongoose");




 let userschema = mongoose.Schema({
    firstname : String,
    lastname : String,
    
  
})


module.exports = mongoose.model("user",userschema);
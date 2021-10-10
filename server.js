const express = require("express")
const app = express()
const mongoose = require("mongoose")
const hbs = require("hbs")
const sessions = require("express-session")
const cookieParser = require("cookie-parser")

app.use(cookieParser());




const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

const user = require("./model/model")

mongoose.connect("mongodb://127.0.0.1:27017/newdatabase",{useNewUrlParser : true})

app.use(express.json())
app.use(express.urlencoded({extended : false}))


const mongo = mongoose.connection;

mongo.once("open",() => { console.log("succesfully connected")})

app.set("view engine","hbs");
app.set("views","views");









app.get("/",(req,res) =>{
    res.render("index")

  
})


 app.post("/",async(req,res) => {

 
 
  if(req.body.firstname[0]==""||req.body.lastname[0]==""){
       res.render("index",{
           empty : "please enter the detailes"
       })
       
   }else{
       
    let user1 = new user({
        firstname : req.body.firstname[0],
        lastname : req.body.lastname[0],
    })

   await user1.save((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("entery succefull")
        }
    })

    user.find((err,user2)=>{
    
        res.redirect("/alluser")
  
       /*res.render("index",{
            user4 : user2
        })*/
        
      })
    

   } 
 }) 

 app.get("/alluser",(req,res) =>{

    user.find((err,user2)=>{
    
   
        res.render("tabel",{
            user4 : user2
        })
        
      })

 })


 app.post("/login",(req,res) => {

      let session = req.session
    
    user.find({ firstname:req.body.firstname},{lastname:req.body.lastname},function (err, doc) {
        if (err){
            console.log(err);
        }
        else{
           
            console.log(doc[0].lastname)

            session.lastname = doc[0].lastname

            res.redirect("/secret")
        
           

            

          

         

            console.log("login succesfull and session created")
            
        }
    });
 })



app.get("/secret",(req,res) => {

    let session = req.session
    console.log(session)
    if(session.lastname){
        res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`)
    }else{
        res.send("u dont have id login please")
    }
})


app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect("/");
});


    app.post("/delete",async(req,res) => {

        await user.deleteMany({firstname : req.body.firstname,lastname : req.body.lastname}).then(() => {
            console.log("delete succesfull")
        })

        user.find({},(err,user2)=>{
       
            res.render("index",{
                user4 : user2
            })
          })

    })

    

   

  
  



app.listen(3000)
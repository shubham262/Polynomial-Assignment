const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const { v4: uuidv4 } = require('uuid');
const fetch = require('cross-fetch');



const app = express();


var session = require('express-session');
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://Shubham:shubham@cluster0.1sqrd.mongodb.net/polynomial");



const polySchema={
id:String,
key:String,
content:String,
url:String,
title:String
}
const post=mongoose.model("post",polySchema);
var check=false;var currdel;var authenticated=false;
app.get("/", function (req, res) {
    const message=req.session.message;
    res.render("home",{checking:check,object:message});
    req.session.message="";authenticated=false;
  });

  app.get("/delete",function(req,res){

      post.findByIdAndRemove(currdel._id, function (err) {
      if (err) {
        console.log(err);
      } else {
        //   alert("Your Code was Successfully deleted")
        authenticated=false;
        res.redirect("/");
        console.log(
          currdel + "successfully deleted from the database"
        );
      }
    });
   
});
app.get("/snippets",function(req,res){
    post.find({}, function(err, users) {
        res.render("mysnippets", {objects: users});
     });




})
app.get("/authen",function(req,res){
    res.render("auth");
});

app.post("/authen",function(req,res){

const password=req.body.pass;
if(password===currdel.key){
    authenticated=true;
    
    res.redirect(currdel.url);
}
else{
    alert("invalid Key")
}




})

  app.get("/:customlistName", function (req, res) {
    const customlistname = req.params.customlistName;
    
    post.findOne({id:customlistname},function(err,found){
        if(!err){
            if(found){
                currdel=found;
                console.log(currdel)
                if(!authenticated){res.redirect("/authen");}
                else{res.render("postsss",{object:found})}
                
                
            }
            else{res.send("invalid url")}
        }

    })
  });

 


app.post("/submitcode",function(req,res){
console.log(req.body)
const newid=uuidv4();
const longurl="http://localhost:3000/"+newid;


if(req.body.btn=="added"){
   
    const ner=new post({
    id:newid,
    key:Math.floor(1000 + Math.random() * 9000),
    content:req.body.ta,
    url:longurl,
    title:req.body.title
    
});
ner.save();
req.session.message=ner;
check=!check;
console.log(ner);
res.redirect("/");
}

else{
    check=!check;
    res.redirect("/");
}



})

// app.post("/add",function(req,res){
// check=!check;res.redirect("/")


// })


//shorting url

// fetch('https://api.shrtco.de/v2/shorten?url=http://localhost:3000/2c1b85ee-c553-4dbb-962f-ba57153fe1d8')
//   .then(response => response.json())
//   .then(data => console.log(data));



app.listen(3000, function () {
    console.log("Server started on port 3000");
    console.log(check);
});
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl.js");

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/shortDB",()=>{
    console.log("Mongo is Connected");
})


app.get("/",async(req,res)=>{
    const shorturls = await shortUrl.find();
    res.render("index",{shorturls:shorturls});
})

app.post("/shortUrl",async(req,res)=>{
  try{
    await shortUrl.create({full:req.body.fullUrl})
    res.redirect("/");
  }
  catch(e){
    console.log(e.message);
  }
})

app.get("/:shortUrl",async (req,res)=>{
    const shorturl = await shortUrl.findOne({short:req.params.shortUrl});
    if (shorturl == null) return res.sendStatus(404)

    shorturl.Clicks++
    shorturl.save()

    res.redirect(shorturl.full);
})

app.listen(process.env.PORT || 8000,function(){
    console.log("Server is running");
})
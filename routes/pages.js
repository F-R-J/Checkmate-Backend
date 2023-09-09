const express = require("express");
const database = require('../db/db')
const Session = require("../db/models/chessSchema")
const fs = require("fs");
//const uid = require('../username')
const router = express.Router();

const setuser = async (req,res,next)=>{
  var cookies=(function(str){ 
    var result={};
    str.split(/;\s+/).forEach(function(e){
      var parts=e.split(/=/,2);
      result[parts[0]]=parts[1]||'';
    });
    return result;
  })(req.headers.cookie),
  sessionCookieName='checkmate',
  sessionId=cookies[sessionCookieName]||'nothing';
  sessionId = sessionId.slice(4).trim();
  var idd = sessionId.split('.',2);
  console.log(idd);
  let user = await Session.findOne({ID: idd[0] });
  if(user){
    console.log(user);
    req.session.uid = user.uid;
  }else{
    console.log("no user");
  }
  // database.query(
  //   "Select * from sessiontbl where session_id=?",[id[0]], async (error,result) =>{
  //     if(error){
  //       console.log(error)
  //     }
  //     else{
  //       if(result.length > 0){
  //         const user1 = JSON.parse(result[0].data.toString())
  //         console.log(user1.Uid)
  //         req.session.uid = user1.Uid;
  //         console.log("In set userid");
  //         console.log(req.session.uid);
  //       }
  //     }
  //   } 
  // )
  next()
}
//setuser
router.get("/", setuser ,(req, res) => {
  res.render("joinpage");
});

router.get("/joinpage", (req, res) => {
  res.render("joinpage");
});

router.get("/index", (req, res) => {
  res.render("./index/index",{
      uid: req.session.uid,
      mode: req.session.mode
  });
});
router.post("/index/online", (req, res) => {
  req.session.mode='online'
  res.redirect('/index')
});
router.post("/index/ai", (req, res) => {
  req.session.mode='ai'
  res.redirect('/index')
});
router.post("/index/friend", (req, res) => {
  req.session.mode='friend'
  res.redirect('/index')
});
module.exports = router;

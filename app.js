var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const mysql = require('mysql')
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var compression = require("compression");
var helmet = require("helmet");
var index = require("./routes/index");
//var user1 = require('./username')
//const fs = require('fs')
// const uname = require('./username')
// const lol = uname.name()
// console.log("app :" + lol)
var app = express();


//var name;
// fs.readFileSync('user.json','utf-8',(err,data)=>{
//   const user = JSON.parse(data.toString());
//   console.log(user);
//   name = user.uid;
//   console.log(name)
//   app.set('uname',name);
// })
// async function getname(){
//     const user = fs.readFileSync('user.json','utf-8');
//     console.log(user)
//     return user
// }

//app.set('uname',getname())

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.locals.basedir = path.join(__dirname, "views");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(helmet());

var options = {
  host:'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'checkmate',
};

var connection = mysql.createConnection(options);
var sessionStore = new MySQLStore(
  {
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
      tableName: "sessiontblgamesite",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  connection
);

app.use(
  session({
    key: "checkmategame",
    secret: "sdp@checkmate",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
  })
);


app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

// app.use("/index", index);
// app.get("/*", (req, res) => {
//   res.redirect("/index");
// });

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   //res.render("error");
// });

//start the server with "start": "nodemon ./bin/www/app.js" in package.json

module.exports = app;

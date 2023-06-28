var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let musicRouter = require("./routes/music");
let authRouter = require("./routes/auth");
let followRouter = require("./routes/follow");
let likeRouter = require("./routes/like");
let commentRouter = require("./routes/Comment");

const firebaseAdmin = require("firebase-admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/music", musicRouter);
app.use("/auth", authRouter);
app.use("/follow", followRouter);
app.use("/like", likeRouter);
app.use("/comment", commentRouter);

const serviceAccount = require("./security/impulsion-6bca6-firebase-adminsdk-w7go6-f24f59f4a0.json");

if(!firebaseAdmin.apps.length){
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://impulsion-6bca6.firebaseio.com",
    storageBucket: "impulsion-6bca6.appspot.com",
  });
  firebaseAdmin.firestore().settings({ ignoreUndefinedProperties:true});
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// const db = require("./models");

// if (process.env.NODE_ENV !== "test") {
//   db.sequelize
//     .sync()
//     .catch((err) => {
//       console.log(err);
//     });
// }

module.exports = app;

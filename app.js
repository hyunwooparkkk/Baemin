var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var navRouter = require("./routes/nav");
var mainmenuRouter = require("./routes/mainmenu");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "@#@$MYSIGN#@$#$",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/image", express.static("./upload"));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/nav", navRouter);
app.use("/mainmenu", mainmenuRouter);

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

app.io = require("socket.io")();

app.io.on("connection", function (socket) {
  socket.on("message", function (data) {
    if (data.id == 1) {
      console.log("굳굳");
      console.log("client send data: ", data);
      socket.broadcast.emit("message", data);
    }
  });
});

module.exports = app;

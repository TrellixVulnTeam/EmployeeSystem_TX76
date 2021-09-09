require("dotenv").config();
const User = require("./models/User");
const expressSession = require("express-session");

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");



/**
 * Controllers (route handlers).
 */

const userController = require("./controllers/user");
const employeeController = require("./controllers/employee");

const app = express();
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

/***
 * We are applying our middlewear
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))
global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/join", (req, res) => {
  res.render("create-user");
});

app.get("/login", (req, res) => {
  res.render("login-user");
});

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}
app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})
app.get("/create-employee", authMiddleware, (req, res) => {
  res.render("create-employee", { errors: {} });
});



app.post("/create-employee", employeeController.create);
app.post("/create-user", userController.create);
app.post("/login-user", userController.login);



app.get("/employees", employeeController.list);
app.get("/employees/delete/:id", employeeController.delete);
app.get("/employees/update/:id", employeeController.edit);
app.post("/employees/update/:id", employeeController.update);



app.listen(PORT, () => {
  console.log(
    `Example app listening at http://localhost:${PORT}`,
    chalk.green("✓")
  );
});

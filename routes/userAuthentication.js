const express = require("express");
let route = require("express").Router();
const { execute } = require("../dbConnection/executeQuery");
require("../middlewares/passport");
route.use(express.static(__dirname + "/public"));
let bookpage = require("../controllers/bookpages/bookpage");
const { fetchdata } = require("../controllers/bookpages/query");

const { registerValidation } = require("../middlewares/registrationValidation");
const { loginUser,registerNewUser,registerInsertion, createUserPassword, insertPassword, checkCredentials, forgetPass, checkUserName, createForgetUserPassword, insertForgetPassword, doLogout } = require("../controllers/registerLoginController/loginUser");
const { checkpass } = require("../middlewares/checkPass");
const { checklogin } = require("../middlewares/checklogin");
const passport = require("passport");
const { userLoginTry } = require("../middlewares/userLoginTry");
const { checkPassForget } = require("../middlewares/checkPassForget");

route.route("/").get(registerNewUser).post(registerValidation, registerInsertion);
route.route("/registerUser").get(registerNewUser).post(registerValidation, registerInsertion);
route.route("/login").get(loginUser).post(checklogin, userLoginTry, checkCredentials);
route.get("/createPass", createUserPassword);
route.post("/insertPass", checkpass, insertPassword);
route.route("/forgetPass").get(forgetPass).post(checkUserName);

route.get("/createPassForget",createForgetUserPassword);
route.post("/insertPassForget",checkPassForget,insertForgetPassword);
route.get('/logout',doLogout)
route.get("/bookhome",passport.authenticate('jwt',{session:false,failureRedirect :'/login'}),bookpage.bookhome);

module.exports = route;

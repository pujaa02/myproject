const route = require("express").Router();
let bookpage = require("../controllers/bookpages/bookpage");
const { fetchdata } = require("../controllers/bookpages/query");
const { fetchuserdata } = require("../controllers/bookpages/query");
const passport = require("passport");
let authe = require("../middlewares/passport");

route.get("/fetchdata",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),fetchdata);
route.get("/fetchuserdata",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),fetchuserdata);
route.get("/bookmyshelf",passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),bookpage.bookmyshelf);
route.post("/rmvwatchlist/:id/:user_id",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),bookpage.deletewatchlist);
route.get("/about",passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),bookpage.about);
route.get("/support",passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),bookpage.support);
route.get("/terms_condition",passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),bookpage.terms_condition);
route.post("/exp",passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),bookpage.exportpdf);
route.get("/user",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),bookpage.user);
module.exports = route;
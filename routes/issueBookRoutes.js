const express=require("express");
const { issueBook, returnBook, getAllBookWithCount } = require("../controllers/issueBook");
const router=express.Router();
const passport = require("passport");

router.post("/issueBook",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),issueBook);
router.post("/returnBook",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),returnBook);
router.get("/getAllBooks",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),getAllBookWithCount)

module.exports=router;

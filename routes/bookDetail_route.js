let route = require("express").Router();
require("../middlewares/passport");
const passport = require("passport");
const multer = require("multer");
const storagecom = require('../middlewares/multer2.js');
const uploadcom = multer({ storage: storagecom });
const {comvalidation} = require('../middlewares/comvalidation.js')
const { BookDetails, bookdetail, addtofav, contributebook, contribute_post, fetchcontro, fetchcomment, fetchnestedcmt, postcomment, postnestedcomment, formpdf,community,postincommunity, fetchcommunity } = require("../controllers/bookDetail/bookDetail");
route.get('/book_in_detail', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),bookdetail);
route.get('/bookDetails', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), BookDetails);
route.get('/addtofav', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), addtofav);
route.get('/fetchcomment/', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),fetchcomment);
route.get('/fetchnestedcmt', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),fetchnestedcmt)
route.get('/postcomment', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),postcomment)
route.get('/postnestedcomment', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),postnestedcomment)
route.get('/contribute_book', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),contributebook)
route.get('/fetch_contro', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),fetchcontro);
route.post('/contribute_post', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),contribute_post)
route.get('/form',passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),formpdf);
route.get('/community',passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),community);
route.get('/fetchcom',passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),fetchcommunity);
route.post('/postcomupload',passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),uploadcom.single("image"),comvalidation,postincommunity)
module.exports = route;
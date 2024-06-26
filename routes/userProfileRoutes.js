const express = require("express");
const route = require("express").Router();
const multer = require("multer");
const updateValidate = require("../middlewares/updateValidation");
const { check, validationResult } = require('express-validator');
route.use(express.static('public'));
const storage = require('../middlewares/multer.js');
const upload = multer({ storage: storage });
const { fileValidateMiddleware } = require('../middlewares/imagevalidation.js');
const { handleValidatorerrors } = require("../middlewares/validationaauthor");
const { showUserProfile, showPersonalDetail, seenMsg, deleteComment, showAllComments,
    showWatchlist, showBookIssued, deleteFromFav, deleteNotification, deleteAllNotification, showAllNotification, showAllBooklist, uploadUserImg, removeImg,
    showUpdateProfile, showNotification, showBookDetail, updateUser, sendReply, logoutUser, showAllWatchlist, searchNotify, showAllNotiBySearch } = require('../controllers/userProfileController/usersProfile');
const { showSensation, showSensationPage, addLike, sendComment, disLike } = require('../controllers/sensationController/sensation.js');
require("../middlewares/passport");
const passport = require("passport");
route.get('/userProfile', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showUserProfile);
route.get('/personalDetail', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showPersonalDetail);
route.get('/watchlist', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showWatchlist);
route.get('/booksIssued', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showBookIssued);
route.get('/updateProfile', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showUpdateProfile);
route.get('/notification', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showNotification);
route.get('/bookDetail', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showBookDetail);
route.post('/updateUserData', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), updateValidate, updateUser);
route.post('/sendReply', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), sendReply);
route.get('/deleteFromFav', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), deleteFromFav);
route.get('/deleteAllNotification', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), deleteAllNotification);
route.get('/deleteNotification', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), deleteNotification);
route.get('/seenMsg', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), seenMsg);
route.get('/deleteComment', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), deleteComment);
route.get('/showAllComments', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showAllComments);
route.get('/showAllWatchlist', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showAllWatchlist);
route.get('/showAllNotification', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showAllNotification);
route.get('/showAllBooklist', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showAllBooklist);
route.post('/uploadUserImg', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), upload.single("user_img"), fileValidateMiddleware, handleValidatorerrors, uploadUserImg);
route.get('/removeImg',passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),removeImg);
route.get('/logout',passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),logoutUser)
route.post("/searchNotify", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), searchNotify);
route.get('/showAllNotiBySearch',passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),showAllNotiBySearch);
route.get("/showSensationPage", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showSensationPage);
route.get('/showSensation', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), showSensation);
route.post("/addSenLike", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), addLike);
route.post("/sendComment", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), sendComment);
route.post("/disLikeSen", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), disLike);
module.exports = route;
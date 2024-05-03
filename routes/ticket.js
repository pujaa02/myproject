let route = require("express").Router();
require("../middlewares/passport");
const passport = require("passport");
const {index,ticketData,ticketChat,ticketChatData, ticketUpdate, ticketStatus} = require('../controllers/ticket');
const multer = require("multer");
const storage = require('../middlewares/multer'); 
const upload = multer({ storage: storage });



route.get('/ticket',passport.authenticate('jwt',{session:false,failureRedirect :'/login'}),index);
route.post('/ticket',passport.authenticate('jwt',{session:false,failureRedirect :'/login'}),ticketData);
route.get('/ticket/chat',passport.authenticate('jwt',{session:false,failureRedirect :'/login'}),ticketChat);
route.post('/ticket/chat',passport.authenticate('jwt',{session:false,failureRedirect :'/login'}),ticketChatData);
route.post('/ticket/update',passport.authenticate('jwt',{session:false,failureRedirect :'/login'}),ticketUpdate);
route.post('/ticket/status',passport.authenticate('jwt',{session:false,failureRedirect :'/login'}),ticketStatus);


module.exports = route;

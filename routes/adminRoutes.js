
const express = require("express");
const passport = require("passport");
require("../middlewares/passport");
const { addBook, saveBook, listBook, showRatingsOrder, about, deleteBook, editBook, getInventory, updateBook, showInventory, addInventory, getGenres, deleteInventory, adminHome, showRatings, listAuthors, showRequests, getAllUsers, getSingleUser, updateUser, deleteUser, editUSer, listsFilterBooks, listsFilterUser, showBooksById, insertReturnData, listsOfFilterUser, bookIssueAdmin, validateUser, finalBookIssue, listBookOrder, listAuthorsOrder, getAllUsersOrder, showBooksByIdDetails, showRequestsOrder, addCategory, charData, pdfGenerate, getAllUsersCount, getAllUserMonth, getAllUsersCountdeleted, latestBooks, popularBooks, authorWithBooks, report, getAllLanguages } = require("../controllers/adminController/admin");
const { addSensation, postSensation, showSenReview, showSenReviewPage, showComments, showLikes, deleteSen } = require("../controllers/adminController/sensation");
const { checkAdmin } = require("../middlewares/checkAdmin");
const { ticketIndex, ticketChat, ticketChatData, ticketUpdate } = require('../controllers/adminController/ticket')
const route = require("express").Router();
route.use(express.static('public'));
const multer = require("multer");
const { handleValidatorerrors } = require("../middlewares/validationaauthor");
const { createBookValidationRules } = require("../middlewares/validationbook");
const { senFormVal, handleValerrors } = require("../middlewares/senFormValid.js")
const { index } = require("../controllers/bookSearch");
const { ticketStatus } = require("../controllers/ticket.js");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
route.get('/addBook', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, addBook)
route.get('/addBook', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, addBook)
route.get('/bookIssueAdmin', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, bookIssueAdmin)
route.post('/addBook', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, upload.single("image"), createBookValidationRules, handleValidatorerrors, saveBook)
route.get('/editBook', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, editBook)
route.post('/editBook', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, upload.single("image"), createBookValidationRules, handleValidatorerrors, updateBook)
route.get('/deleteBook', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, deleteBook)
route.get('/listBook', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, listBook)
route.get('/listBook/:column/:order', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, listBookOrder)
route.get('/showInventory', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showInventory)
route.get('/addInventory/:bookid', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, addInventory)
route.get('/deleteInventory/:bookid', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, deleteInventory)
route.get('/listAuthors', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, listAuthors)
route.get('/listAuthors/:column/:order', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, listAuthorsOrder)
route.get('/listRequests', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showRequests)
route.get('/listRequests/:column/:order', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showRequestsOrder)
route.get('/', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, checkAdmin, adminHome)
route.get('/showRating', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showRatings)
route.get('/showRating/:column/:order', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showRatingsOrder)
route.get("/getAllUsers", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, getAllUsers);
route.get("/getAllUsers/:column/:order", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, getAllUsersOrder);
route.get("/getSingleUser/:id", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, getSingleUser)
route.get("/editUser/:userid", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, editUSer)
route.post("/updateUser", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, updateUser)
route.get("/deleteUser/:id", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, deleteUser);
route.get("/listsFilterUser", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, listsFilterUser);
route.get("/showBooksById", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showBooksById);
route.post("/insertReturnData", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, insertReturnData);
route.get("/listsOfFilterUser", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, listsOfFilterUser);
route.get("/deleteUser/:id", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, deleteUser)
route.get("/listsFilterUser", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, listsFilterUser)
route.get("/listsOfFilterUser", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, listsOfFilterUser)
route.get("/showBooksById", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showBooksById)
route.get("/showBooksByIdDetails", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showBooksByIdDetails)
route.post("/insertReturnData", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, insertReturnData)
route.post("/validateUser", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, validateUser)
route.post("/finalBookIssue", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, finalBookIssue)
route.post("/addnewcategory", addCategory);
route.get("/getGenres", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, getGenres);
route.get('/chartData', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, charData)
route.get("/showBook/inventory", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, getInventory);
route.get("/about", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, about);
route.get("/ticket", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, ticketIndex);
route.get("/ticket/chat", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, ticketChat);
route.post("/ticket/chat", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, ticketChatData);
route.post("/ticket/update", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, ticketUpdate);
route.post("/ticket/status", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, ticketStatus);
route.get("/sensation", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, addSensation);
route.post("/addsensation", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, upload.single("eventImgs"), postSensation);
route.get("/pdfGenerate",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,pdfGenerate);
route.get("/getAllUsersCount",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,getAllUsersCount)
route.get("/getAllUserMonth",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,getAllUserMonth)
route.get("/getAllUsersCountdeleted",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,getAllUsersCountdeleted)
route.get("/getlatestBooks",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,latestBooks)
route.get("/getPopularBooks",passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,popularBooks)
route.get("/getAuthorsWithBooks", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,authorWithBooks)
route.get("/report", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,report)
route.get("/getLanguages", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin,getAllLanguages)
route.post("/addsensation", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, upload.array("eventImgs", 5), senFormVal, handleValerrors, postSensation);
route.get("/senReview", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showSenReview);
route.get("/showSenReview", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showSenReview);
route.get("/showComments", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showComments);
route.get("/showLikes", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, showLikes);
route.get("/deleteSen", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkAdmin, deleteSen);


module.exports = route;



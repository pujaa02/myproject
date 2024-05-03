const { check, validationResult } = require('express-validator');
const validate = [
    check('fname').notEmpty().withMessage("enter your first name").trim()
        .matches(/^[A-Za-z]+$/).withMessage("Name Should contain characters")
        .isLength({ max: 15 }).withMessage("your first name should atmost 15 character large")
        .isLength({ min: 3 }).withMessage("your first name should be atleast 3 character long"),

    check('lname').notEmpty().withMessage("enter your first name").trim().
        isLength({ min: 3 }).withMessage("your  name is too short")
        .isLength({ max: 15 }).withMessage("your first name is too large")
        .matches(/^[A-Za-z]+$/).withMessage("your name should contain only character")
    ,

    check('email').notEmpty().withMessage("please enter your email").trim()
        .isEmail().withMessage("invalid message")
        .escape().normalizeEmail(),

    check('address').notEmpty().withMessage("please ener your address").trim()
        .isLength({ min: 15 }).withMessage("your address should have atleast 15 character")
    ,
    check('contact').notEmpty().withMessage("please enter your contact number").trim().
        matches(/^[0-9]{10}$/).withMessage("your contact should contain only number")
    ,
    check('dob').notEmpty().withMessage("please enter your date of birth").trim()
        .isISO8601('yyyy-mm-dd')
        .matches(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).withMessage("invalide date of birth ")
    ,

    check('gender').notEmpty().withMessage("select your gender")
]

module.exports = validate;
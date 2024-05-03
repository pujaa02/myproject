const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


exports.createBookValidationRules = [
    body("title").trim().notEmpty().withMessage("title is required").isLength({ min: 5, max: 30 }).withMessage("title must be between 5 and 30 characters"),
    body("desc").trim().notEmpty().withMessage("description is required").isLength({ min: 50, max: 250 }).withMessage("description must be between 50 and 250 characters"),
    body('image').custom((value, { req }) => {
    
      if(req.body.bookid && !req.file){
        return true;
      }
        if (!req.file ) {
            throw new Error("file must be uploaded")
        }
        const filTypes = /jpeg|jpg|png|gif/;

     
        if (req.file.size > 20000) {
            throw new Error("maximum size of file must be less than 10 bytes");
        }
        const mimeType = filTypes.test(req.file.mimetype)
      
        if (!mimeType) {
            throw new Error("Invalid file type");
        }
        return true;
    }),
    body("publication").trim().notEmpty().withMessage("publication name is required").isLength({ min: 5, max: 30 }).withMessage("publication must be between 5 and 30 characters")
    , body("isbn").trim().notEmpty().withMessage("isbn is required").isNumeric().withMessage("isbn must be in digits").isLength({ min: 13, max:13 }).withMessage("isbn must be between in 13 digits"),
    body("publicationyear").notEmpty().withMessage("publication year is required").isNumeric().withMessage("only numeric value is allowed").isLength({ min: 4, max: 4 }).withMessage("please enter valid year")
]




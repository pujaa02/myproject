const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
const createAuthorValidationRules = [
    body('author_name').trim().notEmpty().withMessage("name is required").isLength({ min: 5, max: 50 }).withMessage('Name must be between 5 and  50 characters'),
    body('author_desc').trim().notEmpty().withMessage("Desciption is required").isLength({ min: 50, max: 250 }).withMessage("description must be between 50 and 250 characters")
    , body('image').custom((value,{req})=>{
        if(req.body.id && !req.file){
            return true;
          }
            if(!req.file){
                throw new Error("file must be uploaded")
            }
            const filTypes=/jpeg|jpg|png|gif/;
            if(req.file.size>20000){
                throw new Error("maximum size of file must be less than 20 kilobytes");
            }
            const mimeType=filTypes.test(req.file.mimetype)
            if(!mimeType){
                throw new Error("Invalid file type");
            }
            return true;
        })
    
]

const fileValidateMiddleware=[
    body('image').custom((value,{req})=>{
        if(!req.file){
            throw new Error("file must be uploaded")
        }
        const filTypes=/jpeg|jpg|png|gif/;
        if(req.body.file.size>20000){
            throw new Error("maximum size of file must be less than 10 bytes");
        }
        const mimeType=filTypes.test(req.file.mimetype)
        if(!mimeType){
            throw new Error("Invalid file type");
        }
        return true;
    })
]

const handleValidatorerrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), isError: true ,message:"error"});
    }
    next();
}


module.exports = { createAuthorValidationRules, fileValidateMiddleware,handleValidatorerrors }



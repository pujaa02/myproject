
const express=require("express");
const app=express();
app.use(express.json())
const {body,validationResult}=require("express-validator");
const fileValidateMiddleware=[
    body('file').custom((value,{req})=>{
        if(!req.file){
            throw new Error("file must be uploaded")
        }
        const filTypes=/jpeg|jpg|png|gif/;
        if(req.file.size>20000){
            throw new Error("maximum size of file must be less than 10 bytes");
        }
        const mimeType=filTypes.test(req.file.mimetype)
        if(!mimeType){
            throw new Error("Invalid file type");
        }
        return true;
    })
]


module.exports={fileValidateMiddleware}

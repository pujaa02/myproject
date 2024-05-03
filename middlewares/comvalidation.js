
const express=require("express");
const app=express();
app.use(express.json())
const {body,validationResult}=require("express-validator");
const comvalidation=[
    body('file').custom((value,{req})=>{
        const filTypes=/jpeg|jpg|png|gif|pdf|csv|txt|docx/;
        if(req.file.size>60000){
            throw new Error("maximum size error");
        }
        const mimeType=filTypes.test(req.file.mimetype)
        if(!mimeType){
            throw new Error("Invalid file type");
        }
        return true;
    })
]


module.exports={comvalidation}
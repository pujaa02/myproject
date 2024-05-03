
const data = require("../dbConnection/connection");
const { execute } = require("../dbConnection/executeQuery");

const express=require("express")
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const logger = require("../logger");

const createAuthor=async (req,res)=>{
    
    try {
        const { author_name, author_desc } = req.body;
        const query = "insert into authors (author_name,author_desc,author_img) values(?,?,?)";
        const params = [author_name, author_desc,"/uploads/"+req.file.filename];
        const result = await execute(query, params);
        if (result[0] === "error") {
            return res.status(200).json({ success: false, message: result[1].message })
        }
        return res.status(200).json({ success: true, message: "success" })

    } catch (error) {
        return res.status(200).json({ success: false, message: error.message })
    }
}
const updateAuthor = async (req, res) => {

    try {
        const id = req.body.id;
        const { author_name, author_desc } = req.body;
        let params;
        let query;
        if(req.file){
        params = [author_name, author_desc, "/uploads/"+req.file.filename,id];
        query = "update authors set author_name=?,author_desc=?,author_img=? where author_id=?";
        }
        else{
            params = [author_name, author_desc,id];
            query = "update authors set author_name=?,author_desc=? where author_id=?";
        }
        const result = await execute(query, params);
        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "No author Exist with this id" })
        }
        return res.status(200).json({ success: true, message: "success", result: result })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
const getAllAuthors = async (req, res) => {
    try {
        const query = "select * from authors order by creadted_at ";
        const result = await execute(query, []);
        if (result.length === 0) {
            return res.status(200).json({ success: false, message: "No authors Found" })
        }
        return res.status(200).json({ success: true, message: "get all author succesfully", authors: result })

    } catch (error) {
       logger.error(error)
    }
}

const getSingleAuthor = async (req, res) => {
    try {
        const id = req.params.id;
        const query = "select * from authors where author_id=?"
        const result = await execute(query, [id]);
        if (result.length === 0) {
            return res.status(200).json({ success: false, message: "No authors Found" })
        }
        res.render("authors/updateAuthor",{author:result[0]})
        // return res.json({ success: true, message: "get single author succesfully", result: result })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const uploadImag=(req,res)=>{
    res.send("file upload succesfully")
}


const getBooksByAuthor=async (req,res)=>{
  const query=''
}
module.exports={createAuthor,updateAuthor,getAllAuthors,getSingleAuthor,uploadImag}

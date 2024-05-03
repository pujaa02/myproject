const data = require("../dbConnection/connection");
const logger = require("../logger");
const { execute } = require("../dbConnection/executeQuery");
const issueBook = async (req, res) => {
    try {
        const { reader_id, book_id } = req.body;
        const query = 'insert into books_log(reader_id,book_id,borrow_date) values(?,?,current_timestamp())'
        const params = [reader_id, book_id]
        let result = await execute(query, params);
        if(result[0]==="error"){
            return res.status(200).json({success:false,message:result[1].message})
        }
       try {
            const query = 'update inventory set availability_status=0 where book_id=? ';
            const params = [book_id]
           const result1= await execute(query, params);
           if(result1[0]==="error"){
            return res.status(500).json({success:false,message:result1[1].message})
        }
        return res.status(200).json({ success: true, message: "issue book succesfully" })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
        
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
const returnBook = async (req, res) => {
    try {
        const { reader_id, book_id } = req.body;
        const query = 'update inventory set availability_status=1 where book_id=? ';
        const params = [book_id]
        let result = await execute(query, params);
        if(result[0]==="error"){
            return res.status(200).json({success:false,message:result[1].message})
        }
        return res.status(200).json({ success: true, message: "return book succesfully" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const getAllBookWithCount = async (req, res) => {
    try {
    const query= "select b.book_title,b.book_desc,book_img,b.prime_book_id,b.book_ISBN,b.book_publication,b.book_publication_year,count(*) as available from books_detail as b  inner join inventory as i where b.prime_book_id=i.prime_book_id and i.availability_status=? group by i.prime_book_id";
    const books=await execute(query,[1]);
    if(books[0]==="error"){
        return res.status(200).json({success:false,message:books[1].message})
    }
    if(books.length===0){
        return res.status(200).json({success:false,message:"No books found"})
    }
    // res.status(200).json({ success: true, books:books })
       res.render("booksVijay.ejs",{books:books[0] })

} catch (error) {
    return res.status(500).json({ success: false, message: error.message })
    }
}






module.exports = { issueBook, returnBook,getAllBookWithCount }
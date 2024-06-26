
const logger = require("../logger");
const { execute } = require("../dbConnection/executeQuery");
const con = require("../dbConnection/connection");
const { body } = require("express-validator");
const { off } = require("process");
const { dir, log } = require("console");
const { flatMap } = require("async");
const multer  = require('multer');
const { use } = require("passport");


exports.index = async (req,res)=>{
    try{
       let user_id = req.user[0].user_id;
       let sql =  `select tickets.id,issue,description,DATE_FORMAT(created_at, "%d/%m/%Y") as 'created_at',ticket_status.status from tickets join ticket_status on tickets.id = ticket_status.ticket_id and tickets.user_id = ${user_id}`;
       let result = await execute(sql);
       
       let sql1 =  `select tickets.id,issue,description,DATE_FORMAT(created_at, "%d/%m/%Y") as 'created_at',ticket_status.status from tickets join ticket_status on tickets.id = ticket_status.ticket_id and tickets.user_id = ${user_id} and ticket_status.status = 'Open'`;
       let result1 = await execute(sql1);

       let sql2 =  `select tickets.id,issue,description,DATE_FORMAT(created_at, "%d/%m/%Y") as 'created_at',DATE_FORMAT(ticket_status.update_at, "%d/%m/%Y") as 'updated_at',ticket_status.status from tickets join ticket_status on tickets.id = ticket_status.ticket_id and tickets.user_id = ${user_id} and ticket_status.status = 'Closed'`;
       let result2 = await execute(sql2);
       res.render('ticket',{result,result1,result2,user_id});
    }
    catch(e){
        logger.log(e);
    }
}

exports.ticketData = async (req,res)=>{
    try{
        let user_id = req.user[0].user_id;
        let issue = req.body.issue;
        let description = req.body.description;
        console.log(issue,description)
        issue = issue.replace(/\s\s+/g, ' ');
        description = description.replace(/\s\s+/g, ' ');
        let ticketNo = Math.floor(100000 + Math.random() * 900000);
        let sql = `insert into tickets (id,user_id,issue,description) values (?,?,?,?)`;
        let result =  await execute(sql,[ticketNo,user_id,issue,description]);
        let sql1 = `insert into ticket_status (ticket_id,status) values (?,?)`
        let status = 'Open'
        let result1 = await execute(sql1,[ticketNo,status]);
        res.redirect('/ticket')
    }
    catch(e){
        logger.error(e)
    }
}
exports.ticketChat = async(req,res)=>{
    try{
        let user_id = req.user[0].user_id;
        let id = req.query.ticket;
        let sql = `select * from message where ticket_id = ?`;
        let sql1 = `select users.u_fname,user_img.img_path from users join user_img on users.user_id = user_img.user_id and users.user_id = ${user_id}`;
        let sql2 = `select status from ticket_status where ticket_id = ?`;
        let result = await execute(sql,[id]);
        let result1 = await execute(sql1,[id]);
        let result2 = await execute(sql2,[id]);
        res.render('ticketChat',{user_id,id,result,result1,result2});
    }
    catch(e){
        logger.error(e);
    }
}
exports.ticketChatData = async(req,res) =>{
    try{
      let sql = `insert into message (ticket_id,message,user_id,send_at) values (?,?,?,now())`;
      await execute(sql,[req.body.ticket,req.body.msg,req.user[0].user_id]);
    }
    catch(e){
        logger.error(e);
    }
}

exports.ticketUpdate = async (req,res)=>{
    try{
        let id = req.body.ticket; 
        let sql = `update ticket_status set status = 'Closed' , update_at = now() where ticket_id = ?`;
        let chat = await execute(sql,[id]);
        return res.json('yes')
    }
    catch(e){
        logger.error(e);
    }
}
exports.ticketStatus = async (req,res)=>{
    try{
        let id = req.body.ticket; 
        let sql = `select status from ticket_status where ticket_id = ?`;
        let status = await execute(sql,[id]);
        res.json({status : status[0].status});
    }
    catch(e){
        logger.error(e);
    }
}
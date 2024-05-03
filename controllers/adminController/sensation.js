
const logger = require("../../logger");
const { execute } = require("../../dbConnection/executeQuery");

const addSensation = (req, res) => {
    res.render('admin/sensationForm');
}
const postSensation = async (req, res) => {
    let admin_id = req.user[0].user_id;
    
    let title = req.body.senTitle;
    let desc = req.body.senDesc;
    let query = "insert into sensation (admin_id,sensation_title, sensation_desc) values (?, ?, ?);";
    let result = await execute(query, [admin_id, title, desc]);
    let insertId = result.insertId;
    req.files.forEach(async (element) => {
        let imgPath = "/uploads/" + element.filename;
        let insertQuery = "insert into sensation_images (img_path, img_name,sensation_id) values (?,?,?);";
        let insertResult = await execute(insertQuery, [imgPath, element.originalname, insertId]);
    });
    res.json({ insertId: insertId, isError: false });
}
const showSenReviewPage = async (req, res) => {
    res.render('admin/senReview/showSenReview');
}
const showSenReview = async (req, res) => {
    let query = "select * from sensation where isDeleted=0;";
    let result = await execute(query);
    res.json({ result: result });
}
const showLikes = async (req, res) => {
    let sen_id = req.query.sen_id;
    let query = "select * from (select users.user_id,sensation_likes.created_at as liked_at,  sensation_likes.sensation_id, users.u_fname , users.u_email from users inner join sensation_likes on sensation_likes.user_id=users.user_id) as a inner join sensation on a.sensation_id=sensation.sensation_id where a.sensation_id=?;";
    let result = await execute(query, [sen_id]);
    res.json({ result: result });
}
const showComments = async (req, res) => {
    let sen_id = req.query.sen_id;
    let query = "select * from (select users.user_id, sensation_comments.created_at as commented_at,  sensation_comments. comment, sensation_id, users.u_fname , users.u_email from users inner join sensation_comments on sensation_comments.user_id=users.user_id) as a inner join sensation on a.sensation_id=sensation.sensation_id where a.sensation_id=?;";
    let result = await execute(query, [sen_id]);
  
    res.json({ result: result });
}
const deleteSen = async (req, res) => {
    let sen_id = req.query.sen_id;
    let query = "update sensation set isDeleted = 1 , deleted_at= current_timestamp() where sensation_id=?;";
    let result = await execute(query, [sen_id]);
    res.json({ result: result });
}
module.exports = { addSensation, postSensation, showSenReviewPage, showSenReview, showLikes, showComments, deleteSen };
const { execute } = require("../../dbConnection/executeQuery");
const showSensation = async (req, res) => {
    let user_id = req.user[0].user_id;
    let query = "select * from sensation where isDeleted=0 order by sensation_id desc;";
    let result = await execute(query);
    let query2 = "select * from sensation_images";
    let result2 = await execute(query2);
    let likes = "select * from sensation_likes where user_id=? and isDeleted=0";
    let likeresult = await execute(likes, [user_id]);
    let query3 = "select count(comment_id) as totalComments , sensation.sensation_id from sensation inner join  sensation_comments on sensation.sensation_id=sensation_comments.sensation_id group by  sensation.sensation_id"
    let result3 = await execute(query3);

    let query4 = "select count(like_id) as totalLikes , sensation.sensation_id from sensation inner join sensation_likes on sensation.sensation_id=sensation_likes.sensation_id  where sensation.isDeleted=0 and sensation_likes.isDeleted=0 group by sensation.sensation_id";
    let result4 = await execute(query4);
    res.json({ user_id: user_id, sensation: result, images: result2, likes: likeresult, totalComments: result3, totalLikes: result4 });
};

const showSensationPage = (req, res) => {
    let user_id = req.user[0].user_id;
    res.render("sensation/showSensation", { user_id: user_id });
}

const addLike = async (req, res) => {
  
    let user_id = req.body.user_id;
    let sen_id = req.body.sen_id;
    let query1 = " select * from sensation_likes where sensation_id=? and user_id=?;";
    let result1 = await execute(query1, [sen_id, user_id]);
    if (result1.length == 0) {
        let query = "insert into sensation_likes (sensation_id, user_id) values(?,?);";
        let result = await execute(query, [sen_id, user_id]);
      
        res.json(result);
    }
    else {
        let query = "update sensation_likes set isDeleted=0 , deleted_at=null where sensation_id=? and user_id=?;";
        let result = await execute(query, [sen_id, user_id]);
   
        res.json(result);
    }
}

const sendComment = async (req, res) => {
    let user_id = req.body.user_id;
    let sen_id = req.body.sen_id;
    let comment = req.body.comment;
    let query = "insert into sensation_comments (user_id, sensation_id, comment) values (?,?,?);";
    let result = await execute(query, [user_id, sen_id, comment]);

    res.json(result);
}

const disLike = async (req, res) => {
    let user_id = req.body.user_id;
    let sen_id = req.body.sen_id;
    let query = "update sensation_likes set isDeleted=1 , deleted_at=current_timestamp() where sensation_id=? and user_id=?;";
    let result = await execute(query, [sen_id, user_id]);
    res.json(result);
}

module.exports = { showSensation, showSensationPage, addLike, sendComment, disLike };

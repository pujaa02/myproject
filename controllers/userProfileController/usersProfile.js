const { execute } = require("../../dbConnection/executeQuery");
const { check, validationResult } = require("express-validator");

const showUserProfile = async (req, res) => {
  let component = "personalDetails";
  let id = req.user[0].user_id;
  let uquery = "select * from users where user_id=?;";
  let uresult = await execute(uquery, [id]);
  let query =
    "select * from (select a.book_id, days, reader_id, date(borrow_date) as borrow_date, prime_book_id from (select book_id, timestampdiff(day, date(borrow_date),date(current_timestamp())) as days , borrow_date, reader_id from books_log where reader_id=? and return_date is NULL) as a inner join inventory on a.book_id=inventory.book_id) as c inner join books_detail on c.prime_book_id=books_detail.prime_book_id; ";
  let result = await execute(query, [id]);
  let lastDay = 4;
  let startNotify = 3;

  result.forEach(async (element) => {
    let current_timestamp = new Date();
    let date = current_timestamp.getDate();
    let month = current_timestamp.getMonth() + 1;
    let year = current_timestamp.getFullYear();
    let current_date = "";
    if (month < 10) {
      current_date = `${year}-0${month}-${date}`;
    } else {
      current_date = `${year}-${month}-${date}`;
    }

    if ((lastDay - element.days) <= startNotify && (lastDay - element.days) >= 0) {
      let daysLeft = lastDay - element.days;
      let book_id = element.book_id;
      let reader_id = element.reader_id;
      let msg = `Dear reader you have borrowed a book named ${element.book_title} on ${element.borrow_date} you have return book in ${daysLeft} days otherwise you will penalized with 5rps per day`;
      let query4 =
        "select * from notification where reader_id=? and book_id=? and date(created_at)=?;";
      let result4 = await execute(query4, [reader_id, book_id, current_date]);

      if (result4.length == 0) {
        let query1 =
          "insert into notification (reader_id, book_id, message) values (?,?,?);";
        let result1 = await execute(query1, [reader_id, book_id, msg]);
      }
    } else if (lastDay - element.days < 0) {
      let book_id = element.book_id;
      let reader_id = element.reader_id;

      let query5 = `select daysLate, penalty, date(created_at) as created_at, date(modified_at) as modified_at from usersPenalty where reader_id = ? and book_id =?;`;
      let result5 = await execute(query5, [reader_id, book_id]);

      let daysLate = element.days - lastDay;

      let penalty = daysLate * 5;

      if (result5.length != 0) {
        if (
          result5[0].created_at != current_date &&
          result5[0].modified_at != current_date
        ) {
          let query6 = `update usersPenalty set penalty=?, daysLate=?, modified_at=? where reader_id=? and book_id =?`;
          let result6 = await execute(query6, [
            penalty,
            daysLate,
            new Date(),
            reader_id,
            book_id,
          ]);
        }
      } else {
        let query6 = `insert into usersPenalty (reader_id ,book_id, daysLate , penalty) values (?,?,?,?);`;
        let result6 = await execute(query6, [
          reader_id,
          book_id,
          daysLate,
          penalty,
        ]);
      }
      let msg = `Dear user you have been penalized with Rs ${penalty} for not returning book ${element.book_title} which you have issued on ${element.borrow_date}, you ${daysLate} late from the due date`;
      let query4 =
        "select * from notification where reader_id=? and book_id=? and date(created_at)=?;";

      let result4 = await execute(query4, [reader_id, book_id, current_date]);

      if (result4.length == 0) {
        let query1 =
          "insert into notification (reader_id, book_id, message) values (?,?,?);";
        let result1 = await execute(query1, [reader_id, book_id, msg]);
      }
    }
  });

  let noteCount =
    "select count(*) as count from notification where reader_id=? and isSeen=0 and isDeleted=0;";
  let count = await execute(noteCount, [id]);
  let imgQuery = "select * from user_img where user_id=? and isDeleted=0;";
  let imgResult = await execute(imgQuery, [id]);

  res.render("userProfileViews/userProfile", {
    component: component,
    result: uresult,
    count: count,
    imgResult: imgResult,
    id: "personal_detail",
  });
};
const showPersonalDetail = async (req, res) => {
  let component = "personalDetails";
  let id = req.user[0].user_id;
  let query = "select * from users where user_id = ?;";
  let result = await execute(query, [id]);
  let noteCount =
    "select count(*) as count from notification where reader_id=? and isSeen=0 and isDeleted=0;";
  let count = await execute(noteCount, [id]);
  let imgQuery = "select * from user_img where user_id=? and isDeleted=0;";
  let imgResult = await execute(imgQuery, [id]);
  res.render("userProfileViews/userProfile", {
    component: component,
    result: result,
    count: count,
    imgResult: imgResult,
    id: "personal_detail",
  });
};

const showWatchlist = async (req, res) => {
  let reader_id = req.user[0].user_id;
  let order = req.query.order;
  let field = req.query.field;
  let query1 = `select * from (select author_name, a.reader_id, a.author_id, a.prime_book_id, a.watchlist_id from (select watchlist_id, author_id, watch_lists.prime_book_id, reader_id from watch_lists inner join books_author on
    books_author.prime_book_id=watch_lists.prime_book_id where reader_id=? and isDeleted=0) as a inner join authors on a.author_id=authors.author_id) as b inner join books_detail on b.prime_book_id=books_detail.prime_book_id order by ${field} ${order};
   `;
  let result1 = await execute(query1, [reader_id]);

  let sortOrder = [{ order: order, field: field }];
  let result = [];
  result.push(result1);
  result.push(sortOrder);
  let noteCount =
    "select count(*) as count from notification where reader_id=? and isSeen=0 and isDeleted=0;";
  let count = await execute(noteCount, [reader_id]);
  let imgQuery = "select * from user_img where user_id=? and isDeleted=0;";
  let imgResult = await execute(imgQuery, [reader_id]);
  let component = "watchlist";
  res.render("userProfileViews/userProfile", {
    component: component,
    result: result,
    count: count,
    imgResult: imgResult,
    id: "mywatchlist",
  });
};
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ errors: errors, isError: true });
  } else {
    let id = req.user[0].user_id;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let contact = req.body.contact;
    let dob = req.body.dob;
    let address = req.body.address;
    let gender = req.body.gender;
    let query = `update users set u_fname=?,u_lname=?, u_email=?, u_contact=?, u_dob=?,u_address=?,
    u_gender=?, modified_at = current_timestamp() where user_id=?;`;
    let result = await execute(query, [
      fname,
      lname,
      email,
      contact,
      dob,
      address,
      gender,
      id,
    ]);
    res.json({ result, isError: false });
  }
};

const showUpdateProfile = async (req, res) => {
  let id = req.user[0].user_id;
  let query = "select * from users where user_id=?;";
  let result1 = await execute(query, [id]);
  let noteCount =
    "select count(*) as count from notification where reader_id=? and isSeen=0 and isDeleted=0;";
  let count = await execute(noteCount, [id]);
  let imgQuery = "select * from user_img where user_id=? and isDeleted=0;";
  let imgResult = await execute(imgQuery, [id]);
  let result = [];
  result.push(result1);
  result.push(imgResult);
  let component = "updateProfile";
  res.render("userProfileViews/userProfile", {
    component: component,
    result: result,
    count: count,
    imgResult: imgResult,
    id: "update_profile",
  });
};

const showBookIssued = async (req, res) => {
  let id = req.user[0].user_id;
  let order = req.query.order;
  let field = req.query.field;
  let query = `select e.borrow_date, e.return_date, e.reader_id, e.book_id, e.book_title, e.genre_name, e.author_name from (select borrow_date, return_date, reader_id, book_id, book_title, book_desc, d.genre_id, genre_name, book_publication, book_publication_year, prime_book_id, author_id , author_name, author_desc from (select borrow_date, return_date, reader_id, book_id, book_title, book_desc, genre_id, book_publication, book_publication_year, prime_book_id, c.author_id , author_name, author_desc from (select borrow_date, return_date, author_id, book_id, book_title, book_desc, genre_id, book_publication, book_publication_year, reader_id, a.prime_book_id from (select  return_date, borrow_date, book_id, book_title, b.prime_book_id as prime_book_id ,book_desc, reader_id, genre_id, book_publication, book_publication_year from books_detail inner join (select books_log.book_id,  inventory.prime_book_id, books_log.reader_id, books_log.borrow_date, books_log.return_date from inventory  inner join books_log on inventory.book_id=books_log.book_id where reader_id=?) as b  on b.prime_book_id=books_detail.prime_book_id) as a inner join books_author on a.prime_book_id=books_author.prime_book_id ) as c inner join authors on c.author_id=authors.author_id)  as d inner join genres on genres.genre_id=d.genre_id) as e inner join books_log on books_log.book_id=e.book_id order by ${field} ${order};`;
  let result1 = await execute(query, [id]);
  let noteCount =
    "select count(*) as count from notification where reader_id=? and isSeen=0 and isDeleted=0;";
  let count = await execute(noteCount, [id]);
  let imgQuery = "select * from user_img where user_id=? and isDeleted=0;";
  let imgResult = await execute(imgQuery, [id]);
  let component = "booksList";
  let sortData = [{ order: order, field: field }];
  let result = [];
  result.push(result1);
  result.push(sortData);
  res.render("userProfileViews/userProfile", {
    component: component,
    result: result,
    count: count,
    imgResult: imgResult,
    id: "book_issued",
  });
};
const showNotification = async (req, res) => {
  let id = req.user[0].user_id;
  let query3 =
    "select isSeen , a.prime_book_id , book_title, notify_id, reader_id, a.book_id, message, date(a.created_at) as created_at from books_detail inner join (select isSeen, notify_id, reader_id, prime_book_id, inventory.book_id, message, notification.created_at from notification inner join inventory on inventory.book_id = notification.book_id where reader_id =? and isDeleted=0) as a on a.prime_book_id=books_detail.prime_book_id order by created_at desc;";
  let result3 = await execute(query3, [id]);
  let noteCount =
    "select count(*) as count from notification where reader_id=? and isSeen=0 and isDeleted=0;";
  let count = await execute(noteCount, [id]);
  let imgQuery = "select * from user_img where user_id=? and isDeleted=0;";
  let imgResult = await execute(imgQuery, [id]);
  let component = "notification";
  res.render("userProfileViews/userProfile", {
    component: component,
    result: result3,
    count: count,
    imgResult: imgResult,
    id: "notification",
  });
};

const showBookDetail = async (req, res) => {
  let component = "issuedBookDetail";
  let reader_id = req.query.reader_id;
  let book_id = req.query.book_id;
  let query1 =
    "select * from (select author_name, a.prime_book_id from authors inner join (select inventory.prime_book_id, author_id from inventory inner join books_author on inventory.prime_book_id = books_author.prime_book_id where book_id = ? ) as a on a.author_id = authors.author_id ) as b inner join books_detail on b.prime_book_id=books_detail.prime_book_id;";

  let result1 = await execute(query1, [book_id]);

  let query2 =
    "select * from comments where reader_id = ? and book_id=? and isDeleted=0;";
  let result2 = await execute(query2, [reader_id, book_id]);

  let query3 =
    "select a.comment_id, u_fname, u_lname, nested_comment_id, commenter_id, comment, nested_comment from (select comments.comment_id, nested_comment_id, commenter_id, comment, nested_comment from comments inner join nested_comments on comments.comment_id=nested_comments.comment_id where comments.reader_id=? and comments.book_id=? and comments.isDeleted=0) as a inner join users on users.user_id=a.commenter_id;";
  let result3 = await execute(query3, [reader_id, book_id]);

  let query4 = `select * from genres inner join 
    (select genre_id, books_detail.prime_book_id from inventory inner join books_detail 
    on books_detail.prime_book_id=inventory.prime_book_id where inventory.book_id=?)
    as a on a.genre_id=genres.genre_id;`;
  let result4 = await execute(query4, [book_id]);
  let query5 = `select * from rating where reader_id=? and book_id=?;`;
  let result5 = await execute(query5, [reader_id, book_id]);
  let result = [];
  result.push(result1);
  result.push(result2);
  result.push(result3);
  result.push(result4);
  result.push(result5);
  let noteCount =
    "select count(*) as count from notification where reader_id=? and isSeen=0 and isDeleted=0;";
  let count = await execute(noteCount, [reader_id]);
  let imgQuery = "select * from user_img where user_id=? and isDeleted=0;";
  let imgResult = await execute(imgQuery, [reader_id]);
  res.render("userProfileViews/userProfile", {
    component: component,
    result: result,
    count: count,
    imgResult: imgResult,
    id: "book_detail",
  });
};

const sendReply = async (req, res) => {
  let comment_id = req.body.comment_id;
  let reader_id = req.body.reader_id;
  let reply = req.body.reply;
  let query =
    "insert into nested_comments (comment_id, commenter_id , nested_comment) values (?,?,?);";
  let result = await execute(query, [comment_id, reader_id, reply]);
  res.json(result);
};

const deleteFromFav = async (req, res) => {
  let watchlist_id = req.query.watchlist_id;

  let query =
    "update watch_lists set isDeleted=1 , deleted_at= current_timestamp() where watchlist_id=?;";
  let result = await execute(query, [watchlist_id]);
  res.json(result);
};

const deleteAllNotification = async (req, res) => {
  let reader_id = req.query.id;
  let query = `update notification set isDeleted=1 , deletedAt=current_timestamp() where reader_id=?;`;
  let result = await execute(query, [reader_id]);
  res.json(result);
};
const deleteNotification = async (req, res) => {
  let notify_id = req.query.id;
  let query = `update notification set isDeleted=1, deletedAt=current_timestamp() where notify_id=?;`;
  let result = await execute(query, [notify_id]);

  res.json(result);
};
const seenMsg = async (req, res) => {
  let notify_id = req.query.id;
  let query = "update notification set isSeen=1 where notify_id=?;";
  let result = await execute(query, [notify_id]);
  res.json(result);
};

const deleteComment = async (req, res) => {
  let comment_id = req.query.id;
  let query = `update comments set isDeleted=1 , deleted_at=current_timestamp() where comment_id=?;`;
  let result = await execute(query, [comment_id]);
  res.json(result);
};

const showAllComments = async (req, res) => {
  let comment_id = req.query.id;
  let query = `select * from nested_comments inner join users on
  users.user_id=nested_comments.commenter_id where comment_id=? order by nested_comment_id;`;
  let result = await execute(query, [comment_id]);
  res.json(result);
};

const showAllWatchlist = async (req, res) => {
  let reader_id = req.query.id;
  let order = req.query.order;
  let field = req.query.field;
  let query1 = `select * from (select author_name, a.reader_id, a.author_id, a.prime_book_id, a.watchlist_id from (select watchlist_id, author_id, watch_lists.prime_book_id, reader_id from watch_lists inner join books_author on
    books_author.prime_book_id=watch_lists.prime_book_id where reader_id=? and isDeleted=0 ) as a inner join authors on a.author_id=authors.author_id) as b inner join books_detail on b.prime_book_id=books_detail.prime_book_id order by ${field} ${order};
   `;
  let result1 = await execute(query1, [reader_id]);
  let sortOrder = [{ order: order, field: field }];
  let result = [];
  result.push(result1);
  result.push(sortOrder);
  res.json(result);
};

const showAllNotification = async (req, res) => {
  let reader_id = req.query.id;
  let query =
    "select isSeen , a.prime_book_id , book_title, notify_id, reader_id, a.book_id, message, date(a.created_at) as created_at from books_detail inner join (select isSeen, notify_id, reader_id, prime_book_id, inventory.book_id, message, notification.created_at from notification inner join inventory on inventory.book_id = notification.book_id where reader_id =? and isDeleted=0) as a on a.prime_book_id=books_detail.prime_book_id order by created_at desc;";
  let result = await execute(query, [reader_id]);
  res.json(result);
};

const showAllBooklist = async (req, res) => {
  let reader_id = req.query.id;
  let order = req.query.order;
  let field = req.query.field;
  let query = `select e.borrow_date, e.return_date, e.reader_id, e.book_id, e.book_title, e.genre_name, e.author_name  from (select borrow_date, return_date, reader_id, book_id, book_title, book_desc, d.genre_id, genre_name, book_publication, book_publication_year, prime_book_id, author_id , author_name, author_desc from (select borrow_date, return_date, reader_id, book_id, book_title, book_desc, genre_id, book_publication, book_publication_year, prime_book_id, c.author_id , author_name, author_desc from (select borrow_date, return_date, author_id, book_id, book_title, book_desc, genre_id, book_publication, book_publication_year, reader_id, a.prime_book_id from (select  return_date, borrow_date, book_id, book_title, b.prime_book_id as prime_book_id ,book_desc, reader_id, genre_id, book_publication, book_publication_year from books_detail inner join (select books_log.book_id,  inventory.prime_book_id, books_log.reader_id, books_log.borrow_date, books_log.return_date from inventory  inner join books_log on inventory.book_id=books_log.book_id where reader_id=?) as b  on b.prime_book_id=books_detail.prime_book_id) as a inner join books_author on a.prime_book_id=books_author.prime_book_id ) as c inner join authors on c.author_id=authors.author_id)  as d inner join genres on genres.genre_id=d.genre_id) as e inner join books_log on books_log.book_id=e.book_id order by ${field} ${order} ;`;
  let result1 = await execute(query, [reader_id]);

  let sortData = [{ order: order, field: field }];
  let result = [];
  result.push(result1);
  result.push(sortData);
  res.json(result);
};
const uploadUserImg = async (req, res) => {
  let user_id = req.body.user_id;
  let filename = req.file.filename;
  let originalname = req.file.originalname;
  let img_path = "/uploads/" + filename;
  let query = `select * from user_img where user_id=? and isDeleted=0;`;
  let result = await execute(query, [user_id]);

  if (result.length == 0) {
    let insertImg = `insert into user_img (filename, original_name, img_path, user_id) values (?,?,?,?);`;
    let insertResult = await execute(insertImg, [
      filename,
      originalname,
      img_path,
      user_id,
    ]);
    res.json({ insertResult: insertResult, isError: false });
  } else {
    let img_id = result[0].user_img_id;
    let updateQuery = `update user_img set isDeleted=1 , deleted_at=current_timestamp() where user_img_id=?;`;
    let updateResult = await execute(updateQuery, [img_id]);
    let insertImg = `insert into user_img (filename, original_name, img_path, user_id) values (?,?,?,?);`;
    let insertResult = await execute(insertImg, [
      filename,
      originalname,
      img_path,
      user_id,
    ]);
    res.json({ insertResult: insertResult, isError: false });
  }
};

const removeImg = async (req, res) => {
  let img_id = req.query.img_id;
  let query = `update user_img set isDeleted=1, deleted_at = current_timestamp() where user_img_id=?;`;
  let result = await execute(query, [img_id]);

  res.json(result);
};
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.render("./userAuthentication/login", {
    validation: true,
    secondValidation: true,
  });
};
const searchNotify = async (req, res) => {
  let reader_id = req.user[0].user_id;
  let search_text = req.body.search_text;
  let query =
    `select isSeen , a.prime_book_id , book_title, notify_id, reader_id, a.book_id, message, date(a.created_at) as created_at from books_detail inner join (select isSeen, notify_id, reader_id, prime_book_id, inventory.book_id, message, notification.created_at from notification inner join inventory on inventory.book_id = notification.book_id where reader_id =? and isDeleted=0) as a on a.prime_book_id=books_detail.prime_book_id where book_title like '%${search_text}%' or message like '%${search_text}%' or a.created_at like '%${search_text}%' order by created_at desc;`;
  let result = await execute(query, [reader_id, search_text, search_text, search_text]);

  res.json({ result: result, search_text: search_text });
  res.end();
};

const showAllNotiBySearch = async (req, res) => {
  let reader_id = req.query.id;
  let search_text = req.query.search_text;
  let query = `select isSeen , a.prime_book_id , book_title, notify_id, reader_id, a.book_id, message, date(a.created_at) as created_at from books_detail inner join (select isSeen, notify_id, reader_id, prime_book_id, inventory.book_id, message, notification.created_at from notification inner join inventory on inventory.book_id = notification.book_id where reader_id =? and isDeleted=0) as a on a.prime_book_id=books_detail.prime_book_id where book_title like '%${search_text}%' or message like '%${search_text}%' or a.created_at like '%${search_text}%' order by created_at desc;`;
  let result = await execute(query, [
    reader_id,
    search_text,
    search_text,
    search_text,
  ]);

  res.json({ result: result, search_text: search_text, msg: "sdfggfju" });
  res.end();
};
module.exports = {
  showUserProfile,
  showPersonalDetail,
  showWatchlist,
  showUpdateProfile,
  showBookIssued,
  showNotification,
  showBookDetail,
  updateUser,
  sendReply,
  deleteFromFav,
  deleteNotification,
  deleteAllNotification,
  seenMsg,
  deleteComment,
  showAllComments,
  showAllWatchlist,
  showAllNotification,
  showAllBooklist,
  uploadUserImg,
  removeImg,
  logoutUser,
  searchNotify,
  showAllNotiBySearch,
};

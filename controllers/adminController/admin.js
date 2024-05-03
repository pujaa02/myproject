const logger = require("../../logger");
const { execute } = require("../../dbConnection/executeQuery");
const puppeteer=require('puppeteer');
const ejs=require('ejs')
const os=require("os")

let data=[]
exports.saveBook = async (req, res) => {
  console.log(req.file);
  try {
    let {
      title,
      desc,
      genreid,
      publication,
      isbn,
     publicationyear,
      language,
      author_id,
    } = req.body;

    const query = `insert into books_detail (book_title,book_desc,book_img,genre_id,book_publication,book_publication_year,book_ISBN,isdeleted,books_lang) values (?,?,?,?,?,?,?,?,?)`;
    let result = await execute(query, [
      title,
      desc,
      "/uploads/" + req.file.filename,
      genreid,
      publication,
      publicationyear,
      isbn,
     
      0,
      language,
    ]);
  
    try {
      const query1 = `insert into books_author (prime_book_id,author_id) values(?,?)`;
      let result1 = await execute(query1, [result.insertId, author_id]);
    } catch (error) {
      logger.error(error);
    }
    return res.json({ message: "success" });
  } catch (error) {
    logger.error(error);
  }
};

exports.addBook = async (req, res) => {
  try {
    res.render("admin/addBook");
  } catch (error) {
    logger.error(error);
  }
};

exports.editBook = async (req, res) => {
  try {
    let bookid = req.query.bookid;
    let query = `select bd.prime_book_id,bd.book_title,bd.book_desc,bd.books_lang,bd.genre_id,bd.book_img,bd.book_publication,bd.book_publication_year,bd.book_ISBN,group_concat(ba.author_id separator ',')as author_id from books_detail as bd inner join books_author as ba on bd.prime_book_id=ba.prime_book_id 
    where bd.prime_book_id=?;`;
    let result = await execute(query, [bookid]);
    console.log(result);
    res.render("admin/editBook", { result });
  } catch (error) {
    logger.error(error);
  }
};

exports.updateBook = async (req, res) => {
  try {
    let {
      title,
      desc,
      genreid,
      publication,
      isbn,
      publicationyear,
      bookid,
      language,
      author_id,
    } = req.body;
    let query;
    let params;

    if (req.file) {
      query =
        "update books_detail set book_title = ? , book_desc = ? ,books_lang=? ,book_img=? ,genre_id = ? , book_publication = ? , book_publication_year = ? , book_ISBN = ? where prime_book_id = ? ";
      params = [
        title,
        desc,
        language,
        "/uploads/" + req.file.filename,
        genreid,
        publication,
        publicationyear,
        isbn,
        bookid,
      ];
    } else {
      query =
        "update books_detail set book_title = ? , book_desc = ? ,books_lang=?,genre_id = ? , book_publication = ? , book_publication_year = ? , book_ISBN = ? where prime_book_id = ? ";
      params = [
        title,
        desc,
        language,
        genreid,
        publication,
        publicationyear,
        isbn,
        bookid,
      ];
    }

    let result = await execute(query, params);
    console.log(result);
    return res.json({ result: result, message: "success" });
  } catch (error) {
    logger.error(error);
  }
};

exports.listBook = async (req, res) => {
  try {
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    let query = `select books_detail.prime_book_id,books_detail.book_title,books_detail.book_title,books_detail.genre_id,books_detail.book_publication,books_detail.book_publication_year,book_ISBN,
    (select count(inventory.prime_book_id) from inventory where books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as total_book,
    (select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book
    from books_detail where isDeleted = 0`;

    if (searchby && searchvalue) {
      query = query + ` and ${searchby} like '%${searchvalue}%'`;
    }
    let result = await execute(query, []);
    let max = result.length;
    let page = Math.ceil(max / limit);
    let result2 = result.slice(offset, offset + limit);
    res.render("admin/listBooks", { result2, p, page });
  } catch (error) {
    logger.error(error);
  }
};
exports.getInventory = async (req, res) => {
  try {
    let { searchby, searchvalue } = req.query;
    let bookid = req.query.bookid;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    let query = `select inventory.book_id,books_detail.prime_book_id,books_detail.book_title,concat(users.u_fname," ",users.u_lname)as name,books_log.borrow_date,books_log.return_date,books_log.status from inventory
    left join books_detail on inventory.prime_book_id = books_detail.prime_book_id
    left join books_log on inventory.book_id = books_log.book_id
    left join users on books_log.reader_id = users.user_id
    where inventory.prime_book_id = ${bookid}`;

    if (searchby && searchvalue) {
      query = query + ` and ${searchby} like '%${searchvalue}%'`;
    }
    let result = await execute(query, []);
    let max = result.length;
    let page = Math.ceil(max / limit);
    let result2 = result.slice(offset, offset + limit);
    res.render("admin/inventory", { result2, p, page });
  } catch (e) {
    logger.error(e);
  }
};
exports.listBookOrder = async (req, res) => {
  try {
    let url = req.url;
    url = url.split("/");
    let column = url[2];
    let order = url[3];
    order = order.split("?")[0];
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    let query = `select books_detail.prime_book_id,books_detail.book_title,books_detail.book_title,books_detail.genre_id,books_detail.book_publication,books_detail.book_publication_year,book_ISBN,
    (select count(inventory.prime_book_id) from inventory where books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as total_book,
    (select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book
    from books_detail where isDeleted = 0`;
    if (searchby && searchvalue) {
      query = query + ` and ${searchby} like '%${searchvalue}%'`;
      let result = await execute(query, []);
      let max = result.length;
      let page = Math.ceil(max / limit);
      let result2 = result.slice(offset, offset + limit);
      res.render("admin/listBooks", { result2, p, page });
    } else {
      query = query + ` order by ${column} ${order}`;
      let result = await execute(query, []);
      let max = result.length;
      let page = Math.ceil(max / limit);
      let result2 = result.slice(offset, offset + limit);
      res.render("admin/listBooksOrder", { result2, p, page });
    }
  } catch (error) {
    logger.error(error);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    let bookid = req.query.bookid;
    let query = `update books_detail set isdeleted = 1 where prime_book_id = ?`;
    let result1 = await execute(query, [bookid]);
    res.redirect("/admin/listbook");
  } catch (error) {
    logger.error(error);
  }
};

exports.showInventory = async (req, res) => {
  try {
    let query = `select books_detail.book_title , inventory.prime_book_id , count(book_id) as quantity from inventory 
    left join books_detail on inventory.prime_book_id = books_detail.prime_book_id
    group by prime_book_id `;
    let result = await execute(query, []);
    res.render("admin/showInventory", { result });
  } catch (error) {
    logger.error(error);
  }
};
exports.addInventory = async (req, res) => {
  try {
    let bookid = req.params.bookid;
    let query = `insert into inventory (prime_book_id, availability_status) values (?,?)`;
    let result = await execute(query, [bookid, 1]);
    res.redirect("/admin/showInventory");
  } catch (error) {
    logger.error(error);
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    let bookid = req.params.bookid;
    let query = `update inventory set isdeleted = 1 , deleted_at = now() where prime_book_id = ?`;
    let result = await execute(query, [bookid]);
    res.redirect("/admin/showInventory");
  } catch (error) {
    logger.error(error);
  }
};

exports.adminHome = async (req, res) => {
  try {
    let query1 = `select count(user_id) as totalusers from users where isdeleted = 0`;
    let query2 = `select count(prime_book_id) as totalbooks from books_detail where isdeleted = 0`;
    let query3 = `select avg(rating) as rating from rating`;
    let query4 = `select count(contro_id) as totalrequest from contribution`;
    let query5 = `select count(author_id) as totalauthors from authors`;

    let result1 = await execute(query1, []);
    let result2 = await execute(query2, []);
    let result3 = await execute(query3, []);
    let result4 = await execute(query4, []);
    let result5 = await execute(query5, []);
    res.render("admin/home", { result1, result2, result3, result4, result5 });
  } catch (error) {
    logger.error(error);
  }
};

exports.listAuthors = async (req, res) => {
  try {
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    // let query = `select a.author_id , a.author_name , a.author_desc , c.book_title from authors as a inner join books_author as b on a.author_id = b.author_id inner join  books_detail as c on b.prime_book_id = c.prime_book_id `

    let query = `select * from authors`;

    if (searchby && searchvalue) {
      query = query + ` where ${searchby} like '%${searchvalue}%'`;
    }

    let result2 = await execute(query, []);
    let max = result2.length;
    let page = Math.ceil(max / limit);
    let result = result2.slice(offset, offset + limit);
    res.render("admin/listAuthors", { result, p, page });
  } catch (error) {
    logger.error(error);
  }
};

exports.listAuthorsOrder = async (req, res) => {
  try {
    let url = req.url;
    url = url.split("/");
    let column = url[2];
    let order = url[3];
    order = order.split("?")[0];
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    let query = `select * from authors`;

    if (searchby && searchvalue) {
      query = query + ` where ${searchby} like '%${searchvalue}%'`;
      let result2 = await execute(query, []);
      let max = result2.length;
      let page = Math.ceil(max / limit);
      let result = result2.slice(offset, offset + limit);
      res.render("admin/listAuthors", { result, p, page });
    } else {
      query = query + ` order by ${column} ${order}`;
      let result2 = await execute(query, []);
      let max = result2.length;
      let page = Math.ceil(max / limit);
      let result = result2.slice(offset, offset + limit);
      res.render("admin/listAuthorsOrder", { result, p, page });
    }
  } catch (error) {
    logger.error(error);
  }
};

exports.showRatings = async (req, res) => {
  try {
    let { searchby, searchvalue } = req.query;

    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    let query = `select a.user_id, b.book_title , DATE_FORMAT(a.created_at, "%d/%m/%Y") as date , a.rating from rating as a  inner join books_detail as b on a.book_id = b.prime_book_id `;
    if (searchby && searchvalue) {
      if (searchby === "user_id") {
        query = query + ` where a.${searchby} like '%${searchvalue}%'`;
      } else {
        query = query + ` where b.${searchby} like '%${searchvalue}%'`;
      }
    }
    let result2 = await execute(query, []);
    let max = result2.length;
    let page = Math.ceil(max / limit);
    let result = result2.slice(offset, offset + limit);
    res.render("admin/listRatings", { result, p, page });
  } catch (error) {
    logger.error(error);
  }
};

exports.showRatingsOrder = async (req, res) => {
  try {
    let url = req.url;
    url = url.split("/");
    let column = url[2];
    let order = url[3];
    order = order.split("?")[0];
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    let query = `select a.user_id, b.book_title , DATE_FORMAT(a.created_at, "%d/%m/%Y") as date , a.rating from rating as a  inner join books_detail as b on a.book_id = b.prime_book_id `;
    if (searchby && searchvalue) {
      if (searchby === "user_id") {
        query = query + ` where a.${searchby} like '%${searchvalue}%'`;
      } else {
        query = query + ` where b.${searchby} like '%${searchvalue}%'`;
      }
      let result2 = await execute(query, []);
      let max = result2.length;
      let page = Math.ceil(max / limit);
      let result = result2.slice(offset, offset + limit);
      res.render("admin/listRatings", { result, p, page });
    } else {
      query = query + ` order by ${column} ${order}`;
      let result2 = await execute(query, []);
      let max = result2.length;
      let page = Math.ceil(max / limit);
      let result = result2.slice(offset, offset + limit);
      res.render("admin/listRatingOrder", { result, p, page });
    }
  } catch (error) {
    logger.error(error);
  }
};

exports.showRequests = async (req, res) => {
  try {
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    let query = `select * from contribution `;

    if (searchby && searchvalue) {
      query = query + ` where ${searchby} like '%${searchvalue}%'`;
    }
    let result2 = await execute(query, []);
    let max = result2.length;
    let page = Math.ceil(max / limit);
    let result = result2.slice(offset, offset + limit);
    res.render("admin/listRequests", { result, p, page });
  } catch (error) {
    logger.error(error);
  }
};

exports.showRequestsOrder = async (req, res) => {
  try {
    let url = req.url;
    url = url.split("/");
    let column = url[2];
    let order = url[3];
    order = order.split("?")[0];
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;

    let query = `select * from contribution `;

    if (searchby && searchvalue) {
      query = query + ` where ${searchby} like '%${searchvalue}%'`;

      let result2 = await execute(query, []);
      let max = result2.length;
      let page = Math.ceil(max / limit);
      let result = result2.slice(offset, offset + limit);
      res.render("admin/listRequests", { result, p, page });
    } else {
      query = query + ` order by ${column} ${order}`;
      let result2 = await execute(query, []);
      let max = result2.length;
      let page = Math.ceil(max / limit);
      let result = result2.slice(offset, offset + limit);
      res.render("admin/listRequestsOrder", { result, p, page });
    }
  } catch (error) {
    logger.error(error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;
    let query = ` select * from users where role_id=? and isdeleted=0`;

    if (searchby && searchvalue) {
      query = query + ` and ${searchby} like '%${searchvalue}%'`;
    }

    const params = [1];
    const user = await execute(query, params);
    let max = user.length;
    let page = Math.ceil(max / limit);
    let users = user.slice(offset, offset + limit);
    res.render("admin/listUsers", { users, page, p });
  } catch (error) {
    logger.error(error);
  }
};

exports.getAllUsersOrder = async (req, res) => {
  try {
    let url = req.url;
    url = url.split("/");
    let column = url[2];
    let order = url[3];
    order = order.split("?")[0];
    let { searchby, searchvalue } = req.query;
    let p = req.query.p || 1;
    let limit = 8;
    let offset = (Number(p) - 1) * limit;
    let query = ` select * from users where role_id=? and isdeleted=0`;

    if (searchby && searchvalue) {
      query = query + ` and ${searchby} like '%${searchvalue}%'`;
      const params = [1];
      const user = await execute(query, params);
      let max = user.length;
      let page = Math.ceil(max / limit);
      let users = user.slice(offset, offset + limit);
      res.render("admin/listUsers", { users, page, p });
    } else {
      query = query + ` order by ${column} ${order}`;
      const params = [1];
      const user = await execute(query, params);
      let max = user.length;
      let page = Math.ceil(max / limit);
      let users = user.slice(offset, offset + limit);
      res.render("admin/listusersOrder", { users, page, p });
    }
  } catch (error) {
    logger.error(error);
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id) === true) {
      return res.status(500).json({ success: false, message: "Invalid Id" });
    }
    const params = [id];
    const query = "select * from users where user_id=?";
    const isUserExist = await execute(query, params);
    if (isUserExist[0] === "error") {
      return res
        .status(500)
        .json({ success: false, message: isUserExist[1].message });
    }
    if (isUserExist.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "user does not Exist" });
    }
    return res.status(200).json({ success: true, user: isUserExist });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.editUSer = async (req, res) => {
  try {
    let userid = req.params.userid;
    let query = `select * from users where user_id = ${userid}`;
    let result = await execute(query, []);
    res.render("admin/editUser", { result });
  } catch (error) {
    logger.error(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      u_fname,
      u_lname,
      u_email,
      u_contact,
      u_address,
      u_gender,
      u_dob,
      user_id,
    } = req.body;
    const query =
      "update users set u_fname=?,u_lname=?,u_email=?,u_contact=?,u_address=?,u_gender=?,u_dob=? where user_id=? and isdeleted = 0";
    const params = [
      u_fname,
      u_lname,
      u_email,
      u_contact,
      u_address,
      u_gender,
      u_dob,
      user_id,
    ];
    const isUserExist = await execute(query, params);

    if (isUserExist.affectedRows === 0) {
      return res
        .status(200)
        .json({ success: false, message: "user does not Exist" });
    }
    return res
      .status(200)
      .json({ success: true, message: "user updated succesfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const query = "update users set isdeleted=1 where user_id=?";
    const isdeleted = await execute(query, [id]);
    res.redirect("admin/getallusers");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAuthor = async (req, res) => {
  try {
    res.render("authors/addAuthor");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.listsFilterUser = async (req, res) => {
  let { searchby, searchvalue } = req.query;
  res.render("admin/issueBooks.ejs", { searchby, searchvalue });
};
exports.listsOfFilterUser = async (req, res) => {
  let { searchby, searchvalue } = req.query;
  let searchbynew;
  searchby = searchby.replace(/\s/g, "");
  if (searchby == "prime_book_id" || searchby == "book_title") {
    searchbynew = "bd." + searchby;
  } else if (searchby == "book_id") {
    searchbynew = "bl." + searchby;
  } else {
    searchbynew = searchby;
  }
  searchvalue = searchvalue.replace(/\s/g, "");
  let booksByUser;
  let query2;
  if (searchbynew.length != 0 && searchvalue != 0) {
    query2 = `SELECT bu.user_id as reader_id,bu.u_fname,count(*) as Total_Books FROM inventory as bi
    INNER JOIN books_log as bl
    ON bi.book_id = bl.book_id
    LEFT JOIN books_detail as bd
    ON bi.prime_book_id = bd.prime_book_id
	  INNER JOIN users as bu
    ON bl.reader_id = bu.user_id
    WHERE bl.status=? AND ${searchbynew} LIKE '%${searchvalue}%'
    GROUP BY bu.user_id`;

    booksByUser = await execute(query2, [req.query.status]);
  } else {
    query2 = `SELECT reader_id,u_fname,COUNT(*) AS "Total_Books" FROM books_log as bl
    INNER JOIN users as bu
    ON bl.reader_id = bu.user_id
    WHERE bl.status=?
    GROUP BY reader_id;`;
    booksByUser = await execute(query2, [req.query.status]);
  }
  res.json(booksByUser);
};

exports.listsFilterBooks = async (req, res) => {
  const query1 = `SELECT book_id,book_title,COUNT(*) AS Total_User FROM books_log as bl INNER JOIN books_detail as bd ON bl.book_id = bd.prime_book_id GROUP BY book_id`;

  const booksByUser = await execute(query1);
};
exports.showBooksByIdDetails = async (req, res) => {
  let searchBy = req.query.searchby;
  searchBy = searchBy.replace(/\s/g, "");
  if (searchBy == "" || searchBy == "prime_book_id") {
    searchBy = "bl.book_id";
  } else if (searchBy == "book_title") {
    searchBy = "bd.book_title";
  }
  let searchValue = req.query.searchvalue;
  searchValue = searchValue.replace(/\s/g, "");
  if (searchValue == "") {
    searchValue = "%";
  }
  let date1 = req.query.date1;
  let date2 = req.query.date2;
  let readerId = req.query.readerId;
  readerId = readerId.replace(/\s/g, "");
  let status = req.query.status;
  status = status.replace(/\s/g, "");
  let booksByUser;
  let query1;

  let firstDate = req.query.firstDate || undefined;
  let secondDate = req.query.secondDate || undefined;
  let fromDate = req.query.fromDate || undefined;
  let toDate = req.query.toDate || undefined;

  if (
    firstDate != undefined &&
    secondDate != undefined &&
    fromDate != undefined &&
    toDate != undefined
  ) {
    if (firstDate == "borrowDate1") {
      firstDate = "bl.borrow_date";
    }
    if (secondDate == "borrowDate2") {
      secondDate = "bl.borrow_date";
    }
    if (firstDate == "returnDate1") {
      firstDate = "bl.return_date";
    }
    if (secondDate == "returnDate2") {
      secondDate = "bl.return_date";
    }

    date1 += " 00:00:00";
    date2 += " 23:59:59";
    query1 = `SELECT  bl.borrowed_id, bl.reader_id,bi.book_id as skuId,bi.prime_book_id,up.daysLate,up.penalty,bl.borrow_date,bl.return_date,bl.status,bd.book_title FROM inventory as bi
    INNER JOIN books_log as bl
    ON bi.book_id = bl.book_id
    LEFT JOIN books_detail as bd
    ON bi.prime_book_id = bd.prime_book_id
    LEFT JOIN usersPenalty as up
    ON up.book_id = bi.book_id 
    WHERE bl.reader_id=? AND bl.status=? AND ${firstDate}>= ? AND ${secondDate}<= ? AND ${searchBy} LIKE '%${searchValue}%'`;
    booksByUser = await execute(query1, [readerId, status, fromDate, toDate]);
    res.json(booksByUser);
  } else {
    query1 = `SELECT  bl.borrowed_id, bl.reader_id,bi.book_id as skuId,bi.prime_book_id,up.daysLate,up.penalty,bl.borrow_date,bl.return_date,bl.status,bd.book_title FROM inventory as bi
    INNER JOIN books_log as bl
    ON bi.book_id = bl.book_id
    LEFT JOIN books_detail as bd
    ON bi.prime_book_id = bd.prime_book_id
    LEFT JOIN usersPenalty as up
    ON up.book_id = bi.book_id 
    WHERE bl.reader_id=? AND bl.status=? AND ${searchBy} LIKE '%${searchValue}%' `;
    booksByUser = await execute(query1, [readerId, status]);

    res.json(booksByUser);
  }
};
exports.showBooksById = async (req, res) => {
  try {
    let readerId = req.query.reader_id || req.query.searchvalue3;
    readerId = readerId.replace(/\s/g, "");
    let status = req.query.status || req.query.searchvalue2;
    status = status.replace(/\s/g, "");

    res.render("searchBooksByUser2.ejs", {
      readerID: readerId,
      Status: status,
      searchby: req.query.searchby,
      searchValue: req.query.searchvalue,
    });
  } catch (error) {
    logger.error(error);
  }
};

exports.insertReturnData = async (req, res) => {
  try {
    let id = req.body.id;
    let bookID = req.body.bookID;

    const query3 = `UPDATE books_log SET return_date = current_timestamp(),status= "return",modified_at = current_timestamp() WHERE borrowed_id = ?;`;
    const booksByUser = await execute(query3, [id]);

    const query4 = `UPDATE inventory SET availability_status = '0' WHERE book_id = ?;`;
    const updateInventory = await execute(query4, [bookID]);
    res.send(true);
  } catch (error) {
    res.send(false);
  }
};

exports.getGenres = async (req, res) => {
  try {
    const query = "SELECT genre_id ,genre_name FROM genres";
    const genres = await execute(query, []);
    return res.json({ data: genres });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.bookIssueAdmin = async (req, res) => {
  try {
    res.render("admin/bookIssueAdmin");
  } catch (error) {
    logger.error(error);
  }
};

exports.validateUser = async (req, res) => {
  try {
    console.log('hello')
    const { u_email } = req.body;
    let query = `select * from users where u_email = ? and isdeleted = 0`;
    const result = await execute(query, [u_email]);
    if (result.length === 0) {
      res.json({ msg: "User is not registered" });
    } else {
      res.json({ msg: "valid user", userid: result[0].user_id });
    }
  } catch (error) {
    logger.error(error);
  }
};

exports.finalBookIssue = async (req, res) => {
  try {
    let { prime_book_id, reader_id } = req.body;
    let query1 = `select * from inventory where prime_book_id = ? and availability_status=1;`;
    const res1 = await execute(query1, [prime_book_id]);
    if (res1.length == 0) {
      res.json({ msg: "error" });
    } else {
      let book_id = res1[res1.length - 1].book_id;
      let query2 = `update inventory set availability_status = 0 where book_id = ?`;
      const res2 = await execute(query2, [book_id]);
      let query4 = `insert into books_log (reader_id , book_id , status) values (?,?,?)`;
      const res3 = await execute(query4, [reader_id, book_id, "pending"]);
      res.json({ msg: "success" });
    }
  } catch (error) {
    logger.error(error);
  }
};

exports.addCategory = async (req,res) => {
  try {
    console.log(req.body);
   let category=req.body.value;
   category=category.toLowerCase();
   try {
    const query='select * from genres where genre_name=?'

    let result=await execute(query,[category])

    if(result.length>0){
     return res.json({message:"fail"})
    }
   } catch (error) {
    logger.error(error.toString())
   }
   const query1='insert into genres(genre_name) values(?)'
   let result1=await execute(query1,[category])
   console.log(result1);
    return res.json({message:"success"})
  } catch (error) {
    logger.error(error);
  }
}
exports.about = async (req, res) => {
  try {
    res.render('admin/about')
  }
  catch (e) {
    logger.log(e);
  }
};

exports.report=async (req,res)=>
{
  try {
    res.render("admin/report",{result:null})
  } catch (error) {
    logger.log(e)
  }
}

exports.pdfGenerate=async (req,res)=>{
   for(let i=0;i<data.length;i++){
    console.log(data[i]);
   }
  let browser;

  (async ()=>{
  
    browser=await puppeteer.launch({ headless: true })

    const page= await browser.newPage();
    const html=await ejs.renderFile("views/admin/report.ejs",{result:data});
    await page.setContent(html,{waitUntil:"load"})
    await page.addStyleTag({path:"node_modules/bootstrap/dist/css/bootstrap.min.css"})
    await page.addScriptTag({path:"node_modules/bootstrap/dist/js/bootstrap.min.js"})
    await page.addStyleTag({content:"#displaybtn2 {display:none}"})
    await page.addStyleTag({content:"#displaybtn {display:none}"})
   
    const pdf=await page.pdf({
      path:`${os.homedir()}/Downloads/report.pdf`,
      format:"A4",
      printBackground:true
    })
    res.send(pdf)
  })().catch((error)=>{
    console.log(error);
  }).finally(()=>browser?.close())
}


exports.getAllUsersCount=async (req,res)=>{
  let month=req.query.month;
  let year=req.query.year;
  const query="select count(*) as count from users where month(created_at)<=? and year(created_at)<=?";
  try {
    const total=await execute(query,[month,year]);
    
     data.push(total[0].count)
    return res.json({total:total})
  } catch (error) {
    logger.error(error);
  }


}

exports.getAllUsersCountdeleted=async (req,res)=>{
  let month=req.query.month;
  let year=req.query.year;
  const query="select count(*) as count from users  where isdeleted=1 and month(created_at)<=? and year(created_at)<=? ";
  try {
    const total=await execute(query,[month,year]);
    console.log(total);
    data.push(total[0].count)
 
    return res.json({total:total})
  } catch (error) {
    logger.error(error)
  }


}

exports.getAllUserMonth=async (req,res)=>{

  const month=req.query.month;
  const year=req.query.year;
  const query="select count(*) as count from users where month(created_at)=? and year(created_at)=?"
  try {
    const total=await execute(query,[month,year]);
    data.push(total[0].count)
    console.log(total);
    return res.json({total:total})
  } catch (error) {
    logger.error(error)
  }


}


exports.latestBooks=async (req,res)=>{

  const month=req.query.month;
  const year=req.query.year;
 const query="select book_title,created_at from books_detail where month(created_at)=? and year(created_at)=? order By created_at   desc limit 5"
try {
  const result=await execute(query,[month,year]);
  data.push(result)
  return res.json({books:result})
} catch (error) {
  logger.error(error)
}
}

exports.popularBooks=async (req,res)=>{
  const query="select i.prime_book_id,bd.book_title,count(*) as total_books from books_log as b inner join inventory as i on b.book_id=i.book_id inner join books_detail  as bd on i.prime_book_id=bd.prime_book_id group by i.prime_book_id  order by count(*) DESC limit 5"
 try {
   const result=await execute(query,[]);

   data.push(result)
   return res.json({books:result})
 } catch (error) {
   
 }
 }
 exports.authorWithBooks=async (req,res)=>{
  const query="select a.author_name,a.author_id,count(b.prime_book_id) as total_books from books_author as b  inner join authors as a on b.author_id=a.author_id  group by a.author_id  order by count(b.prime_book_id) DESC  limit 5"
 try {
   const result=await execute(query,[]);
    data.push(result)
   return res.json({authorsBook:result})
 } catch (error) {
    logger.error(error)  
 }
 }


 exports.getAllLanguages=async (req,res)=>{
  const query="select * from language ";
  try {
    const result=await execute(query,[]);
    
    return res.json({languages:result})
  } catch (error) {
    logger.error(error)
  }

 }

 exports.charData = async (req,res)=>{
  try {
    console.log('hello')
    let query = `select extract(month from borrow_date) as month, count(*) as date_count from books_log
    group by extract(month from borrow_date) order by month`

    let result = await execute(query,[])
    console.log(result);
    res.json(result)
  } catch (error) {
    logger.error(error)
  }
}


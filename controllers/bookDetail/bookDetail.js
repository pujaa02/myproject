const { log } = require("winston");
const { execute } = require("../../dbConnection/executeQuery");
const logger = require("../../logger");

exports.contributebook = (req, res) => {
  user_id = req.user[0].user_id;
  res.render("contributebook/contribute", { user_id });
};
exports.bookdetail = (req, res) => {
  book_id = req.query.book_id;
  user_id = req.user[0].user_id;
  res.render("bookDetail/bookDetail", { book_id, user_id });
};

exports.BookDetails = async (req, res) => {
  book_id = req.query.book_id;
  //fetching data for book
  let fetchqr = `select book_title,book_desc,book_img,book_publication,book_publication_year,book_ISBN,genre_name,books_detail.genre_id,sum(availability_status) as availability_status,books_detail.prime_book_id from books_detail inner join genres on books_detail.genre_id = genres.genre_id inner join inventory on inventory.prime_book_id = books_detail.prime_book_id where books_detail.prime_book_id =?;`;
  let databook = await execute(fetchqr, book_id);
  //fetching data for author
  let fetchauth = `select authors.author_id,author_name,author_img,author_desc,books_detail.prime_book_id from books_author inner join authors on authors.author_id = books_author.author_id inner join books_detail on books_detail.prime_book_id = books_author.prime_book_id where books_detail.prime_book_id=?; `;
  let dataauth = await execute(fetchauth, book_id);

  const recommendeddata = databook.map((t1) => ({
    ...t1,
    ...dataauth.find((t2) => t2.prime_book_id === t1.prime_book_id),
  }));

  //fetching rating of book
  let fetchrate = `select avg(rating) as rate from rating where book_id =?;`;
  let rate = await execute(fetchrate, book_id);
  rate = Number(rate[0].rate);

  //fetching data for other books of author
  let auth_id = recommendeddata[0].author_id;
  let authotherbook = `select book_img from books_detail inner join books_author on books_author.prime_book_id = books_detail.prime_book_id where author_id = ? and not books_detail.prime_book_id=?;`;
  let authvalues = [auth_id, book_id];
  authotherbook = await execute(authotherbook, authvalues);

  //fetching related books
  let genreofbook = recommendeddata[0].genre_id;
  let relatedbook = `select book_img,prime_book_id from books_detail where genre_id=? and not prime_book_id=? limit 0,5`;
  let relatedvalue = [genreofbook, book_id];
  relatedbook = await execute(relatedbook, relatedvalue);

  //fetching total read of book
  let totalread = `select count(*) as 'read' from books_log where book_id = ? and status= 'return'`;
  totalread = await execute(totalread, [book_id]);

  //fetching currently reading
  let reading = `select count(*) as 'read' from books_log where book_id = ? and status= 'pending'`;
  reading = await execute(reading, [book_id]);
  //send data to bookdetail page

  res.send({
    recommendeddata,
    rate,
    authotherbook,
    relatedbook,
    totalread,
    reading,
  });
};
exports.addtofav = async (req, res) => {
  let user_id = req.query.user_id;
  let book_id = req.query.book_id;
  let checkifexist = `select reader_id,prime_book_id,isDeleted from watch_lists`;
  checkifexist = await execute(checkifexist);
  let exist = "";
  for (let i = 0; i < checkifexist.length; i++) {
    if (
      checkifexist[i].reader_id == user_id &&
      checkifexist[i].prime_book_id == book_id &&
      checkifexist[i].isDeleted == 0
    ) {
      exist = "yes";
    } else {
      exist = "no";
    }
  }
  if (exist == "yes") {
    res.json(exist);
  } else {
    let addtofavquery = `insert into watch_lists(reader_id,prime_book_id,isDeleted) values(?,?,0)`;
    let values = [user_id, book_id];

    dataoffav = await execute(addtofavquery, values);
    res.json(exist);
  }
};

exports.fetchcontro = async (req, res) => {
  let user_id = req.query.user_id;
  let fetchcontro = `select book_title,book_publication_year,book_img from contributed_books
    inner join books_detail on books_detail.prime_book_id = contributed_books.contributed_book_id
    where contributed_books.user_id =  ?;`;

  let fetch_auth = `select author_name from books_author 
    inner join authors on books_author.author_id = authors.author_id
    inner join contributed_books on contributed_books.contributed_book_id = books_author.prime_book_id
    where user_id= ?;`;
  let resfetchconto = await execute(fetchcontro, user_id);
  let resfetchauthconto = await execute(fetch_auth, user_id);

  res.json({ resfetchconto, resfetchauthconto });
};
exports.contribute_post = async (req, res) => {
  const { book_name, author_name, sel_reason, sel_cat, sel_lan } = req.body;
  let bookname = book_name.trim();

  let checkcontro = `select book_name,author_name,sel_lan from contribution 
    where user_id = 1;`;
  let response = "";
  checkcontro = await execute(checkcontro);
  checkcontro.forEach(async (element) => {
    if (element.book_name === bookname) {
      response = "error";
    }
  });
  if (response == "") {
    let controquery = `insert into contribution(book_name,user_id,author_name,reason_id,sel_cat,sel_lan) values (?,?,?,?,?,?)`;
    let valuescontro = [bookname, 1, author_name, sel_reason, sel_cat, sel_lan];
    await execute(controquery, valuescontro);
    response = "success";
  }
  res.json(response);
};

exports.fetchcomment = async (req, res) => {
  let book_id = req.query.book_id || 1;
  let fetchcmt = `select comment_id,comment,comments.created_at,u_fname,user_id from comments
    inner join users on comments.reader_id =users.user_id
    where book_id=?;`;
  fetchcmt = await execute(fetchcmt, book_id);
  res.json(fetchcmt);
};

exports.fetchnestedcmt = async (req, res) => {
  let comment_id = req.query.comment_id;

  let fetchnestedomment = `select nested_comment,nested_comments.created_at,u_fname,user_id from nested_comments
  inner join users on nested_comments.reader_id =users.user_id
  inner join comments on nested_comments.comment_id = comments.comment_id
  where nested_comments.comment_id=?;`;
    let dataofnestedcmt = await execute(fetchnestedomment, comment_id);
  res.json({ dataofnestedcmt, comment_id });
};
exports.postcomment = async (req, res) => {
    
    let insertcmt = `insert into comments(reader_id,book_id,comment) values (?,?,?)`;
    let insvalues = [req.query.user_id, req.query.book_id, req.query.comment];
    
    insertcmt = await execute(insertcmt, insvalues)
    if(insertcmt.affectedRows == 1){
        res.json("success")
    };
}
exports.postnestedcomment = async (req, res) => {
  // /postnestedcomment/?user_id=${user_id}&&book_id=${book_id}&&comment=${replyoncmt}&&onwhomecmt=${replyonid}`);
    let insnestedcmt = `insert into nested_comments(reader_id, book_id, nested_comment,comment_id) VALUES (?,?,?,?);`
    let insnestedvalues = [req.query.user_id, req.query.book_id, req.query.comment, req.query.onwhomecmt]

    let insertnestedcmt = await execute(insnestedcmt, insnestedvalues);
    if(insertnestedcmt.affectedRows == 1){
        res.json("success")
    };
}
exports.formpdf = (req,res) =>{
  user_id = req.user[0].user_id;
    res.render("libraryform",{user_id});
}
exports.community = (req,res) =>{
  res.render("community/community",{user_id : req.user[0].user_id}  );
}
exports.fetchcommunity =async (req,res)=>{
  let user_id = req.user[0].user_id;
  let userimage = `select img_path from user_img where user_id = ? and isDeleted = 0; `;
  userimage = await execute(userimage,user_id);

  let fetchofcom = `select u_fname,u_lname,img_path,uploaded_text,uploaded_filepath,CAST(community.created_at AS DATE) as postdate,CAST(users.created_at AS DATE) as joindate,upload_id from community
  inner join users on users.user_id =  community.user_id
  inner join user_img on users.user_id =  user_img.user_id
  where user_img.isDeleted = 0;`

  fetchofcom = await execute(fetchofcom);
  res.json({fetchofcom,userimage});
}
exports.postincommunity =async (req,res) => {
  let qrforcom = '';
  let rescomupload;
  let user_id = req.user[0].user_id;
  let textinput = req.body.textinput;
  let finalpath = '';
  
 if (req.file != undefined) {
  let filepath = req.file.destination;
  filepath  = filepath.substring(8);
  let filename = req.file.filename;
  finalpath = filepath.concat("/",filename);
 }
  qrforcom = ` insert  into community (user_id,uploaded_text,uploaded_filepath)
  values(?,?,?);`
  rescomupload = await execute(qrforcom,[user_id,textinput,finalpath]);
  if (rescomupload.insertId != null) {
      res.json("success");
  }
}
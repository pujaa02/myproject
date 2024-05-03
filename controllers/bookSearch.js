const logger = require("../logger");
const { execute } = require("../dbConnection/executeQuery");
const con = require("../dbConnection/connection");
const { body } = require("express-validator");
const { off } = require("process");
const { dir } = require("console");

exports.index = async (req, res) => {
  try {
    let query = `select count(*) as 'row' from books_detail`;
    let count = await execute(query);
    count = count[0].row;

    let sql = `select any_value(books_detail.prime_book_id)as prime_book_id,
    any_value(books_detail.book_img) as book_img,
    any_value(books_detail.book_title) book_title,
    any_value(books_detail.book_publication_year) as book_publication_year,
    any_value(authors.author_name) as author_name,
    ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) 
    from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id
     group by inventory.prime_book_id)as remaining_book,genres.genre_name 
     from books_detail 
     left join books_author on books_detail.prime_book_id = books_author.prime_book_id 
     left join authors on books_author.author_id = authors.author_id
     left join rating on books_detail.prime_book_id = rating.book_id
     left join inventory on books_detail.prime_book_id = inventory.prime_book_id 
    join genres on books_detail.genre_id = genres.genre_id 
    group by books_detail.prime_book_id limit 2`;
    let data = await execute(sql);
    let page = 1;
    let first = 1;
    let last = 2;
    res.render("bookSearch/bookSearch", {
      data,
      page,
      first,
      last,
      count,
      user_id: req.user[0].user_id,
    });
  } catch (e) {
    logger.error(e);
  }
};

exports.order = async (req, res) => {
  try {
    let url = req.url;
    url1 = url.split("/");
    let column = url1[5];
    let order = url1[6];
    let sql = `select any_value(books_detail.prime_book_id)as prime_book_id,
    any_value(books_detail.book_img) as book_img,
    any_value(books_detail.book_title) book_title,
    any_value(books_detail.book_publication_year) as book_publication_year,
    any_value(authors.author_name) as author_name,ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book,genres.genre_name from books_detail left join books_author on books_detail.prime_book_id = books_author.prime_book_id left join authors on books_author.author_id = authors.author_id left join rating on books_detail.prime_book_id = rating.book_id left join inventory on books_detail.prime_book_id = inventory.prime_book_id join genres on books_detail.genre_id = genres.genre_id group by books_detail.prime_book_id order by ${column} ${order}`;
    let a = await show(url,req,res,sql);
    let first = a.first;
    let last = a.last;
    let page = a.page;
    let count = a.count;
    let offset = a.offset;
    let query = sql + ` limit 2 offset ${offset}`;
    let data = await execute(query);
    res.render("bookSearch/bookSearchOrder", {
      data,
      first,
      last,
      page,
      count,
      column,
      order,
      user_id: req.user[0].user_id,
    });
  } catch (e) {
    logger.error(e);
  }
};

exports.genre = async (req, res) => {
  try {
    let url = req.url;
    url1 = url.split("/");
    let genre = url1[5];
    let sql = `select any_value(books_detail.prime_book_id)as prime_book_id,
    any_value(books_detail.book_img) as book_img,
    any_value(books_detail.book_title) book_title,
    any_value(books_detail.book_publication_year) as book_publication_year,
    any_value(authors.author_name) as author_name,ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book,genres.genre_name from books_detail left join books_author on books_detail.prime_book_id = books_author.prime_book_id left join authors on books_author.author_id = authors.author_id left join rating on books_detail.prime_book_id = rating.book_id left join inventory on books_detail.prime_book_id = inventory.prime_book_id join genres on books_detail.genre_id = genres.genre_id and genres.genre_name = '${genre}' group by books_detail.prime_book_id`; 
    let a = await show(url,req,res,sql);
    let first = a.first;
    let last = a.last;
    let page = a.page;
    let count = a.count;
    let offset = a.offset;
    let query = sql + ` limit 2 offset ${offset}`;
    let data = await execute(query);
  
    res.render("bookSearch/bookSearchGenre", {
      data,
      first,
      last,
      count,
      page,
      genre,
      user_id: req.user[0].user_id,
    });
  } catch (e) {
    logger.error(e);
  }
};

exports.search = async (req, res) => {
  try {
    let url = req.url;
    url1 = url.split("/");
    let input = url1[6];
    input = input.replaceAll('%20', ' ');
    input = input.replace(/\s\s+/g, ' ');
    let option = url1[5]; 
    let first;
    let last;
    let page;
    let offset;
    let count;
    let data;

    if (option == "All") {
      let sql = `select books_detail.prime_book_id,books_detail.book_img,books_detail.book_title,books_detail.book_publication_year,authors.author_name,ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book,genres.genre_name from books_detail left join books_author on books_detail.prime_book_id = books_author.prime_book_id left join authors on books_author.author_id = authors.author_id left join rating on books_detail.prime_book_id = rating.book_id left join inventory on books_detail.prime_book_id = inventory.prime_book_id join genres on books_detail.genre_id = genres.genre_id and genres.genre_name like '${input}%' or books_detail.book_title like '${input}%' or authors.author_name like '${input}%' or books_detail.book_publication_year like '${input}%' group by books_detail.prime_book_id`;
      let a = await show(url, req, res, sql);
      first = a.first;
      last = a.last;
      page = a.page;
      offset = a.offset;
      count = a.count;
      query = sql + ` limit 2 offset ${offset}`;
    } else {
      let sql = `select books_detail.prime_book_id,books_detail.book_img,books_detail.book_title,books_detail.book_publication_year,authors.author_name,ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book,genres.genre_name from books_detail left join books_author on books_detail.prime_book_id = books_author.prime_book_id left join authors on books_author.author_id = authors.author_id left join rating on books_detail.prime_book_id = rating.book_id left join inventory on books_detail.prime_book_id = inventory.prime_book_id join genres on books_detail.genre_id = genres.genre_id and ${option} like '${input}%' group by books_detail.prime_book_id`;
      let a = await show(url, req, res, sql);
      first = a.first;
      last = a.last;
      page = a.page;
      offset = a.offset;
      count = a.count;
      query = sql + ` limit 2 offset ${offset}`;
    }
    data = await execute(query);
    res.render("bookSearch/bookSearchPagiSearch", {
      data,
      first,
      last,
      page,
      count,
      option,
      input,
      user_id: req.user[0].user_id,
    });
  } catch (e) {
    logger.error(e);
  }
};

exports.page = async (req, res) => {
  try {
    let url = req.url;
    let sql = `select any_value(books_detail.prime_book_id)as prime_book_id,
    any_value(books_detail.book_img) as book_img,
    any_value(books_detail.book_title) book_title,
    any_value(books_detail.book_publication_year) as book_publication_year,
    any_value(authors.author_name) as author_name,ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book,genres.genre_name from books_detail left join books_author on books_detail.prime_book_id = books_author.prime_book_id left join authors on books_author.author_id = authors.author_id left join rating on books_detail.prime_book_id = rating.book_id left join inventory on books_detail.prime_book_id = inventory.prime_book_id join genres on books_detail.genre_id = genres.genre_id group by books_detail.prime_book_id`;
    let a = await show(url,req,res,sql);
    let first = a.first;
    let last = a.last;
    let page = a.page;
    let count = a.count;
    let offset = a.offset;
    let query = sql + ` limit 2 offset ${offset}`;
    let data = await execute(query);
    res.render("bookSearch/bookSearch", {
      data,
      first,
      last,
      page,
      count,
      user_id: req.user[0].user_id,
    });
  } catch (e) {
    logger.error(e);
  }
};
exports.searchFilterPagination = async (req, res) => {
  try {
    let url = req.url;
    url1 = url.split("/");
    let input = url1[6];
    input = input.replaceAll('%20', ' ');
    input = input.replace(/\s\s+/g, ' ');
    let option = url1[5]; 
    let column = url1[7];
    let order = url1[8];
    let first;
    let last;
    let page;
    let offset;
    let count;
    let data;

    if (option == "All") {
      let sql = `select books_detail.prime_book_id,books_detail.book_img,books_detail.book_title,books_detail.book_publication_year,authors.author_name,ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book,genres.genre_name from books_detail left join books_author on books_detail.prime_book_id = books_author.prime_book_id left join authors on books_author.author_id = authors.author_id left join rating on books_detail.prime_book_id = rating.book_id left join inventory on books_detail.prime_book_id = inventory.prime_book_id join genres on books_detail.genre_id = genres.genre_id and genres.genre_name like '${input}%' or books_detail.book_title like '${input}%' or authors.author_name like '${input}%' or books_detail.book_publication_year like '${input}%' group by books_detail.prime_book_id order by ${column} ${order}`;
      let a = await show(url, req, res, sql);
      first = a.first;
      last = a.last;
      page = a.page;
      offset = a.offset;
      count = a.count;
      query = sql + ` limit 2 offset ${offset}`;
    } else {
      let sql = `select books_detail.prime_book_id,books_detail.book_img,books_detail.book_title,books_detail.book_publication_year,authors.author_name,ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book,genres.genre_name from books_detail left join books_author on books_detail.prime_book_id = books_author.prime_book_id left join authors on books_author.author_id = authors.author_id left join rating on books_detail.prime_book_id = rating.book_id left join inventory on books_detail.prime_book_id = inventory.prime_book_id join genres on books_detail.genre_id = genres.genre_id and ${option} like '${input}%' group by books_detail.prime_book_id order by ${column} ${order}`;
      let a = await show(url, req, res, sql);
      first = a.first;
      last = a.last;
      page = a.page;
      offset = a.offset;
      count = a.count;
      query = sql + ` limit 2 offset ${offset}`;
    }
    data = await execute(query);
    res.render("bookSearch/bookSearchFilter", {
      data,
      first,
      last,
      page,
      count,
      option,
      input,
      order,
      column,
      user_id: req.user[0].user_id,
    });
  } catch (e) {
    logger.error(e);
  }
};
exports.genreFilter = async (req, res) => {
  try {
    let url = req.url;
    url1 = url.split("/");
    let genre = url1[7];
    let column = url1[5];
    let order = url1[6];
    let sql = `select any_value(books_detail.prime_book_id)as prime_book_id,
    any_value(books_detail.book_img) as book_img,
    any_value(books_detail.book_title) book_title,
    any_value(books_detail.book_publication_year) as book_publication_year,
    any_value(authors.author_name) as author_name,ceiling(avg(rating.rating)) as rate,(select count(inventory.prime_book_id) from inventory where inventory.availability_status = '0' and books_detail.prime_book_id = inventory.prime_book_id group by inventory.prime_book_id)as remaining_book,genres.genre_name from books_detail left join books_author on books_detail.prime_book_id = books_author.prime_book_id left join authors on books_author.author_id = authors.author_id left join rating on books_detail.prime_book_id = rating.book_id left join inventory on books_detail.prime_book_id = inventory.prime_book_id join genres on books_detail.genre_id = genres.genre_id and genres.genre_name = '${genre}' group by books_detail.prime_book_id`;
  let a = await show(url, req, res, sql);
  let first = a.first;
  let last = a.last;
  let page = a.page;
  let count = a.count;
  let offset = a.offset;
  let query = sql + ` order by ${column} ${order} limit 2 offset ${offset}`;
  let data = await execute(query);

    res.render("bookSearch/bookGenreFilter", {
      data,
      first,
      last,
      count,
      page,
      genre,
      column,
      order,
      user_id: req.user[0].user_id,
    });
  } catch (e) {
    logger.error(e);
  }
};

async function show(url, req, res, sql) {
  let data = await execute(sql);
  let count = data.length;
  url = url.split("/");
  let direction = url[3];
  let page = Number(url[4]);
  let offset;
  let first;
  let last;

  if (direction == "first" || direction == ":direction") {
    first = 1;
    last = 2;
    page = 1;
    offset = 0;
  } else if (direction == "last") {
    if (count % 2 != 0) {
      first = count;
      last = count;
      offset = first - 1;
    } else {
      first = count - 2;
      last = count;
      offset = first - 1;
    }
    page = Math.ceil(count / 2);
  } else if (direction == "next") {
    page = page + 1;
    first = page * 2 - 1;
    last = page * 2;
    offset = page * 2 - 2;
  } else if (direction == "prev") {
    page--;
    first = page * 2 - 1;
    last = page * 2;
    offset = first - 1;
  }

  return { first, last, offset, count, page };
}

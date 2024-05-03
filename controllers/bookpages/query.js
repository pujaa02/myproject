const { execute } = require("../../dbConnection/executeQuery");

exports.fetchdata = async (req, res) => {
  let newarrivalquery = `select prime_book_id,book_img,created_at from books_detail 
  where created_at between DATE_SUB(DATE_SUB(NOW(), INTERVAL 3 HOUR), INTERVAL 30 DAY) AND DATE_SUB(NOW(), INTERVAL 3 HOUR);`;
  let findnewarrival = await execute(newarrivalquery);

  let findrecentreadingquery = `SELECT inventory.prime_book_id,inventory.book_id,books_log.borrow_date FROM books_log
  join inventory on books_log.book_id=inventory.book_id
   where borrow_date between DATE_SUB(DATE_SUB(NOW(),INTERVAL 3 HOUR), INTERVAL 20 DAY)  AND DATE_SUB(NOW(), INTERVAL 3 HOUR);`;
  let findrecentreading = await execute(findrecentreadingquery);

  let genresquery = `SELECT * FROM genres;`;
  let genres = await execute(genresquery);

  let bookallquery = `select books_detail.prime_book_id,books_detail.book_title,books_detail.genre_id,authors.author_name,
  genres.genre_name, books_detail.book_publication_year,books_detail.book_img from books_detail
    join genres on genres.genre_id=books_detail.genre_id
    join books_author on books_author.prime_book_id=books_detail.prime_book_id
    join authors on authors.author_id=books_author.author_id;`;
  let bookall = await execute(bookallquery);

  let ratingquery = `select inventory.prime_book_id, floor(Avg(rating.rating)) AS rating from rating
  join inventory on inventory.book_id=rating.book_id group by inventory.prime_book_id ;`;
  let rating = await execute(ratingquery);

  res.send({
    findnewarrival,
    findrecentreading,
    genres,
    bookall,
    rating,
  });
};
exports.fetchuserdata = async (req, res) => {
  let user_id = req.query.user_id;
  let issueuserquery = `select books_log.reader_id,books_log.book_id,books_log.borrow_date,books_log.status,inventory.prime_book_id from books_log
join inventory on inventory.book_id=books_log.book_id where reader_id=${user_id};`;
  let issueuser = await execute(issueuserquery);

  let watchlistquery = `select watch_lists.reader_id, watch_lists.prime_book_id from watch_lists where watch_lists.reader_id=${user_id} and isDeleted=0;`;
  let watchlist = await execute(watchlistquery);
  res.json({ issueuser, watchlist });
};

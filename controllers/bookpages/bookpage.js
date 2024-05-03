const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const publicpath = path.join(__dirname, "../../public");
const { log } = require("console");
const { execute } = require("../../dbConnection/executeQuery");

exports.bookhome = async (req, res) => {
  res.render("bookpages/bookhome", { user_id: req.user[0].user_id});
};

exports.bookmyshelf = async (req, res) => {
  res.render("bookpages/bookmyshelf", { user_id: req.user[0].user_id});
};
exports.deletewatchlist = async (req, res) => {
  let user_id = req.params.user_id;
  let prime_book_id = req.params.id;

  let removebook = `UPDATE watch_lists
  SET isDeleted =1
  WHERE reader_id=${user_id} and prime_book_id=${prime_book_id}; `;
  let watchlist = await execute(removebook);
  res.json("isdeleted true");
};
exports.about = async (req, res) => {
  res.render("bookpages/about",{user_id:req.user[0].user_id});
};
exports.support = async (req, res) => {
  res.render("bookpages/support", { user_id: req.user[0].user_id });
};
exports.terms_condition = async (req, res) => {
  res.render("bookpages/terms_condition", { user_id: req.user[0].user_id });
};

exports.user = async (req, res) => {
  let user_id = req.query.user_id;
  let userquery = `select u_fname,img_path from users
  inner join user_img on user_img.user_id = users.user_id
  where user_img.isDeleted = 0 and user_img.user_id=?;`;

  let resuser = await execute(userquery,user_id);
  if (resuser.length == 0) {
    userquery =  `select u_fname from users where user_id=?;`
    resuser = await execute(userquery,user_id)
  }
  res.json(resuser);
};
exports.exportpdf = async (req, res) => {
  let data = req.body.finallist;

  // Create a new PDF document
  const doc = new PDFDocument();
  // Generate a unique filename for the PDF
  const fileName = `Your_Watchlist_${data[0].reader_id}.pdf`;

  // Specify the path to the downloads directory
  const downloadsDir = path.join(publicpath, "/DOWNLOADS");

  // Ensure the downloads directory exists
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  // Construct the full path for the PDF `file
  const filePath = path.join(downloadsDir, fileName);

  // Pipe the PDF to a local file
  const stream = doc.pipe(fs.createWriteStream(filePath));

  // Populate PDF with JSON data

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    doc
      .fontSize(16)
      .text(`Book ` + (i + 1) + `:`, { underline: true })
      .moveDown(0.5);
    doc.fontSize(14).text(`book_title: ${element.book_title}`);
    doc.fontSize(14).text(`author_name: ${element.author_name}`);
    doc.fontSize(14).text(`Category: ${element.genre_name}`);
    doc
      .fontSize(14)
      .text(`book_publication_year: ${element.book_publication_year}`);
    doc.fontSize(14).text(`rating:,${element.rating}`);
  }

  // Finalize the PDF
  doc.end();
  res.json(fileName);
}


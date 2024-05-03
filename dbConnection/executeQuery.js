
const mysql = require("mysql2");
const logger = require("../logger");

const con = require('../dbConnection/connection')
async function execute(query, values) {
  con.connect(function (err) {
    if (err) throw err;
  });

  let res = new Promise((resolve, reject) => {
    con.query(query, values, (err, result) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  let result = res
    .then((result) => {
      return result;
    })
    .catch((err) => {
      logger.error(err)
      return err;
    });
  return result;
}

module.exports = { execute };

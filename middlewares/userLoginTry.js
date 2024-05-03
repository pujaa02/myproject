const { execute } = require("../dbConnection/executeQuery");
exports.userLoginTry = async (req, res, next) => {
  let email = req.body["email"];
  email = email.replace(/\s/g, "").toLowerCase();

  let password = req.body["pass"];
  pass = password.replace(/\s/g, "");

  let myForm = new Object();
  myForm.email = email;
  myForm.pass = pass;

  const now = new Date();

  const currentDateTime = now.toLocaleString();

  let month = now.getMonth();
  if (now.getMonth() < 10) {
    month = `0${now.getMonth() + 1}`;
  }
  let date = now.getDate();
  if (now.getDate() < 10) {
    date = `0${now.getDate()}`;
  }

  let dateString = `${now.getFullYear()}-${month}-${date} 00:00:00`;

  let query1 = `SELECT u.user_id,u_email,count(*) as fail_attampt FROM login_attempt as l LEFT JOIN users as u ON l.user_id = u.user_id WHERE l.login_status=0 AND u.u_email=?  AND login_timestamp>? GROUP BY u.user_id;`;

  let result1 = await execute(query1, [email, dateString]);

  if (result1.length == 0) {
    next();
  } else if (result1[0].fail_attampt < 4) {
    next();
  } else {
    res.render("./userAuthentication/login.ejs", {
      validation: true,
      data1: myForm,
      secondValidation: false,
      loginAttmapt: false,
    });
  }
};

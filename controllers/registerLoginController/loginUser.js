const { log } = require("winston");
const { execute } = require("../../dbConnection/executeQuery");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const logger = require("../../logger");

let id;
function timers(timeInt, digiLink) {
  try {
    if (timeInt == 1) {
      id = setTimeout(async () => {
        let query = `SELECT * FROM users WHERE access_key=?;`;
        let result = await execute(query, [digiLink]);
        if (result.length != 0 && result[0].u_pass == null) {
          let query = `DELETE FROM users WHERE access_key=?;`;
          let result = execute(query, [digiLink]);
        }
      }, 7200000);
    } else {
      clearTimeout(id);
    }
  } catch (error) {
    logger.error(error);
  }
}
function createRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
exports.forgetPass = async (req, res) => {
  res.render("./userAuthentication/forgetpass.ejs", {
    validation: true,
    inValid: false,
  });
};
exports.registerInsertion = async (req, res) => {
  let fname = req.body["fname"];
  let stringRegex = /^[a-zA-Z]+$/;
  fname = fname.replace(/\s/g, "");
  let lname = req.body["lname"];
  lname = lname.replace(/\s/g, "");
  let email = req.body["email"];
  email = email.replace(/\s/g, "").toLowerCase();
  let DOB = req.body["dob"];
  DOB = DOB.replace(/\s/g, "");
  let number = req.body["number"];
  number = number.replace(/\s/g, "");
  let gender_combo = req.body["gender_combo"];

  let digiLink = createRandomString(12);

  let forUser = 1;
  let query = `INSERT INTO users (u_fname,u_lname,u_email,u_contact,u_gender,u_dob,role_id,access_key) VALUES (?,?,?,?,?,?,?,?);`;
  let result = await execute(query, [
    fname,
    lname,
    email,
    number,
    gender_combo,
    DOB,
    forUser,
    digiLink,
  ]);

  timers(1, digiLink);

  res.json({ data1: digiLink, data2: result.insertId, validationDone: true });
};
exports.loginUser = (req, res) => {
  res.render("./userAuthentication/login.ejs", {
    validation: true,
    secondValidation: true,
  });
};
exports.registerNewUser = (req, res) => {
  res.render("./userAuthentication/register.ejs", {
    validation: false,
    exist: false,
  });
};
exports.createUserPassword = (req, res) => {
  try {
    let userId = req.query.userID;
    let digiLink = req.query.digiLink;
    res.render("./userAuthentication/createPassword.ejs", {
      data1: userId,
      data2: digiLink,
      data3: "createPass",
    });
  } catch (error) {
    logger.log(error);
  }
};
exports.createForgetUserPassword = async (req, res) => {
  try {
    let userId = req.query.userID;
    let digiLink = req.query.digiLink;

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
    let hours = now.getHours();
    if (now.getHours() < 10) {
      hours = `0${now.getHours()}`;
    }
    let mins = now.getMinutes();
    if (now.getMinutes() < 10) {
      mins = `0${now.getMinutes()}`;
    }
    let seconds = now.getSeconds();
    if (now.getSeconds() < 10) {
      seconds = `0${now.getSeconds()}`;
    }

    let dateString = `${now.getFullYear()}-${month}-${date} ${hours}:${mins}:${seconds}`;

    let query = `UPDATE users SET modified_at = ? WHERE (user_id = ?);`;
    let result = await execute(query, [dateString, userId]);

    res.render("./userAuthentication/forgetGeneratePass.ejs", {
      data1: userId,
      data2: digiLink,
      data3: "forgetPass",
    });
  } catch (error) {
    logger.log(error);
  }
};
exports.homePage = (req, res) => {
  logger.log(error);
  res.send("hello");
};
exports.checkCredentials = async (req, res) => {
  let email = req.body["email"];
  email = email.replace(/\s/g, "").toLowerCase();

  let password = req.body["pass"];
  pass = password.replace(/\s/g, "");

  let myForm = new Object();
  myForm.email = email;
  myForm.pass = pass;

  let query1 = `SELECT * FROM users WHERE u_email=?`;
  let result1 = await execute(query1, [email]);

  if (result1.length == 1) {
    let isPassSame = await bcrypt.compare(pass, result1[0].u_pass);

    if (isPassSame) {
      let payload = {
        id: result1[0].user_id,
        email: result1[0].u_email,
        role_id: result1[0].role_id,
      };

      const TOKEN = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      let options = {
        httpOnly: true,
      };

      let query2 = `INSERT INTO login_attempt (user_id,login_status) VALUES(?,?);`;
      await execute(query2, [result1[0].user_id, 1]);
      res.cookie("token", TOKEN, options);

      // res.cookie("userId",result1[0].user_id)
      //     .status(200)
      if (result1[0].role_id == 1) {
        res.redirect("/bookhome");
      } else {
        res.redirect("/admin");
      }

      // res.redirect("/home");
    } else {
      let query2 = `INSERT INTO login_attempt (user_id,login_status) VALUES(?,?);`;
      await execute(query2, [result1[0].user_id, 0]);

      res.render("./userAuthentication/login.ejs", {
        validation: true,
        secondValidation: false,
        data1: myForm,
        loginAttmapt: true,
      });
    }
  } else {
    res.render("./userAuthentication/login.ejs", {
      validation: true,
      secondValidation: false,
      data1: myForm,
      loginAttmapt: true,
    });
  }
};

exports.insertPassword = async (req, res) => {
  try {
    let createPass = req.body["passCreate"];
    createPass = createPass.replace(/\s/g, "");
    let confirmPass = req.body["passConfirm"];
    confirmPass = confirmPass.replace(/\s/g, "");
    let digiLink = req.body["digiLink"];
    digiLink = digiLink.replace(/\s/g, "");
    let userId = req.body["userId"];
    userId = userId.replace(/\s/g, "");

    let hashPassword = await bcrypt.hash(createPass, 7);

    let macthOrNot = await bcrypt.compare("Dg29042003", hashPassword);

    try {
      let createPass = req.body["passCreate"];
      createPass = createPass.replace(/\s/g, "");
      let confirmPass = req.body["passConfirm"];
      confirmPass = confirmPass.replace(/\s/g, "");
      // let bestFriendName = req.body["bname"];
      // bestFriendName = bestFriendName.replace(/\s/g, '');
      let digiLink = req.body["digiLink"];
      digiLink = digiLink.replace(/\s/g, "");
      let userId = req.body["userId"];
      userId = userId.replace(/\s/g, "");

      let hashPassword = await bcrypt.hash(createPass, 7);

      let macthOrNot = await bcrypt.compare("Dg29042003", hashPassword);

      try {
        let query =
          "UPDATE users SET u_pass = ?,pass_updated=1 WHERE (`user_id` = ?)";
        let result = await execute(query, [hashPassword, userId]);
        if (result.affectedRows == 1) {
          res.json({ process: true, validationState: true });
          timers(id, "fasjd");
        }
      } catch (error) {
        logger.error(e);
      }
    } catch (error) {}
  } catch (error) {}
};

exports.insertForgetPassword = async (req, res) => {
  try {
    let createPass = req.body["passCreate"];
    createPass = createPass.replace(/\s/g, "");
    let confirmPass = req.body["passConfirm"];
    confirmPass = confirmPass.replace(/\s/g, "");

    let digiLink = req.body["digiLink"];
    digiLink = digiLink.replace(/\s/g, "");
    let userId = req.body["userId"];
    userId = userId.replace(/\s/g, "");

    let hashPassword = await bcrypt.hash(createPass, 7);

    let macthOrNot = await bcrypt.compare("Dg29042003", hashPassword);

    try {
      let createPass = req.body["passCreate"];
      createPass = createPass.replace(/\s/g, "");
      let confirmPass = req.body["passConfirm"];
      confirmPass = confirmPass.replace(/\s/g, "");
      // let bestFriendName = req.body["bname"];
      // bestFriendName = bestFriendName.replace(/\s/g, '');
      let digiLink = req.body["digiLink"];
      digiLink = digiLink.replace(/\s/g, "");
      let userId = req.body["userId"];
      userId = userId.replace(/\s/g, "");

      let hashPassword = await bcrypt.hash(createPass, 7);

      let macthOrNot = await bcrypt.compare("Dg29042003", hashPassword);

      try {
        let query =
          "UPDATE `users` SET `u_pass` = ?,pass_updated=1 WHERE (`user_id` = ?)";
        let result = await execute(query, [hashPassword, userId]);
        if (result.affectedRows == 1) {
          res.json({ process: true, validationState: true });
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {}
  } catch (error) {
    logger.log(error);
  }
};

exports.checkUserName = async (req, res) => {
  let returnVal = true;

  let usernameOrPhone = req.body["username"];
  usernameOrPhone = usernameOrPhone.replace(/\s/g, "");
  let numberRegex = /[0-9]{10}/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  let username_error;
  if (usernameOrPhone.length < 10) {
    username_error = "length is too short! Please enter a valid Credentials";
    returnVal = false;
  } else if (!emailRegex.test(usernameOrPhone)) {
    if (!numberRegex.test(usernameOrPhone)) {
      username_error = "Please enter a valid Credentials";
      returnVal = false;
    } else {
      if (usernameOrPhone.length != 10) {
        username_error = "Number should contain 10 digit!!!";
        returnVal = false;
      }
    }
  } else if (!numberRegex.test(usernameOrPhone)) {
    if (!emailRegex.test(usernameOrPhone)) {
      username_error = "Please enter a valid Credentials";
      returnVal = false;
    }
  }

  if (returnVal) {
    let query1 = `SELECT * FROM users WHERE u_email=? OR u_contact=?;`;
    let result1 = await execute(query1, [usernameOrPhone, usernameOrPhone]);
    if (result1.length != 1) {
      res.json({ userName: usernameOrPhone, validation: true, inValid: true });
    } else {
      let user_id = result1[0].user_id;
      let query2 = `UPDATE users set pass_updated=0 WHERE user_id=?;`;
      await execute(query2, [user_id]);

      res.json({
        validation: true,
        inValid: false,
        digiLink: result1[0].access_key,
        userId: result1[0].user_id,
      });
    }
  } else {
    res.json({
      userName: usernameOrPhone,
      error: username_error,
      validation: false,
      inValid: false,
    });
  }
};

exports.doLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("login");
  } catch (error) {
    logger.error(error);
  }
};

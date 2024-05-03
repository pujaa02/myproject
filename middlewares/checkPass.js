const { execute } = require("../dbConnection/executeQuery");

const checkLinkTime = (result) => {
  let returnVal = true;
  let date1 = new Date(result);
  let date2 = new Date();
  let diff = (date2.getTime() - date1.getTime()) / 1000;
  if (diff > 7200) {
    returnVal = false;
  }
  return returnVal;
};

exports.checkpass = async (req, res, next) => {
  let createPass = req.body["passCreate"];
  createPass = createPass.replace(/\s/g, "");
  let confirmPass = req.body["passConfirm"];
  confirmPass = confirmPass.replace(/\s/g, "");
  let digiLink = req.body["digiLink"];
  digiLink = digiLink.replace(/\s/g, "");
  let userId = req.body["userId"];
  userId = userId.replace(/\s/g, "");

  try {
    let query1 = `SELECT access_key,created_at,pass_updated FROM users WHERE user_id=?`;
    let result = await execute(query1, [userId]);
    if (result.length != 0) {
      if (checkLinkTime(result[0].created_at) == false || result[0].pass_updated=="1") {
        res.json({ process: false, reason: "linkIsExpired" });
      } else {
        if (result[0].access_key != digiLink) {
          res.json({ process: false, reason: "digiLinkIsIncorrect" });
        } else {
          let returnVal = true;

          let lowerCaseLetters = /[a-z]/g;
          let upperCaseLetters = /[A-Z]/g;
          let numbers = /[0-9]/g;
          let stringRegex = /^[a-zA-Z]+$/;

          let myForm = new Object();
          myForm.createPass = createPass;
          myForm.confirmPass = confirmPass;
          // myForm.bestFriendName = bestFriendName;

          let errorCreatePass;
          if (createPass.length < 8) {
            errorCreatePass = "Minimum 8 Characters!!";
            returnVal = false;
          } else if (lowerCaseLetters.test(createPass) == false) {
            errorCreatePass = "add lowercase letter!!";
            returnVal = false;
          } else if (upperCaseLetters.test(createPass) == false) {
            errorCreatePass = "add uppercase letter!!";
            returnVal = false;
          } else if (numbers.test(createPass) == false) {
            errorCreatePass = "add numbers!!";
            returnVal = false;
          } else {
            errorCreatePass = "";
          }

          let errorConfirmPass;
          if (createPass !== confirmPass) {
            errorConfirmPass = "Both password is not same!!";
            returnVal = false;
          } else {
            errorConfirmPass = "";
          }

          let myError = new Object();
          myError.errorCreatePass = errorCreatePass;
          myError.errorConfirmPass = errorConfirmPass;

          if (returnVal == false) {
            res.json({
              process: true,
              validationState: false,
              data1: myForm,
              data2: myError,
            });
          } else {
            next();
          }
        }
      }
    } else {
      next();
    }
  } catch (error) {
    logger.error(error);
  }
};

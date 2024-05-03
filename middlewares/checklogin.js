const { execute } = require('../dbConnection/executeQuery');

exports.checklogin = (req, res, next) => {
    let returnVal = true;
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;

    let email = req.body["email"];
    email = email.replace(/\s/g, '').toLowerCase();

    let password = req.body["pass"];
    pass = password.replace(/\s/g, '');

    let stringRegex = /^[a-zA-Z]+$/;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    let email_error;
    if (email == "" || email == undefined) {
        email_error = "please add Email!";
        returnVal = false;
    }
    else if (!emailRegex.test(email)) {
        email_error = "please enter a valid email!";
        returnVal = false;
    }
    else {
        email_error = "";
    }


    let pass_error;
    if (pass.length < 8) {
        pass_error = "Minimum 8 Characters!!";
        returnVal = false;
    }
    else if (lowerCaseLetters.test(pass) == false) {
        pass_error = "add lowercase letter!!";
        returnVal = false;
    }
    else if (upperCaseLetters.test(pass) == false) {
        pass_error = "add uppercase letter!!";
        returnVal = false;
    }
    else if (numbers.test(pass) == false) {
        pass_error = "add numbers!!";
        returnVal = false;
    }
    else {
        pass_error = "";
    }

    let myError = new Object();
    myError.emailError = email_error;
    myError.passError = pass_error;

    let myForm = new Object();
    myForm.email = email;
    myForm.pass = pass;

    if (returnVal) {
        next();
    }
    else {
        res.render("./userAuthentication/login.ejs", { validation: false, data1: myForm, data2: myError, secondValidation: true, loginAttmapt: true });
    }
}
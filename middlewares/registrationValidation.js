// let data = require("/home/darshan-parekh/Desktop/LIBRARAY10APR/smartlib/dbConnection/connection.js");

const { execute } = require('../dbConnection/executeQuery');
exports.registerValidation = async (req, res, next) => {

    let email = req.body["email"];
    email = email.replace(/\s/g, '').toLowerCase();
    let number = req.body["number"];
    number = number.replace(/\s/g, '');

    let query1 = `SELECT COUNT(*) as exist FROM users WHERE u_contact=? OR u_email=?;`;
    let result1 = await execute(query1, [number,email]);

    let fname = req.body["fname"];
    let  stringRegex = /^[a-zA-Z]+$/;
    fname = fname.replace(/\s/g, '');
    let lname = req.body["lname"];
    lname = lname.replace(/\s/g, '');
    let DOB = req.body["dob"];
    DOB = DOB.replace(/\s/g, '');
    let gender_combo = req.body["gender_combo"];

    let myForm = new Object();
    myForm.fname = fname;
    myForm.lname = lname;
    myForm.email = email;
    myForm.DOB = DOB;
    myForm.number = number;
    myForm.gender_combo = gender_combo;

    let fnameError;
    if (fname == "" && fname == undefined) {
        fnameError = "first name is empty!";
    }
    else if (fname.length < 2) {
        fnameError = "first name is too short!";
    }
    else if (fname.length > 15) {
        fnameError = "First name is too large!!";
    }
    else if (stringRegex.test(fname) == false) {
        fnameError = "Name should contain Characters!!";
    }
    else {
        fnameError = "";
    }

    let lnameError;
    if (lname == "" && lname == undefined) {
        lnameError = "Last name should not empty!";
    }
    else if (lname.length < 2) {
        lnameError = "Last name is too short!";
    }
    else if (lname.length > 15) {
        lnameError = "Last name is too large!!";
    }
    else if (stringRegex.test(lname) == false) {
        lnameError = "Name should contain Characters!!";
    }
    else {
        lnameError = "";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let emailError;
    if (email == "" || email == undefined) {
        emailError = "please add Email!";
    }
    else if (!emailRegex.test(email)) {
        emailError = "please enter a valid email!";
    }
    else {
        emailError = "";
    }

    let DOBRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    let dobError;
    if (DOB == "" || DOB == undefined) {
        dobError = "please add DOB!";
    }
    else if (DOBRegex.test(DOB) == false) {
        dobError = "please enter DOB in YYYY-MM-DD Format!!";
    }
    else {
        dobError = "";
    }

    let numberError;
    let numberRegex = /[0-9]{10}/;
    if (number.length != 10) {
        numberError = "Number should contain 10 digit!!!";
    }
    else if (!numberRegex.test(number)) {
        numberError = "Please enter a valid phone number";
    }
    else {
        numberError = "";
    }

    let  genderError;
    if (gender_combo == undefined) {
        genderError = "You need to select gender!";
    }
    else {
        genderError = "";
    }

    let error = new Object();
    error.fnameError = fnameError;
    error.lnameError = lnameError;
    error.emailError = emailError;
    error.numberError = numberError;
    error.genderError = genderError;
    error.dobError = dobError;

    if (result1[0].exist == undefined || result1[0].exist == 0 || result1[0].exist=="Error in query") {
        let  count = 0;
        for (const property in error) {
            if (error[property].length != 0) {
                count++;
            }
        }
        if(count==0){
            next();
        }
        else{
           // res.render("register.ejs",{data1:myForm,data2:error,validation:true,exist:false});
            res.json({data1:myForm,data2:error,validationDone:false,exist:false});
        }
    }
    else {
        let error = new Object();
        error.fnameError = "";
        error.lnameError = "";
        error.emailError = "";
        error.numberError = "";
        error.genderError = "";
        error.dobError = "";

        res.json({data1:myForm,data2:error,validationDone:false,exist:true});
    }

} 
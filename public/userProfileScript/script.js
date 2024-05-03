
const setCurrentPage = (element, e) => {
    document.getElementsByClassName("current_page")[0].removeAttribute("class");
    current_page_id = element.id;
    element.setAttribute("class", "current_page");
    e.preventDefault();
}


const showReplyForm = () => {
    let form = document.getElementById('replyForm');
    console.log(form);
    if (form.classList.contains('d-none')) {
        form.classList.remove('d-none');
    }
    else {
        form.classList.add('d-none');
    }
}

const sendReply = async () => {
    let form = document.getElementById('replyForm');
    let msg = form['reply'].value.trim();
    if (msg != "") {
        let myformData = new FormData(form);
        let params = new URLSearchParams(myformData);
        let res = await new Response(params).text();
        console.log(res);
        let data = await fetch(`${location.origin}/sendReply`, {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: res,
        });
        let result = await data.json();
        if (result) {
            form['reply'].value = "";
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your comment has been saved",
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    else {
        Swal.fire("Commnet should not be an empty string !");
    }
}

const validateForm = () => {
    let form = document.getElementById("userDataForm");
    let fname = form['fname'];
    let lname = form['lname'];
    let email = form['email'];
    let gender = form['gender'];
    let address = form['address'];
    let contact = form['contact'];
    let dob = form['dob'];
    let count = 0;
    if (validateFname(fname, fname.value)) {
        count++;
    }
    if (validateLname(lname, lname.value)) {
        count++;
    }
    if (validateEmail(email, email.value)) {
        count++;
    }
    if (validateContact(contact, contact.value)) {
        count++;
    }
    if (validateGender(gender, gender.value)) {
        count++;
    }
    if (validateDOB(dob, dob.value)) {
        count++;
    }
    if (validateAdd(address, address.value)) {
        count++;
    }
    if (count == 7) {
        return true;
    }
    else {
        return false;
    }
}

let validateFname = (fname, val) => {
    let div = fname.parentElement;
    let span = div.getElementsByTagName("span")[0];
    let stringRegex = /^[a-zA-Z]+$/;
    val = val.replace(/\s/g, '');
    if (val == "") {
        span.innerHTML = "please enter your first name";
        return false;
    }
    if (!stringRegex.test(val)) {
        span.innerHTML = "your name should only contain characters";
        return false;
    }
    if (val.length < 3) {
        span.innerHTML = "your name is too short";
        return false;
    }
    if (val.length > 15) {
        span.innerHTML = "your name is too long";
        return false;
    }
    span.innerHTML = "";
    return true;
}

let validateLname = (lname, val) => {
    let div = lname.parentElement;
    let span = div.getElementsByTagName("span")[0];
    let stringRegex = /^[a-zA-Z]+$/;
    val = val.replace(/\s/g, '');
    if (val == "") {
        span.innerHTML = "please enter your last name";
        return false;
    }
    if (!stringRegex.test(val)) {
        span.innerHTML = "your name should only contain characters";
        return false;
    }
    if (val.length < 3) {
        span.innerHTML = "your name is too short";
        return false;
    }
    if (val.length > 15) {
        span.innerHTML = "your name is too long";
        return false;
    }
    span.innerHTML = "";
    return true;
}
let validateGender = (gender, val) => {
    console.log("lname" + val);
    let div = lname.parentElement;
    let span = div.getElementsByTagName("span")[0];
    if (val == "") {
        span.innerHTML = "please select your gender";
        return false;
    }
    span.innerHTML = "";
    return true;
}


let validateEmail = (email, val) => {
    let div = email.parentElement;
    let span = div.getElementsByTagName("span")[0];
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    val = val.replace(/\s/g, '');
    if (val == "") {
        span.innerHTML = "please enter your email";
        return false;
    }
    if (!emailRegex.test(val)) {
        span.innerHTML = "Invalid email";
        return false;
    }
    span.innerHTML = "";
    return true;
}
let validateContact = (contact, val) => {
    let numberRegex = /^[0-9]{10}$/;
    let stringRegex = /^[a-zA-Z]+$/;
    let div = contact.parentElement;
    let span = div.getElementsByTagName("span")[0];
    val = val.replace(/\s/g, '');
    if (val == "") {
        span.innerHTML = "please enter your contact number";
        return false;
    }
    if (stringRegex.test(val)) {
        span.innerHTML = "your contact number should not contain charaters";
        return false;
    }
    if (!numberRegex.test(val)) {
        span.innerHTML = "your phone number should be of 10 digits";
        return false;
    }
    span.innerHTML = "";
    return true;
}
let validateDOB = (dob, val) => {
    console.log("dob");
    const DOBRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    let stringRegex = /^[a-zA-Z]+$/;
    let div = dob.parentElement;
    let span = div.getElementsByTagName("span")[0];
    val = val.replace(/\s/g, '');
    if (val == "") {
        span.innerHTML = "please enter your date of birth";
        return false;
    }
    if (stringRegex.test(val)) {
        span.innerHTML = "your date of birth should not contain characters";
        return false;
    }
    if (!DOBRegex.test(val)) {
        span.innerHTML = "invalide dob your should have the following format yyyy-mm-dd "
        return false;
    }
    span.innerHTML = "";
    return true;

}
let validateAdd = (address, val) => {
    let div = address.parentElement;
    let span = div.getElementsByTagName("span")[0];
    let stringRegex = /^[a-zA-Z]+$/;
    val = val.replace(/\s/g, '');
    if (val == "") {
        span.innerHTML = "please enter your address";
        return false;
    }
    span.innerHTML = "";
    return true;
}
const updateUserData = async () => {
    let isValidate = true;
    isValidate = validateForm();
    if (isValidate == true) {
        let form = document.getElementById("userDataForm");
        let myformData = new FormData(form);
        let params = new URLSearchParams(myformData);
        let res = await new Response(params).text();
        console.log(res);
        let data = await fetch(`${location.origin}/updateUserData`, {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: res,
        });
        let result = await data.json();
        console.log("isError: " + result.isError);
        console.log(result);
        if (result.isError) {
            console.log(result.errors.errors);
            result.errors.errors.forEach((element) => {
                let field = document.getElementsByName(`${element.path}`)[0];
                let div = field.parentElement;
                div.getElementsByTagName('span')[0].innerHTML = element.msg;
            });
        }
        else {
            let spans = Array.from(document.getElementsByTagName('span'));
            console.log(spans);
            spans.forEach((element) => {
                element.innerHTML = "";
            });
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your details have been updated successfully",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }
}

const deleteFromFav = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            let watchlist_id = parseInt(id);
            console.log(watchlist_id);
            let data = await fetch(`${location.origin}/deleteFromFav?watchlist_id=${watchlist_id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            let result = await data.json();
            console.log(result);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
            });

        }
    });
}

const deleteAllNotification = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't to delete this message",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            console.log("reader_id " + id);
            let data = await fetch(`${location.origin}/deleteAllNotification?id=${id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            let result = await data.json();
            console.log(result);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
            })
        }
    });
}

const deleteNotification = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't to delete this message",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            console.log("notify_id " + id);
            let data = await fetch(`${location.origin}/deleteNotification?id=${id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            let result = await data.json();
            console.log(result);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Message has been deleted successfully",
                showConfirmButton: false,
                timer: 1500
            })
        }
    })
}

let seenMsg = async (id, element) => {
    console.log(" notify_id " + id);
    element.src = "./userProfileScript/icons/greenCheck.svg";
    let data = await fetch(`${location.origin}/seenMsg?id=${id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let result = await data.json();
}

const deleteComment = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete your comment",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            console.log("delete comment");
            let data = await fetch(`${location.origin}/deleteComment?id=${id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            let result = await data.json();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Comment has been deleted successfully",
                showConfirmButton: false,
                timer: 1500
            })
        }
    })
}

const uploadImg = async () => {
    let form = document.getElementById('img_form');
    let user_id = form['user_id'].value;
    let user_img = document.getElementById('user_img').files[0];
    let formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('user_img', user_img);
    console.log(formData);
    let data = await fetch(`${location.origin}/uploadUserImg`, {
        method: "post",
        body: formData,
    });
    let result = await data.json();
    console.log(result);
    let msg = '';
    if (result.isError == false) {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Image uploaded Successfully",
            showConfirmButton: false,
            timer: 1500
        });
    }
    else {
        msg = '<div class="alert alert-danger alert-dismissible fade show" role="alert">';
        result.errors.forEach((element) => {
            msg += `<p><strong>${element.msg}</strong></p>`;
        });
        msg += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span></button> </div>';
        document.getElementById("showMsg").innerHTML = msg;
    }

}

const removeImg = async (img_id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this image",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            let data = await fetch(`${location.origin}/removeImg?img_id=${img_id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            let result = await data.json();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Image Deleted Successfully",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });


}

const search = async () => {
    let searchElement = document.getElementsByName('search_text')[0];
    console.log(searchElement);
    if (searchElement.value == "") {
        return false;
    }

    let form = document.getElementById("searchForm");
    let myformData = new FormData(form);
    let params = new URLSearchParams(myformData);
    let res = await new Response(params).text();
    console.log("result");
    console.log(res);
    let data = await fetch(`${location.origin}/searchNotify`, {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: res,
    });
    let myresult = await data.json();
    console.log(myresult.result);
    let result = myresult.result;
    let search_text = myresult.search_text;
    if (result != undefined) {
        searchElement.value = "";
        if (result.length == 0) {
            let msg = '<div class="alert alert-danger alert-dismissible fade show" role="alert">  <strong>Sorry! No data found as per your search</strong><button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span>  </button> </div>';
            document.getElementById("showMsg").innerHTML = msg;
        }
        else {
            let totalLength = result.length;
            if (totalLength <= 2) {
                let txt = '<div id="cards">';
                result.forEach((element) => {
                    txt += ` <div id="card">
           <div class="card-body">
               <p>
               <p class="float-right" onclick="deleteNotification(${element.notify_id})"><img
                       width="30" height="30"
                       src="https://cdn-icons-png.flaticon.com/128/5709/5709442.png" /></p>
               </p>
               <div class="d-flex flex-row align-items-end ">
                   <img width="40" height="40"
                       src="https://cdn.iconscout.com/icon/premium/png-512-thumb/book-2382575-2013047.png?f=webp&w=256" />

                 <h5 class="card-title text-center"><b>
                         ${element.book_title}
                     </b></h5>
             </div>
             <p class="card-text">
                   ${element.message}
             </p>
             <p class="float-right">
                 ${element.created_at}
             </p>`;

                    if (element.isSeen == 1) {
                        txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
                    } else {
                        txt += `<img onclick="seenMsg('<%=element.notify_id%>', this)"
                           src="./userProfileScript/icons/simpleCheck.svg" />`;
                    }

                    txt += `</div>
       </div>`;
                })
                txt += '</div>';
                txt += `<div class="container-fluid"><p onclick="deleteAllNotification(${result[0].reader_id})"
                    class=" ubtn float-right text-light">
                    clear
                    all</p>
            </div>`;
                console.log(document.getElementById("main"));
                document.getElementById("main").innerHTML = txt;
            }
            else {
                let text = '<div id="cards">';
                for (let i = 0; i < 2; i++) {
                    text += ` <div id="card">
                <div class="card-body">
                    <p>
                    <p class="float-right" onclick="deleteNotification(${result[i].notify_id})"><img
                            width="30" height="30"
                            src="https://cdn-icons-png.flaticon.com/128/5709/5709442.png" /></p>
                    </p>
                    <div class="d-flex flex-row align-items-end ">
                        <img width="40" height="40"
                            src="https://cdn.iconscout.com/icon/premium/png-512-thumb/book-2382575-2013047.png?f=webp&w=256" />
     
                        <h5 class="card-title text-center"><b>
                                ${result[i].book_title}
                            </b></h5>
                    </div>
                    <p class="card-text">
                          ${result[i].message}
                    </p>
                    <p class="float-right">
                        ${result[i].created_at}
                    </p>`;

                    if (result[i].isSeen == 1) {
                        text += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
                    } else {
                        text += `<img onclick="seenMsg('<%=element.notify_id%>', this)"
                                src="./userProfileScript/icons/simpleCheck.svg" />`;
                    }

                    text += `</div></div>`;
                }
                text += `</div><div class="container-fluid"><p onclick="deleteAllNotification(${result[0].reader_id})"
                class=" ubtn float-right text-light">
                clear
                all</p>
             </div>`;
                text += `<nav aria-label="Page navigation example" class="float-left">
            <ul class="pagination">
                <li class="page-item">
                    <p aria-label="Previous" onclick="displayFirstNotiS(${result[0].reader_id},'${search_text}')"
                        class="page-link">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </p>
                </li>
                <li class="page-item">
                    <p onclick="prevNotiS(${result[0].reader_id},'${search_text}')" class="page-link">
                        < </p>
                </li>
                <li class="page-item">
                    <p id="pageNo" class="page-link">1</p>
                </li>
                <li class="page-item">
                    <p onclick="nextNotiS(${result[0].reader_id},'${search_text}')" class="page-link">>
                    </p>
                </li>
                <li class="page-item">
                    <p onclick="displayLastNotiS(${result[0].reader_id}, '${search_text}')" aria-label="Next"
                        class="page-link">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </p>
                </li>
            </ul>
        </nav>`;
                console.log(text);
                console.log(document.getElementById("main"));
                document.getElementById("main").innerHTML = text;
            }
        }
    }
}

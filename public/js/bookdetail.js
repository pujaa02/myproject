const socket = io();  

let isclickedid = [0];
function viewProfile() {

    let profile = document.getElementById('profile');
    if (profile.style.display == 'flex') {
        profile.style.display = 'none';
    }
    else {
        profile.style.display = 'flex';
    }
}
function showDetails(i) {
    let details = document.getElementsByClassName('details');
    let li = document.getElementsByClassName('bookA');
    Array.from(details).forEach((element, index) => {
        if (index == i) {
            details[index].style.display = 'flex';
            li[index].style.cssText = `color: #F27851; text-decoration: underline; font-weight: 700; opacity: 1;`;
        }
        else {
            details[index].style.display = 'none';
            li[index].style.cssText = `text-decoration: none; color: black; opacity: 0.5;`;
        }
    });
}
async function data(book_id,user_id) {
    let url = await fetch(`/bookDetails/?book_id=${book_id}`);
    let res = await url.json();

    document.getElementById('title').innerHTML = res.recommendeddata[0].book_title;
    document.getElementById('authname1').innerHTML = res.recommendeddata[0].author_name;
    document.getElementById('authname2').innerHTML = res.recommendeddata[0].author_name;
    document.getElementById('genre').innerHTML = res.recommendeddata[0].genre_name;
    document.getElementById('bookdesc').innerHTML = res.recommendeddata[0].book_desc;
    document.getElementById('publication').innerHTML = res.recommendeddata[0].book_publication;
    document.getElementById('publication_year').innerHTML = res.recommendeddata[0].book_publication_year;
    document.getElementById('publication_year2').innerHTML = res.recommendeddata[0].book_publication_year;
    document.getElementById('book_img').src = `${res.recommendeddata[0].book_img}`;

    if (res.recommendeddata[0].author_img == '') {
        document.getElementById('authorImg').src = `${res.recommendeddata[0].author_img}`;
    } else {
        document.getElementById('authorImg').style.visibility = "hidden";
    }
    document.getElementById('authdesc').innerHTML = res.recommendeddata[0].author_desc;
    document.getElementById('rate').innerHTML = `${res.rate}.0`;
    document.getElementById('readed').innerHTML = `${res.totalread[0].read} Have Read`;
    document.getElementById('curread').innerHTML = `${res.reading[0].read} Currently Reading`;

    if (res.recommendeddata[0].availability_status > 0) {
        document.getElementById('available').innerHTML = "Available"
    }
    else {
        document.getElementById('available').innerHTML = "Not Available"
    }
    if(res.authotherbook.length == 0){
        document.getElementById('authorBooks').style.visibility = "hidden";
    }   
    else{
        document.getElementById('authorbooks1').src = `${res.authotherbook[0].book_img}`; 
         if (res.authotherbook[1] != undefined) {
            document.getElementById('authorbooks2').src = `${res.authotherbook[1].book_img}`;
        }
        else{
            document.getElementById('authorbooks2').style.visibility = "hidden";
        }
    }
console.log(res.relatedbook);
    let related_book1 = document.getElementById('related_book1');
    if (res.relatedbook[0] != null) {
        document.getElementById('related1').addEventListener("click", function () {
            bookdetailpage(res.relatedbook[0].prime_book_id);
        })
        document.getElementById('relatedbook1').src = `${res.relatedbook[0].book_img}`;
    }
    else {
        document.getElementById('related_book1').style.visibility = "hidden";
    }
    if (res.relatedbook[1] != null) {
        document.getElementById('related2').addEventListener("click", function () {
            bookdetailpage(res.relatedbook[1].prime_book_id);
        })
        document.getElementById('relatedbook2').src = `${res.relatedbook[1].book_img}`;
    }
    else {
        document.getElementById('related_book2').style.visibility = "hidden";
    }
    if (res.relatedbook[2] != null) {
        document.getElementById('related3').addEventListener("click", function () {
            bookdetailpage(res.relatedbook[2].prime_book_id);
        })
        document.getElementById('relatedbook3').src = `${res.relatedbook[2].book_img}`;
    }
    else {
        document.getElementById('related_book3').style.visibility = "hidden";
    }
    if (res.relatedbook[3] != null) {
        document.getElementById('related4').addEventListener("click", function () {
            bookdetailpage(res.relatedbook[0].prime_book_id);
        })
        document.getElementById('relatedbook4').src = `${res.relatedbook[3].book_img}`;
    }
    else {
        document.getElementById('related_book4').style.visibility = "hidden";
    }
    if (res.relatedbook[4] != null) {
        document.getElementById('related5').addEventListener("click", function () {
            bookdetailpage(res.relatedbook[4].prime_book_id);
        })
        document.getElementById('relatedbook5').src = `${res.relatedbook[4].book_img}`;
    }
    else {
        document.getElementById('related_book5').style.visibility = "hidden";
    }
    for (let i = 1; i < res.rate+1; i++) {
        let cl = document.getElementById(`st${i}`);
        let filled = `<i id="st1" class="fa fa-star filled"></i>`;
        cl.innerHTML = filled;
    }

    // fetching comments 
    let fetchcmturl = await fetch(`/fetchcomment/?book_id=${book_id}`);
    let rescmts = await fetchcmturl.json();

    let appendcmts = "";
    appendcmts = `<div class="bookComment" style="display:flex;flex-direction: row;justify-content: space-around;"> <input type="text" id="cmtofuser" placeholder="Write your comment here" style="width:80%;border-radius: 10px;background-color: #F3F3F7;padding:2px;"><button style="background-color:#fa7c54;padding:4px;border-radius: 10px" onclick="comment(${book_id},${user_id})">Enter</button></div>`;

    rescmts.forEach(element => {
        isclickedid.push(element.comment_id + "fal");
    })

    rescmts.forEach(element => {
        let date = (element.created_at).slice(0, 10);
        appendcmts += `<div class="bookComment"><div class="bookUserComment"><h6>` + element.u_fname + `</h6><p>` + date + `</p></div><div>` + element.comment + `</div><div class="fornest"><img src="/assests/cmt.png" class="arrcmt" onclick="fetchnested(` + element.comment_id + `)"><div class="replydiv"><div style="opacity:0.5"  onclick="replycomment(` + element.comment_id + `,` + book_id + `,` + user_id + `)">Reply them</div><div style="opacity:1" id="rep` + element.comment_id + `"></div></div></div><div id="` + element.comment_id + `" style="margin-left: 50px;"></div></div>`
    });
    document.getElementById('displayCol').innerHTML = appendcmts;

}

//post comment 
async function comment(book_id, user_id) {
    let comment = document.getElementById('cmtofuser').value;
    let postcomment = await fetch(`/postcomment/?user_id=${user_id}&&book_id=${book_id}&&comment=${comment}`);
    let rescomment = await postcomment.json();
    
    if (rescomment == "success") {
        socket.emit("comment",{book_id,user_id});
    }
}
socket.on("repcmtsuccess",(cmt)=>{
        data(cmt.book_id,cmt.user_id);
})

//add input for nested comment
function replycomment(replyonid, book_id, user_id) {
    let replyinp = `<div class="cmtreply" style="display:flex;flex-direction:row;justify-content: space-around;margin-top: 10%;"> <input type="text" id="nestedcmtofuser` + replyonid + `" placeholder="Write your comment here" style="width:80%;border-radius: 5px;padding:2px;"><button style="background-color:#fa7c54;padding:4px;border-radius: 5px" onclick="commentonuser(` + replyonid + `,` + book_id + `,` + user_id + `)">Reply</button></div>`;

    let replyiddiv = "rep" + replyonid;
    document.getElementById(replyiddiv).innerHTML = replyinp;
    document.getElementById(replyiddiv).style.opacity = "1";
}

//post nested comment
async function commentonuser(replyonid, id, user_id) {
    book_id = id;

    let replyoncmt = document.getElementById("nestedcmtofuser" + replyonid).value;
    let postnestedcomment = await fetch(`/postnestedcomment/?user_id=${user_id}&&book_id=${book_id}&&comment=${replyoncmt}&&onwhomecmt=${replyonid}`);

    let responseofnestedcmt = await postnestedcomment.json();
    if (responseofnestedcmt == "success") {
        socket.emit("nestedcomment",{book_id,user_id});
    }
}
socket.on("repnescmtsuccess",(nescmt)=>{
    data(nescmt.book_id,nescmt.user_id);
})
//fetching nested comments
async function fetchnested(comment_id) {
    let fetchnestedcmt = await fetch(`/fetchnestedcmt/?comment_id=${comment_id}`);
    let resnested = await fetchnestedcmt.json();

    console.log(resnested);

    var clickcount = comment_id + "fal"
    if (isclickedid[comment_id] === clickcount) {
        isclickedid[comment_id] = comment_id + "true";

        if (resnested.dataofnestedcmt.length == 0) {
            let emp = document.getElementById(comment_id);
            emp.innerHTML = "no comments here";
            emp.style.background = "#F3F3F7";
            emp.style.border = "1px solid"
            emp.style.borderRadius = "10px"
            emp.style.width = "fit-content"
            emp.style.padding = "3px"
        }
        else {
            let appendnestedcmts = "";
            (resnested.dataofnestedcmt).forEach(element => {
                let date = (element.created_at).slice(0, 10);
                appendnestedcmts += `<div class="nest"><div class="nestcmt"><h6>` + element.u_fname + `</h6><p>` + date + `</p></div><div>` + element.nested_comment + `</div></div>`;
            });
            document.getElementById(comment_id).innerHTML = appendnestedcmts;
        }
        let emp = document.getElementById(comment_id).style.display = "block";
    }
    else {
        isclickedid[comment_id] = clickcount;
        let emp = document.getElementById(comment_id).style.display = "none";
    }
}
async function addwatch(book_id, user_id) {
    let addingurl = await fetch(`/addtofav/?book_id=${book_id}&&user_id=${user_id}`);
    let res = await addingurl.json();
    if (res == "yes") {
        Swal.fire({
            title: 'Info!',
            text: 'Already in Watchlist',
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#FA7C54 '
        })
    }
    else {
        Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Added to your watchlist",
            showConfirmButton: false,
            timer: 1300
        });
    }
}

async function bookdetailpage(idofbook) {
    window.location.href = `/book_in_detail/?book_id=${idofbook}`;
}

function back() {
    window.history.back();
}
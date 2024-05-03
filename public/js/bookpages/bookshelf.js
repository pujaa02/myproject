let previousid;

let headings = document.querySelector(".accordian_list");
let childofheading = headings.children;
let allbooks = childofheading[0].children[0];
allbooks.style.color = "#4d4d4d";

const changestyle = (id) => {
  //removing export btn in other displays
  if (id == "borrowedbook" || id == "pendingbook") {
    document.getElementById("export").style.display = "none";
  } else {
    document.getElementById("export").style.display = "block";
  }

  allbooks.style.color = "#868686";
  if (previousid != undefined || previousid != null) {
    document.getElementById(previousid).style.color = "#868686";
  }
  let variable = id.slice(0, -4);
  document.getElementById(variable).style.color = "#4d4d4d";
  previousid = variable;
  let div = document.getElementById("allbooksectionpage");
  let childNodes = Array.from(div.children);
  childNodes.forEach((element) => {
    if (element.id == id) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
};
async function changecontent() {
  for (let i = 1; i < childofheading.length; i++) {
    childofheading[i].children[0].style.color = "#868686";
  }
  allbooks.style.color = "#4d4d4d";
  let div = document.getElementById("allbooksectionpage");
  let childNodes = Array.from(div.children);
  childNodes.forEach((element) => {
    element.style.display = "block";
  });
}
async function myfun(id) {
  let url = await fetch(`${location.origin}/fetchuserdata/?user_id=${id}`);
  let userresult = await url.json();
  const issueuser = userresult.issueuser;

  async function fetchdataresult() {
    let url = await fetch(`${location.origin}/fetchdata`);
    let result = await url.json();
    return result;
  }

  async function fetchuserbooks() {
    let res = await fetchdataresult();
    let filterrate = res.rating.filter((value, index, self) => {
      return (
        self.findIndex((v) => v.prime_book_id === value.prime_book_id) === index
      );
    });
    const data = issueuser.map((t1) => ({
      ...t1,
      ...filterrate.find((t2) => t2.prime_book_id === t1.prime_book_id),
    }));

    const finalresultissuebooks = data.map((t1) => ({
      ...t1,
      ...res.bookall.find((t2) => t2.prime_book_id === t1.prime_book_id),
    }));

    const row = document.querySelector(".product_container");
    let rowrem = document.querySelector(".product_container_two");
    if (finalresultissuebooks.length == 0) {
      row.innerHTML = `<p class="nulldata">No Data Found!!</p>`;
      rowrem.innerHTML = `<p class="nulldata">No Data Found!!</p>`;
    } else {
      let flag=0;
      finalresultissuebooks.forEach((obj) => {
        let today = new Date();
        let col = document.createElement("div");
        col.setAttribute("class", "product-card-wrap");
        let colunder = document.createElement("div");
        colunder.setAttribute("class", "card-wrap");

        let img = document.createElement("img");
        img.setAttribute("src", `${obj.book_img}`);

        let content = document.createElement("div");
        content.setAttribute("class", "content");

        let title = document.createElement("p");
        title.setAttribute("class", "text-truncate title");
        title.style.width = "50%";
        title.innerHTML = `${obj.book_title}`;
        let author = document.createElement("p");
        author.setAttribute("class", "author");
        author.innerHTML = `${obj.author_name} , ${obj.book_publication_year}`;
        let rate = document.createElement("p");
        rate.setAttribute("class", "rate");
        if (obj.rating > 1) {
          obj.rating = obj.rating + "/5";
        } else {
          obj.rating = "No Rating Exists!";
        }
        rate.innerHTML = `${obj.rating}`;

        let content2 = document.createElement("div");
        content2.setAttribute("class", "content2");

        let borrow = document.createElement("p");
        borrow.setAttribute("class", "borrow");
        borrow.innerHTML = `Borrowed on`;
        let bordate = document.createElement("p");
        bordate.setAttribute("class", "bordate");
        let borrowdate = new Date(obj.borrow_date).toLocaleDateString();
        bordate.innerHTML = `${borrowdate}`;
        let submission = document.createElement("p");
        submission.setAttribute("class", "submission");
        submission.innerHTML = `submission date`;
        let subdate = document.createElement("p");
        subdate.setAttribute("class", "subdate");

        let submissiondate = new Date(obj.borrow_date);
        submissiondate.setDate(submissiondate.getDate() + 10);
        let finalsubdate = submissiondate.toLocaleDateString();

        subdate.innerHTML = `${finalsubdate}`;

        let span = document.createElement("span");
        span.innerHTML = `(Over Due)`;

        let borbtn = document.createElement("div");
        borbtn.setAttribute("class", "borbtn");

        let borp = document.createElement("p");
        borp.setAttribute("id", "borp");
        borp.innerHTML = `Borrowed`;

        let retbtn = document.createElement("div");
        retbtn.setAttribute("class", "retbtn");

        let retp = document.createElement("p");
        retp.setAttribute("id", "retp");
        if (submissiondate < today && obj.status == "pending") {
          retp.innerHTML = `Return`;
        } else {
          retp.innerHTML = `Returned`;
          retp.style.color = "green";
          retbtn.style.border = "1px solid green";
        }

        content.appendChild(title);
        content.appendChild(author);
        content.appendChild(rate);

        borbtn.appendChild(borp);
        retbtn.appendChild(retp);

        content2.appendChild(borrow);
        content2.appendChild(bordate);
        content2.appendChild(submission);

        if (submissiondate < today && obj.status == "pending") {
          subdate.appendChild(span);
        }
        content2.appendChild(subdate);
        content2.appendChild(borbtn);
        content2.appendChild(retbtn);

        colunder.appendChild(img);
        colunder.appendChild(content);
        colunder.appendChild(content2);
        col.appendChild(colunder);
        row.appendChild(col);

        // let rowrem = document.querySelector(".product_container_two");
        let pendingdata = "";
        // =============pending books================
        
        if (submissiondate < today && obj.status == "pending") {
          flag=1;
          pendingdata +=
            `<div class="product-card-wrap-two"><div class="card-wrap"><img src="` +
            obj.book_img +
            `" /> <div class="contentrem"><p class="text-truncate titlerem">` +
            obj.book_title +
            `</p><p class="authorrem">` +
            obj.author_name +
            `,` +
            obj.book_publication_year +
            `</p><p class="raterem">` +
            obj.rating +
            `</p> </div><p class="borrodt">Borrowed Date : ` +
            borrowdate +
            `</p><p class="subdt">Submission Date :` +
            finalsubdate +
            `</p></div></div>`;
        }
        rowrem.innerHTML += pendingdata;
      });
      if(flag==0){
        rowrem.innerHTML = `<p class="nulldata">No Data Found!!</p>`;
      }
    }
  }

  async function fetchwatchlistbooks() {
    let res = await fetchdataresult();

    const data = userresult.watchlist.map((t1) => ({
      ...t1,
      ...res.bookall.find((t2) => t2.prime_book_id === t1.prime_book_id),
    }));
    const finallist = data.map((t1) => ({
      ...t1,
      ...res.rating.find((t2) => t2.prime_book_id === t1.prime_book_id),
    }));
    const watchrow = document.querySelector(".product_container_three");
    let watchlistbookdata = "";
    if (finallist.length == 0) {
      document.getElementById("export").style.visibility = "hidden";
      let showwatchnull = document.createElement("p");
      showwatchnull.setAttribute("class", "nulldata");
      showwatchnull.innerHTML = `No Data Found!!`;

      watchrow.appendChild(showwatchnull);
    } else {
      finallist.forEach((obj) => {
        if (obj.rating > 1) {
          obj.rating = obj.rating + " / 5";
        } else {
          obj.rating = "No Rating Exists!";
        }
        watchlistbookdata +=
          `<div class="product-card-wrap-two"><div class="card-wrap"><img src="` +
          obj.book_img +
          `" /><div class="contentrem"><p class="text-truncate titlerem" >` +
          obj.book_title +
          `</p><p class="authorrem">` +
          obj.author_name +
          `,` +
          obj.book_publication_year +
          `</p><p class="raterem">` +
          obj.rating +
          `</p></div><div class="lastbtn"><p class="remove" onClick="removebook(` +
          obj.prime_book_id +
          `,` +
          id +
          `)">Remove</p></div></div></div>`;
      });
      watchrow.innerHTML = watchlistbookdata;
    }
    let exportpdf = document.getElementById("export");
    exportpdf.addEventListener("click", async function () {
      let responsepdf = await fetch("/exp", {
        method: "POST",
        body: JSON.stringify({ finallist }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const fileName = `Your_Watchlist_${finallist[0].reader_id}.pdf`;
      exportpdf.href = `/DOWNLOADS/${fileName}`;
      exportpdf.download = "Your Watchlist";
    });
  }
  fetchuserbooks();
  fetchwatchlistbooks();
}
const removebook = async (prime_book_id, user_id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to Remove your Book from Watchlist",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let response = await fetch(
        `${location.origin}/rmvwatchlist/${prime_book_id}/${user_id}`,
        {
          method: "post",
        }
      );
      let resultfinal2 = await response.json();

      if (resultfinal2 == "isdeleted true") {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Removed Succesfully",
          showConfirmButton: false,
          timer: 1300,
        });
        myFunction();
      }
    }
  });
};

function myFunction() {
  timeout = setTimeout(alertFunc, 1800);
}
function alertFunc() {
  location.reload();
}

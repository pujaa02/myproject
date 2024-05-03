let slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("quoteframe");
  let dots = document.getElementsByClassName("one");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
async function myfun(id) {
  async function fetchrating() {
    let url = await fetch(`${location.origin}/fetchdata`);
    let res = await url.json();
    const recommendeddata = res.rating.map((t1) => ({
      ...t1,
      ...res.bookall.find((t2) => t2.prime_book_id === t1.prime_book_id),
    }));

    let recommendedbooks = document.getElementById("recommendedbooks");
    let recomdata = "";
    recommendeddata.forEach((obj) => {
      recomdata +=`<div class="frame" onClick="window.location.href='/book_in_detail/?book_id=` +obj.prime_book_id + `'"><img src="` + obj.book_img +`" />
              <div class="framecontent"> <p class="text-truncate framecontentp1">` + obj.book_title +`</p> <p class="framecontentp2">` + obj.author_name +
               `,` + obj.book_publication_year +`</p> <p class="framecontentp3">` + obj.rating + ` /5</p></div></div>`;
    });
    recommendedbooks.innerHTML = recomdata;
  }
  async function fetchnewarrival() {
    let url = await fetch(`${location.origin}/fetchdata`);
    let res = await url.json();
    const newarrivalresult = res.findnewarrival;
    let rightsidenewarrival = document.getElementById("rightsidenewarrival");

    let newarrivaldata = "";
    newarrivalresult.forEach((obj) => {
     newarrivaldata +=`<div class="rightsideframe" onClick="window.location.href='/book_in_detail/?book_id=` +obj.prime_book_id +`'"><img src="` +obj.book_img +`" /></div>`;
    });
    rightsidenewarrival.innerHTML = newarrivaldata;
  }
  async function fetchrecentreading() {
    // recentreading
    let url = await fetch(`${location.origin}/fetchdata`);
    let res = await url.json();
    // filtering unique data
    const filterdataofrecent = res.findrecentreading.filter(
      (value, index, self) => {
        return (
          self.findIndex((v) => v.prime_book_id === value.prime_book_id) ===
          index
        );
      }
    );

    // mapping of two query result
    const maprecentdata = filterdataofrecent.map((t1) => ({
      ...t1,
      ...res.bookall.find((t2) => t2.prime_book_id === t1.prime_book_id),
    }));

    const recentdata = maprecentdata.map((t1) => ({
      ...t1,
      ...res.rating.find((t2) => t2.prime_book_id === t1.prime_book_id),
    }));

    let recentbooks = document.getElementById("recentbooks");
    let recentbookdata = "";
    recentdata.forEach((obj) => {
      // console.log(obj);
      if (obj.rating >= 1) {
        obj.rating = obj.rating + "/5";
      } else {
        obj.rating = "No Rating Exists!";
      }
      recentbookdata +=`<div class="frameofrecent" onClick="window.location.href='/book_in_detail/?book_id=` +obj.prime_book_id + `'"><img src="` +
       obj.book_img +`" /><div class="framecontent"><p class="text-truncate framecontentp1">` +obj.book_title + `</p><p class="framecontentp2">` +
        obj.author_name + `,` +obj.book_publication_year +`</p> <p class="framecontentp3">` +obj.rating +`</p> </div></div>`;
    });
    recentbooks.innerHTML = recentbookdata;
  }
  async function allcategory() {
    let url = await fetch(`${location.origin}/fetchdata`);
    let res = await url.json();
    const categoryresult = res.bookall;
    const genres = res.genres;

    const ratingresult = res.rating;

    let ratingfilter = ratingresult.filter((value, index, self) => {
      return (
        self.findIndex((v) => v.prime_book_id === value.prime_book_id) === index
      );
    });

    const finalresultdata = categoryresult.map((t1) => ({
      ...t1,
      ...ratingfilter.find((t2) => t2.prime_book_id === t1.prime_book_id),
    }));
    let container = document.getElementById("container");

    genres.forEach((obj) => {
      let categoryname = document.createElement("div");
      categoryname.setAttribute("class", "categoryname");
      let categorynamep = document.createElement("p");
      categorynamep.innerHTML = `${obj.genre_name}`;

      let genre_name = `${obj.genre_name}`;

      const finalbookcategorywise = finalresultdata.filter(function (el) {
        return el.genre_name === genre_name;
      });
      categoryname.appendChild(categorynamep);
      container.appendChild(categoryname);

      let categoryrow = document.createElement("div");
      categoryrow.setAttribute("class", "categoryrow");

      if (finalbookcategorywise.length == 0) {
        categorynamep.innerHTML = ``;
      } else {
        finalbookcategorywise.forEach((obj) => {
          let categorycol = document.createElement("div");
          categorycol.setAttribute("class", "categorycol");
          categorycol.setAttribute(
            "onclick",
            `window.location.href="/book_in_detail/?book_id=${obj.prime_book_id}"`
          );

          let cateimg = document.createElement("img");
          cateimg.setAttribute("src", `${obj.book_img}`);
          categorycol.appendChild(cateimg);

          let framecontent = document.createElement("div");
          framecontent.setAttribute("class", "framecontent");
          let p1 = document.createElement("p");
          p1.setAttribute("class", "text-truncate framecontentp1");
          p1.innerHTML = `${obj.book_title}`;
          let p2 = document.createElement("p");
          p2.setAttribute("class", "framecontentp2");
          p2.innerHTML = `${obj.author_name} , ${obj.book_publication_year}`;
          let p3 = document.createElement("p");
          p3.setAttribute("class", "framecontentp3");
          if (obj.rating > 1) {
            obj.rating = obj.rating + "/5";
          } else {
            obj.rating = "No Rating Exists!";
          }
          p3.innerHTML = `${obj.rating}`;
          framecontent.appendChild(p1);
          framecontent.appendChild(p2);
          framecontent.appendChild(p3);
          categorycol.appendChild(framecontent);

          categoryrow.appendChild(categorycol);
          container.appendChild(categoryrow);
        });
      }
    });
  }
  fetchrating();
  fetchnewarrival();
  fetchrecentreading();
  allcategory();
}

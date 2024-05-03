let sortElementup = document.getElementById('sortup');
console.log(sortElementup);
let sortElementDown = document.getElementById('sortdown');
console.log(sortElementDown);
let order = 'asc';
let field = 'book_title';
if (sortElementup != null) {
    console.log('up');
    order = 'asc';
    field = sortElementup.parentElement.id;
}
if (sortElementDown != null) {
    console.log('down');
    order = 'desc';
    field = sortElementDown.parentElement.id;
}
console.log("order " + order);
console.log("field " + field);
const showAllBookList = async (id, field, order) => {
    let data = await fetch(`${location.origin}/showAllBooklist?id=${id}&field=${field}&order=${order}`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let result = await data.json();
    return result;
}

const displayFirstBook = async (id) => {
    console.log("display first");
    document.getElementById("booklist").innerHTML = "";
    let result = await showAllBookList(id, field, order);
    console.log(result);
    let limit = 6;
    let total = result[0].length;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = 1;
    let pageid = 1;
    let startIdx = (pageid - 1) * limit;
    console.log("startIdx " + startIdx);
    console.log("limit" + limit);
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = `<tr>
        <th scope="row">
          ${pageid + i}
        </th>
        <td>
            ${result[0][i].book_title}
        </td>
        <td>
            ${result[0][i].author_name}
        </td>
        <td>
            ${result[0][i].genre_name}
        </td>
        <td>
            ${result[0][i].borrow_date}
        </td>
        <td>`;
        if (result[0][i].return_date == null) {
            txt += `Pending`;
        } else {
            txt += `${result[0][i].return_date}`;
        }
        txt += `</td>
        <td><button type="button" class="ubtn"><a class="text-light"
                    href="/bookDetail?reader_id=${result[0][i].reader_id}&book_id=${result[0][i].book_id}">Detail</a></button>
        </td>
    </tr>`;
        document.getElementById("booklist").innerHTML += txt;
    }
}
const displayLastBook = async (id) => {
    console.log("display last");
    document.getElementById("booklist").innerHTML = "";
    let result = await showAllBookList(id, field, order);
    console.log(result);
    let total = result[0].length;
    let limit = 6;
    let pages = Math.ceil(total / limit);
    console.log("pages " + pages);

    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = pages;
    let pageid = pages;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = `<tr>
        <th scope="row">
          ${pageid + i}
        </th>
        <td>
            ${result[0][i].book_title}
        </td>
        <td>
            ${result[0][i].author_name}
        </td>
        <td>
            ${result[0][i].genre_name}
        </td>
        <td>
            ${result[0][i].borrow_date}
        </td>
        <td>`;
        if (result[0][i].return_date == null) {
            txt += `Pending`;
        } else {
            txt += `${result[0][i].return_date}`;
        }
        txt += `</td>
        <td><button type="button" class="ubtn"><a class="text-light"
                    href="/bookDetail?reader_id=${result[0][i].reader_id}&book_id=${result[0][i].book_id}">Detail</a></button>
        </td>
    </tr>`;
        document.getElementById("booklist").innerHTML += txt;
    }
}
const prevBook = async (id) => {
    console.log("prev");
    let result = await showAllBookList(id, field, order);
    let total = result[0].length;
    let limit = 6;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML > 1) {
        document.getElementById("booklist").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) - 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = `<tr>
            <th scope="row">
              ${pageid + i}
            </th>
            <td>
                ${result[0][i].book_title}
            </td>
            <td>
                ${result[0][i].author_name}
            </td>
            <td>
                ${result[0][i].genre_name}
            </td>
            <td>
                ${result[0][i].borrow_date}
            </td>
            <td>`;
            if (result[0][i].return_date == null) {
                txt += `Pending`;
            } else {
                txt += `${result[0][i].return_date}`;
            }
            txt += `</td>
            <td><button type="button" class="ubtn"><a class="text-light"
                        href="/bookDetail?reader_id=${result[0][i].reader_id}&book_id=${result[0][i].book_id}">Detail</a></button>
            </td>
        </tr>`;
            document.getElementById("booklist").innerHTML += txt;
        }
    }
}
const nextBook = async (id) => {
    console.log("next");
    let result = await showAllBookList(id, field, order);
    let total = result[0].length;
    console.log("total " + total);
    console.log(result[0]);
    let limit = 6;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML < pages) {
        document.getElementById("booklist").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) + 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = `<tr>
            <th scope="row">
              ${pageid + i}
            </th>
            <td>
                ${result[0][i].book_title}
            </td>
            <td>
                ${result[0][i].author_name}
            </td>
            <td>
                ${result[0][i].genre_name}
            </td>
            <td>
                ${result[0][i].borrow_date}
            </td>
            <td>`;
            if (result[0][i].return_date == null) {
                txt += `Pending`;
            } else {
                txt += `${result[0][i].return_date}`;
            }
            txt += `</td>
            <td><button type="button" class="ubtn"><a class="text-light"
                        href="/bookDetail?reader_id=${result[0][i].reader_id}&book_id=${result[0][i].book_id}">Detail</a></button>
            </td>
        </tr>`;
            document.getElementById("booklist").innerHTML += txt;
        }
    }
}
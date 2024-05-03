
let sortWatchElementup = document.getElementById('sortwatchup');
console.log(sortWatchElementup);
let sortWatchElementDown = document.getElementById('sortwatchdown');
console.log(sortWatchElementDown);
let watchOrder = '';
let watchField = '';
if (sortWatchElementup != null) {
    watchOrder = 'asc';
    watchField = sortWatchElementup.parentElement.id;
}
if (sortWatchElementDown != null) {
    watchOrder = 'desc';
    watchField = sortWatchElementDown.parentElement.id;
}
console.log("watchOrder " + watchOrder);
console.log("watchField " + watchField);

const showWatchList = async (id, watchOrder, watchField) => {
    let data = await fetch(`${location.origin}/showAllWatchlist?id=${id}&order=${watchOrder}&field=${watchField}`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let result = await data.json();
    return result;
}

const displayFirstWatch = async (id) => {
    console.log("id: " + id);

    console.log("display first");
    document.getElementById("watchlist").innerHTML = "";
    let result = await showWatchList(id, watchOrder, watchField);
    console.log("watchlist result");
    console.log(result.length);
    let limit = 6;
    let total = result[0].length;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = 1;
    let pageid = 1;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = `<tr>
        <th scope="row">
            ${pageid + i}
        </th>
        <td> <img height="40px" width="40px" src="./${result[0][i].book_img}" /></td>
        <td>
            ${result[0][i].book_title}
        </td>
        <td>
        ${result[0][i].author_name}
        </td>
        `;

        txt += `<td>
                    <p onclick="deleteFromFav(${result[0][i].watchlist_id})"
                        class=" ubtn text-center text-light">
                        Delete</p>
                </td>
    </tr>`;
        document.getElementById("watchlist").innerHTML += txt;
    }
}
const displayLastWatch = async (id) => {
    console.log("display last");
    document.getElementById("watchlist").innerHTML = "";
    let result = await showWatchList(id, watchOrder, watchField);
    let total = result[0].length;
    let limit = 6;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = pages;
    let pageid = pages;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = `<tr>
        <th scope="row">
            ${pageid + i}
        </th>
        <td> <img height="40px" width="40px" src="./${result[0][i].book_img}" /></td>
        <td>
            ${result[0][i].book_title}
        </td>
        <td>
        ${result[0][i].author_name}
        </td>
        `;

        txt += `<td>
                    <p onclick="deleteFromFav(${result[0][i].watchlist_id})"
                        class=" ubtn text-center text-light">
                        Delete</p>
                </td>
    </tr>`;
        document.getElementById("watchlist").innerHTML += txt;
    }
}
const prevWatch = async (id) => {
    console.log("prev");
    let result = await showWatchList(id, watchOrder, watchField);
    let total = result[0].length;
    let limit = 6;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML > 1) {
        document.getElementById("watchlist").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) - 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = `<tr>
            <th scope="row">
                ${pageid + i}
            </th>
            <td> <img height="40px" width="40px" src="./${result[0][i].book_img}" /></td>
            <td>
                ${result[0][i].book_title}
            </td>
            <td>
            ${result[0][i].author_name}
            </td>
            `;

            txt += `<td>
                        <p onclick="deleteFromFav(${result[0][i].watchlist_id})"
                            class=" ubtn text-center text-light">
                            Delete</p>
                    </td>
        </tr>`;
            document.getElementById("watchlist").innerHTML += txt;
        }
    }
}
const nextWatch = async (id) => {
    console.log("next");
    let result = await showWatchList(id, watchOrder, watchField);
    console.log(result);
    let total = result[0].length;
    let limit = 6;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML < pages) {
        document.getElementById("watchlist").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) + 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = `<tr>
            <th scope="row">
                ${pageid + i}
            </th>
            <td>
            <img height="40px" width="40px" src="./${result[0][i].book_img}" />
            </td>
            <td>
                ${result[0][i].book_title}
            </td>
            <td>
            ${result[0][i].author_name}
            </td>
            `;
            txt += `<td>
                        <p onclick="deleteFromFav(${result[0][i].watchlist_id})"
                            class=" ubtn text-center text-light">
                            Delete</p>
                    </td>
        </tr>`;
            document.getElementById("watchlist").innerHTML += txt;
        }
    }
}





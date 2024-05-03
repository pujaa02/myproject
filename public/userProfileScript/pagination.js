

const pagination = async (id,) => {
    let data = await fetch(`${location.origin}/showAllComments?id=${id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let result = await data.json();
    return result;
}

const displayFirst = async (id) => {
    console.log("display first");
    document.getElementById("comments").innerHTML = "";
    let result = await pagination(id);
    let limit = 5;
    let total = result.length;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = 1;
    let pageid = 1;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = ` <div class="pl-5">
        <b>
            @${result[i].u_fname}  ${result[i].u_lname}
        </b>
        <p>
            ${result[i].nested_comment}
        </p>
    </div>`;
        document.getElementById("comments").innerHTML += txt;
    }
}
const displayLast = async (id) => {
    console.log("display last");
    document.getElementById("comments").innerHTML = "";
    let result = await pagination(id);
    let total = result.length;
    let limit = 5;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = pages;
    let pageid = pages;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = ` <div class="pl-5">
        <b>
            @${result[i].u_fname}  ${result[i].u_lname}
        </b>
        <p>
            ${result[i].nested_comment}
        </p>
    </div>`;
        document.getElementById("comments").innerHTML += txt;
    }
}
const prev = async (id) => {
    console.log("prev");
    let result = await pagination(id);
    let total = result.length;
    let limit = 5;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML > 1) {
        document.getElementById("comments").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) - 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = ` <div class="pl-5">
        <b>
            @${result[i].u_fname}  ${result[i].u_lname}
        </b>
        <p>
            ${result[i].nested_comment}
        </p>
    </div>`;
            document.getElementById("comments").innerHTML += txt;
        }
    }
}
const next = async (id) => {
    console.log("next");
    let result = await pagination(id);
    let total = result.length;
    let limit = 5;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML < pages) {
        document.getElementById("comments").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) + 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = ` <div class="pl-5">
            <b>
                @${result[i].u_fname}  ${result[i].u_lname}
            </b>
            <p>
                ${result[i].nested_comment}
            </p>
        </div>`;
            document.getElementById("comments").innerHTML += txt;
        }
    }
}





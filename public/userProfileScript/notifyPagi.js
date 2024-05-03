

const showAllNotification = async (id) => {
    let data = await fetch(`${location.origin}/showAllNotification?id=${id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let result = await data.json();
    return result;
}

const showAllNotiBySearch = async (id, search_text) => {
    let data = await fetch(`${location.origin}/showAllNotiBySearch?id=${id}&search_text=${search_text}`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let result = await data.json();
    return result;
}
const displayFirstNoti = async (id) => {
    console.log("display first");
    document.getElementById("cards").innerHTML = "";
    let result = await showAllNotification(id);
    console.log(result);
    let limit = 2;
    let total = result.length;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = 1;
    let pageid = 1;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = `
            <div class="card">
                <div class="card-body">
                    <p>
                    <p class="float-right" onclick="deleteNotification(${result[i].notify_id})">
                        <img width="30" height="30"
                        src="./userProfileScript/icons/bxs-x-circle.svg" />
                    </p>
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
                    </p>`

        if (result[i].isSeen == 1) {
            txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
        } else {
            txt += `<img onclick="seenMsg(${result[i].notify_id}, this)"
                                src="./userProfileScript/icons/simpleCheck.svg" />`
        }

        txt += `</div>
            </div>`;
        document.getElementById("cards").innerHTML += txt;
    }
}

const displayLastNoti = async (id) => {
    console.log("display last");
    document.getElementById("cards").innerHTML = "";
    let result = await showAllNotification(id);
    let total = result.length;
    let limit = 2;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = pages;
    let pageid = pages;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = `
            <div class="card">
                <div class="card-body">
                    <p>
                    <p class="float-right" onclick="deleteNotification(${result[i].notify_id})">
                        <img width="30" height="30"
                        src="./userProfileScript/icons/bxs-x-circle.svg" />
                    </p>
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
                    </p>`

        if (result[i].isSeen == 1) {
            txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
        } else {
            txt += `<img onclick="seenMsg(${result[i].notify_id}, this)"
                                src="./userProfileScript/icons/simpleCheck.svg" />`
        }

        txt += `</div>
            </div>`;
        document.getElementById("cards").innerHTML += txt;
    }
}
const prevNoti = async (id) => {
    console.log("prev");
    let result = await showAllNotification(id);
    let total = result.length;
    let limit = 2;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML > 1) {
        document.getElementById("cards").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) - 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = `
                <div class="card">
                    <div class="card-body">
                        <p>
                        <p class="float-right" onclick="deleteNotification(${result[i].notify_id})">
                            <img width="30" height="30"
                            src="./userProfileScript/icons/bxs-x-circle.svg" />
                        </p>
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
                        </p>`

            if (result[i].isSeen == 1) {
                txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
            } else {
                txt += `<img onclick="seenMsg(${result[i].notify_id}, this)"
                                    src="./userProfileScript/icons/simpleCheck.svg" />`
            }

            txt += `</div>
                </div>`;
            document.getElementById("cards").innerHTML += txt;
        }
    }
}
const nextNoti = async (id) => {
    console.log("next");
    let result = await showAllNotification(id);
    let total = result.length;
    let limit = 2;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML < pages) {
        document.getElementById("cards").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) + 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = `
                <div class="card">
                    <div class="card-body">
                        <p>
                        <p class="float-right" onclick="deleteNotification(${result[i].notify_id})">
                            <img width="30" height="30"
                            src="./userProfileScript/icons/bxs-x-circle.svg" />
                        </p>
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
                        </p>`

            if (result[i].isSeen == 1) {
                txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
            } else {
                txt += `<img onclick="seenMsg(${result[i].notify_id}, this)"
                                    src="./userProfileScript/icons/simpleCheck.svg" />`
            }

            txt += `</div>
                </div>`;
            document.getElementById("cards").innerHTML += txt;
        }
    }
}


const displayFirstNotiS = async (id, search_text) => {
    console.log("display first");
    document.getElementById("cards").innerHTML = "";
    let myresult = await showAllNotiBySearch(id, search_text);
    let result = myresult.result;
    console.log(result);
    let limit = 2;
    let total = result.length;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = 1;
    let pageid = 1;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = `
            <div class="card">
                <div class="card-body">
                    <p>
                    <p class="float-right" onclick="deleteNotification(${result[i].notify_id})">
                        <img width="30" height="30"
                        src="./userProfileScript/icons/bxs-x-circle.svg" />
                    </p>
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
                    </p>`

        if (result[i].isSeen == 1) {
            txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
        } else {
            txt += `<img onclick="seenMsg(${result[i].notify_id}, this)"
                                src="./userProfileScript/icons/simpleCheck.svg" />`
        }

        txt += `</div>
            </div>`;
        document.getElementById("cards").innerHTML += txt;
    }
}

const displayLastNotiS = async (id, search_text) => {
    console.log("display last");
    document.getElementById("cards").innerHTML = "";
    let myresult = await showAllNotiBySearch(id, search_text);
    let result = myresult.result;
    let total = result.length;
    let limit = 2;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = pages;
    let pageid = pages;
    let startIdx = (pageid - 1) * limit;
    for (let i = startIdx; i < startIdx + limit; i++) {
        let txt = `
            <div class="card">
                <div class="card-body">
                    <p>
                    <p class="float-right" onclick="deleteNotification(${result[i].notify_id})">
                        <img width="30" height="30"
                        src="./userProfileScript/icons/bxs-x-circle.svg" />
                    </p>
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
                    </p>`

        if (result[i].isSeen == 1) {
            txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
        } else {
            txt += `<img onclick="seenMsg(${result[i].notify_id}, this)"
                                src="./userProfileScript/icons/simpleCheck.svg" />`
        }

        txt += `</div>
            </div>`;
        document.getElementById("cards").innerHTML += txt;
    }
}

const nextNotiS = async (id, search_text) => {
    console.log("next");
    let myresult = await showAllNotiBySearch(id, search_text);
    let result = myresult.result;
    let total = result.length;
    let limit = 2;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML < pages) {
        document.getElementById("cards").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) + 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = `
                <div class="card">
                    <div class="card-body">
                        <p>
                        <p class="float-right" onclick="deleteNotification(${result[i].notify_id})">
                            <img width="30" height="30"
                            src="./userProfileScript/icons/bxs-x-circle.svg" />
                        </p>
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
                        </p>`

            if (result[i].isSeen == 1) {
                txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
            } else {
                txt += `<img onclick="seenMsg(${result[i].notify_id}, this)"
                                    src="./userProfileScript/icons/simpleCheck.svg" />`
            }

            txt += `</div>
                </div>`;
            document.getElementById("cards").innerHTML += txt;
        }
    }
}

const prevNotiS = async (id, search_text) => {
    console.log("prev");
    let myresult = await showAllNotiBySearch(id, search_text);
    let result = myresult.result;
    let total = result.length;
    let limit = 2;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML > 1) {
        document.getElementById("cards").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) - 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        for (let i = startIdx; i < startIdx + limit; i++) {
            let txt = `
                <div class="card">
                    <div class="card-body">
                        <p>
                        <p class="float-right" onclick="deleteNotification(${result[i].notify_id})">
                            <img width="30" height="30"
                            src="./userProfileScript/icons/bxs-x-circle.svg" />
                        </p>
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
                        </p>`

            if (result[i].isSeen == 1) {
                txt += `<img src="./userProfileScript/icons/greenCheck.svg" />`;
            } else {
                txt += `<img onclick="seenMsg(${result[i].notify_id}, this)"
                                    src="./userProfileScript/icons/simpleCheck.svg" />`
            }

            txt += `</div>
                </div>`;
            document.getElementById("cards").innerHTML += txt;
        }
    }
}
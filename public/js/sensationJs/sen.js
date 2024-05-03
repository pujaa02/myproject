console.log("heelo");

const socket = io();
const fetchSensationRev = async () => {
    let data = await fetch(`${location.origin}/admin/showSenReview`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let res = await data.json();

    console.log(res.result.length);
    if (res.length != 0) {
        let i = 1;
        let txt = "";
        if (res.result.length <= 6) {
            res.result.forEach((element) => {
                txt += `<tr>
                <td>${i}</td>
                <td>${element.sensation_id}</td>
                <td>${element.sensation_title}</td>
                <td>${element.sensation_desc}</td>
                <td>
                <p class="btn btn-danger rounded p-2" onclick="deleteSen(${element.sensation_id})">Delete</p>
               </td>
                <td>
                 <p class="btn btn-primary rounded p-2" onclick="showLikes(${element.sensation_id})">likes</p>
                </td>
               <td >
                <p class="btn btn-primary rounded p-2" onclick="showComments(${element.sensation_id})">comments</p>
               </td>
               </tr>`;
                i++;
            });
            document.getElementById("data").innerHTML = txt;
        }
        else {
            let txt = "";
            for (let i = 0; i < 6; i++) {
                txt += `<tr>
            <td>${i + 1}</td>
            <td>${res.result[i].sensation_id}</td>
            <td>${res.result[i].sensation_title}</td>
            <td>${res.result[i].sensation_desc}</td>
            <td>
            <p class="btn btn-danger rounded p-2" onclick="deleteSen(${res.result[i].sensation_id})">Delete</p>
           </td>
            <td>
             <p class="btn btn-primary rounded p-2" onclick="showLikes(${res.result[i].sensation_id})">likes</p>
            </td>
           <td >
            <p class="btn btn-primary rounded p-2" onclick="showComments(${res.result[i].sensation_id})">comments</p>
           </td>
           </tr>`;
            }
            document.getElementById("data").innerHTML = txt;
            let pagi = ` <nav aria-label="Page navigation example" class="float-left">
        <ul class="pagination">
            <li class="page-item">
                <p aria-label="Previous" onclick="displayFirst()"
                    class="page-link">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </p>
            </li>
            <li class="page-item">
                <p onclick="prev()" class="page-link">
                    < </p>
            </li>
            <li class="page-item">
                <p id="pageNo" class="page-link">1</p>
            </li>
            <li class="page-item">
                <p onclick="next()" class="page-link">>
                </p>
            </li>
            <li class="page-item">
                <p onclick="displayLast()" aria-label="Next"
                    class="page-link">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </p>
            </li>
        </ul>
    </nav>`;
            document.getElementById("pagi").innerHTML = pagi;
        }
    }
}


const pagination = async () => {
    let data = await fetch(`${location.origin}/admin/showSenReview`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let result = await data.json();
    return result;
}

const displayFirst = async () => {
    document.getElementById("data").innerHTML = "";
    let res = await pagination();
    let limit = 6;
    let total = res.result.length;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = 1;
    let pageid = 1;
    let startIdx = (pageid - 1) * limit;
    let txt = "";
    for (let i = startIdx; i < startIdx + limit; i++) {
        txt += `<tr>
        <td>${i + 1}</td>
        <td>${res.result[i].sensation_id}</td>
        <td>${res.result[i].sensation_title}</td>
        <td>${res.result[i].sensation_desc}</td>
        <td>
        <p class="btn btn-danger rounded p-2" onclick="deleteSen(${res.result[i].sensation_id})">Delete</p>
       </td>
        <td>
         <p class="btn btn-primary rounded p-2" onclick="showLikes(${res.result[i].sensation_id})">likes</p>
        </td>
       <td >
        <p class="btn btn-primary rounded p-2" onclick="showComments(${res.result[i].sensation_id})">comments</p>
       </td>
       </tr>`;
        document.getElementById("data").innerHTML = txt;
    }

}
const displayLast = async () => {
    document.getElementById("data").innerHTML = "";
    let res = await pagination();
    let total = res.result.length;
    let limit = 6;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    pageNo.innerHTML = pages;
    let pageid = pages;
    let startIdx = (pageid - 1) * limit;
    let txt = "";
    for (let i = startIdx; i < startIdx + limit; i++) {
        txt += `<tr>
        <td>${i + 1}</td>
        <td>${res.result[i].sensation_id}</td>
        <td>${res.result[i].sensation_title}</td>
        <td>${res.result[i].sensation_desc}</td>
        <td>
        <p class="btn btn-danger rounded p-2" onclick="deleteSen(${res.result[i].sensation_id})">Delete</p>
       </td>
        <td>
         <p class="btn btn-primary rounded p-2" onclick="showLikes(${res.result[i].sensation_id})">likes</p>
        </td>
       <td >
        <p class="btn btn-primary rounded p-2" onclick="showComments(${res.result[i].sensation_id})">comments</p>
       </td>
       </tr>`;
        document.getElementById("data").innerHTML += txt;
    }

}
const prev = async () => {
    let res = await pagination();
    let total = res.result.length;
    let limit = 6;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML > 1) {
        document.getElementById("data").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) - 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        let txt = "";
        for (let i = startIdx; i < startIdx + limit; i++) {
            txt += `<tr>
            <td>${i + 1}</td>
            <td>${res.result[i].sensation_id}</td>
            <td>${res.result[i].sensation_title}</td>
            <td>${res.result[i].sensation_desc}</td>
            <td>
            <p class="btn btn-danger rounded p-2" onclick="deleteSen(${res.result[i].sensation_id})">Delete</p>
           </td>
            <td>
             <p class="btn btn-primary rounded p-2" onclick="showLikes(${res.result[i].sensation_id})">likes</p>
            </td>
           <td >
            <p class="btn btn-primary rounded p-2" onclick="showComments(${res.result[i].sensation_id})">comments</p>
           </td>
           </tr>`;

        }

        document.getElementById("data").innerHTML += txt;

    }
}
const next = async () => {
    let res = await pagination();
    let total = res.result.length;
    let limit = 6;
    let pages = Math.ceil(total / limit);
    let pageNo = document.getElementById('pageNo');
    if (pageNo.innerHTML < pages) {
        document.getElementById("data").innerHTML = "";
        let pageid = parseInt(pageNo.innerHTML) + 1;
        pageNo.innerHTML = pageid;
        let startIdx = (pageid - 1) * limit;
        console.log("startIdx " + startIdx);
        console.log(res.result[6].sensation_id);
        let txt = "";
        for (let i = startIdx; i < startIdx + limit; i++) {
            txt += `<tr>
            <td>${i + 1}</td>
            <td>${res.result[i].sensation_id}</td>
            <td>${res.result[i].sensation_title}</td>
            <td>${res.result[i].sensation_desc}</td>
            <td>
            <p class="btn btn-danger rounded p-2" onclick="deleteSen(${res.result[i].sensation_id})">Delete</p>
           </td>
            <td>
             <p class="btn btn-primary rounded p-2" onclick="showLikes(${res.result[i].sensation_id})">likes</p>
            </td>
           <td >
            <p class="btn btn-primary rounded p-2" onclick="showComments(${res.result[i].sensation_id})">comments</p>
           </td>
           </tr>`;
            document.getElementById("data").innerHTML += txt;
        }

    }
}

const deleteSen = async (sen_id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this sensation",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            let data = await fetch(`${location.origin}/admin/deleteSen?sen_id=${sen_id}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            let res = await data.json();
            if (result) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        }
    });
}

const fetchLikes = async (sen_id) => {
    let data = await fetch(`${location.origin}/admin/showLikes?sen_id=${sen_id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let res = await data.json();
    return res;
}

const showLikes = async (sen_id) => {
    let result = await fetchLikes(sen_id);
    console.log(result);
    if (result.result.length > 0) {
        let table = `
    <div class="text-center h4">${result.result[0].sensation_title}</div>
    <table  id="mytable" class="table table-borderless">
    <thead class="table-dark">
    <tr>
    <th scope="col">Sr</th>
    <th scope="col">User Name</th>
    <th scope="col">User Email</th>
    <th scope="col">Liked At</th>
    </tr>
    </thead>
    <tbody id="data">`;
        let i = 1;
        result.result.forEach((element) => {
            table += `<tr>
    <td>${i}</td>
    <td>${element.u_fname}</td>
    <td>${element.u_email}</td>
    <td>${element.liked_at}</td>
    </tr>`
            i++;
        })
        table += `
</tbody>
</table>
`;
        document.getElementById("table").innerHTML = table;
    }
    else {
        let txt = '<div class="container text-danger text-center mt-5 h4">No user commented on this sensation</div>';
        document.getElementById("table").innerHTML = txt;
    }
}

const fetchComment = async (sen_id) => {
    let data = await fetch(`${location.origin}/admin/showComments?sen_id=${sen_id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    let res = await data.json();
    return res;
}

const showComments = async (sen_id) => {
    let result = await fetchComment(sen_id);
    console.log(result.result);
    if (result.result.length > 0) {
        let table = `
        <div class="text-center h4">${result.result[0].sensation_title}</div>
        <table  id="mytable" class="table table-borderless">
<thead class="table-dark">
<tr>
    <th scope="col">Sr</th>
    <th scope="col">User Name</th>
    <th scope="col">User Email</th>
    <th scope="col">Comment</th>
    <th scope="col">Commented At</th>
</tr>
</thead>
<tbody id="data">`;
        let i = 1;
        result.result.forEach((element) => {
            table += `<tr>
    <td>${i}</td>
    <td>${element.u_fname}</td>
    <td>${element.u_email}</td>
    <td>${element.comment}</td>
    <td>${element.commented_at}</td>
    </tr>`
            i++;
        })
        table += `
</tbody>
</table>
`;
        document.getElementById("table").innerHTML = table;
    }
    else {
        let txt = '<div class="container text-danger text-center mt-5 h4">No user commented on this sensation</div>';
        document.getElementById("table").innerHTML = txt;
    }
}


fetchSensationRev();
socket.on("succAddLike", (event) => {
    fetchSensationRev();
});
socket.on("succAddComment", (event) => {
    fetchSensationRev();
}); 
const submitSensation = async () => {
    let form = document.getElementById("sensationForm");
    let title = form['senTitle'].value;
    let desc = form['senDesc'].value;
    let files = form['eventImgs'].files;

    let isValid = validateForm();
    console.log(isValid);
    if (isValid) {
        let formData = new FormData();
        formData.append('senTitle', title);
        formData.append('senDesc', desc);
        for (const file of files) {
            console.log(file);
            formData.append("eventImgs", file);
        }
        console.log(formData);
        let data = await fetch(`/admin/addsensation`, {
            method: "post",
            body: formData,
        });
        let result = await data.json();
        console.log(result);
        if (result.length != 0) {
            console.log(result.isError);
            if (!result.isError) {
                const socket = io();
                socket.emit("sensation", result.insertId);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Your comment has been saved",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                result.errors.forEach((element) => {
                    let div = document.getElementById(element.path).parentElement;
                    div.getElementsByTagName("span")[0].innerHTML = element.msg;
                });
            }
        }
    }
}



const validateForm = () => {
    let form = document.getElementById("sensationForm");
    let title = form['senTitle'];
    let desc = form['senDesc'];
    let files = form['eventImgs'];
    let titleVal = title.value.trim();
    let descVal = desc.value.trim();
    let imgVal = files.value.trim();

    let titleDiv = title.parentElement;
    let descDiv = desc.parentElement;
    let imgDiv = files.parentElement;
    let isValid = 0;
    if (titleVal == "") {
        titleDiv.getElementsByTagName('span')[0].innerHTML = "please enter event title";
        isValid++;
    }
    else {
        titleDiv.getElementsByTagName('span')[0].innerHTML = "";
    }
    if (descVal == "") {
        descDiv.getElementsByTagName('span')[0].innerHTML = "please enter event description";
        isValid++;
    }
    else {
        descDiv.getElementsByTagName('span')[0].innerHTML = "";
    }

    let fileArr = Array.from(files.files);
    console.log(fileArr);
    console.log(fileArr[0].type);
    const filTypes = /jpeg|jpg|png|gif/;
    if (files.files.length == 0) {
        imgDiv.getElementsByTagName('span')[0].innerHTML = "please enter event image";
        isValid++;
    }
    else {
        imgDiv.getElementsByTagName('span')[0].innerHTML = "";
    }

    fileArr.forEach((file) => {
        if (file.size > 200000) {
            imgDiv.getElementsByTagName('span')[0].innerHTML = "image size should be greater than 200kb";
            isValid++;
        }
        else {
            imgDiv.getElementsByTagName('span')[0].innerHTML = "";
        }
        let type = file.type.split("/")[1];
        if (!filTypes.test(type)) {
            imgDiv.getElementsByTagName('span')[0].innerHTML = "invalide image type";
            isValid++;
        }
        else {
            imgDiv.getElementsByTagName('span')[0].innerHTML = "";
        }

    })

    if (isValid == 0) {
        return true;
    }
    else {
        return false;
    }
}
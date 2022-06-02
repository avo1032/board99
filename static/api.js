function getBoards() {
    $.ajax({
        type: "GET",
        url: `/api/boardslist`,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
        success: function (response) {
            let rows = response["boardslist"]
            let temphtml = ``;
            for (let i = 0; i < rows.length; i++) {
                let id = rows[i]["_id"]
                let title = rows[i]["title"]
                let user = rows[i]["user"]
                let date = rows[i]["date"]

                var dt = new Date(date)
                dt = dt.toLocaleString();
                temphtml = `<li>
                <button
                onclick="location.href='/detail.html?boardsId=${
                id}'"
                    type="button"
                    class="btn btn-outline-primary">${title}</button>
                <h2>${user}</h2>
                <h2>${dt}</h2>
            </li>`;

                $("#boardslist").append(temphtml);
            }

        }
    });
}

function getboardsDetail(boardsId) {
    $.ajax({
        type: "GET", url: `/api/boards/${boardsId}`,
        // headers: {   authorization: `Bearer ${localStorage.getItem("token")}`, },
        success: function (response) {
            
            let board = response["detail"]
            let title = board.title;
            let user = board.user;
            let content = board.content;
            let boardsId = board._id;
            let date = board.date;

            var dt = new Date(date)
            dt = dt.toLocaleString();
            let temphtml = `<li>
            <h1>${title}</h1>
            <h2 id="writer">${user}</h2>
        </li>
        <li>
            <h3>${content}</h3>
        </li>
        `;

            $("#boardslist").append(temphtml);

            let temphtml2 = `<button class="btn btn-outline-primary" onclick="goUpdate(boardsId)">수정 / 삭제</button>
            <button class="btn btn-outline-primary" onclick="location.href='/'">돌아가기</button>
            <h2>${dt}</h2>`

            $("#boardslist2").append(temphtml2);

            let replys = response.replys;
            replys = replys.reverse();
            for(var i=0; i<replys.length; i++){
                let user = replys[i]["user"]
                let comment = replys[i]["comment"]
                let replyId = replys[i]["_id"]
                
                temphtml = `<div class="mybox2" id="'${replyId}'">
                <li>
                    <h2>${comment}</h2>
                    <h2>${user}</h2>
                    
                </li>
                <button onclick="location.href='/replyupdate.html?replyId=${
                    replyId}'">수정</button>
                <button onclick="deleteReply('${replyId}')">삭제</button>
            </div>`;
            $("#replylist").append(temphtml);
            }

        }
    });
}


function deleteReply(replyId) {
    $.ajax({
        type: "DELETE",
        url: `/api/boards/replys/${replyId}`,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
        success: function (response) {
            if (response['result'] == "success") {
                alert('게시글이 삭제되었습니다.');
                location.reload();
                
            } else {
                alert('작성자만 삭제할수있습니다.');
            }
        },
    });
}

function goUpdate(boardsId) {
    $.ajax({
        type: "GET",
        url: `/api/boards/goUpdate/${boardsId}`,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
        success: function (response) {
            console.log(response)
            if (response.isUser) {
                window.location.href = `/boardsupdate.html?boardsId=${response.boardsId}`
            } else {
                alert('작성자만 수정/삭제를 할 수 있습니다.');
            }
        },
        error: function (xhr, status, error) {
            if (status == 401) {
                alert("로그인이 필요합니다.");
            } else {
                localStorage.clear();
                alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
                // alert("로그인이 필요합니다.22")
            }
        }
    });
}


function getboardsUpdateDetail(boardsId) {
    $.ajax({
        type: "GET", url: `/api/boards/${boardsId}`,
        // headers: {   authorization: `Bearer ${localStorage.getItem("token")}`, },
        success: function (response) {
            let board = response["detail"]
            let title = board.title;
            let user = board.user;
            let content = board.content;
            let boardsId = board._id;
            let temphtml = `<div class="mybox">
            <div class="input-group mb-3">
                <input type="text" class="form-control" value="${title}" id="inputTitle">
            </div>
            <p1 style="font-size: 25px;">${user}</p1>
        </div>
        <div class="mybox">
            <div class="form-floating">
                <textarea
                    id="inputContent"
                    class="form-control"
                    placeholder="Leave a comment here"
                    style="height: 300px;">${content}</textarea>
                <label for="floatingTextarea2">내용</label>
            </div>
        </div>
        <div class="mybox">
            <button class="btn btn-outline-primary" onclick="updateBoards(boardsId)">수정하기</button>
            <button class="btn btn-outline-primary" onclick="deleteBoards(boardsId)">삭제하기</button>
            <button class="btn btn-outline-primary" onclick="location.href='/'">돌아가기</button>
        </div>
        `;

            $("#boardsUpdate").append(temphtml);

        }
    });
}

function updateBoards(boardsId) {
    const title = $("#inputTitle").val();
    const content = $("#inputContent").val();
    const password = $("#inputPassword").val();
    $.ajax({
        type: "PATCH", url: `/api/boards/${boardsId}`,
        // headers: {   authorization: `Bearer ${localStorage.getItem("token")}`, },
        data: {
            title,
            content,
            password
        },
        success: function (response) {
            if (response["result"] == "success") {
                alert('게시글이 수정되었습니다.');
                window.location.href = '/'
            } else {
                alert('비밀번호가 틀렸습니다');
            }
        }
    });
}



function deleteBoards(boardsId) {
    const password = $("#inputPassword").val();
    $.ajax({
        type: "DELETE",
        url: `/api/boards/${boardsId}`,
        data: {
            'password': password
        },
        // headers: {   authorization: `Bearer ${localStorage.getItem("token")}`, },

        success: function (response) {
            if (response['result'] == "success") {
                alert('게시글이 삭제되었습니다.');
                window.location.href = '/'
            } else {
                alert('비밀번호가 틀렸습니다');
            }
        },
        error: function (xhr, status, error) {
            console.log(status)
            console.log(xhr)
            console.log(error)
            if (xhr.status == 401) {
                alert("로그인이 필요합니다.");
            } else {
                localStorage.clear();
                // alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
                alert("로그인이 필요합니다22.");
            }
            // window.location.href = "/login.html";
        }
    });
}

function createReply() {
    const comment = $("#inputReply").val();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const boardsId = urlParams.get("boardsId");
    $.ajax({
        type: "POST",
        url: `api/boardsreply`,
        headers: {   authorization: `Bearer ${localStorage.getItem("token")}`, },
        data: {
            'comment': comment,
            'boardsId': boardsId,
        },
        success: function (response) {
            {
                alert(response)
                location.reload();
            };
        },
        error: function (xhr, status, error) {
            console.log(status)
            console.log(xhr)
            console.log(error)
            if (xhr.status == 401) {
                alert("로그인이 필요합니다.");
            } else {
                localStorage.clear();
                // alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
                alert("로그인이 필요합니다22.");
            }
            // window.location.href = "/login.html";
        }
    });
}
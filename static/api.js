function getBoards() {
    $.ajax({
        type: "GET", url: `/api/boardslist`,
        // headers: {   authorization: `Bearer ${localStorage.getItem("token")}`, },
        success: function (response) {
            let rows = response["boardslist"]
            let temphtml = ``;
            for (let i = 0; i < rows.length; i++) {
                let id = rows[i]["_id"]
                let title = rows[i]["title"]
                let user = rows[i]["user"]
                temphtml = `<li>
                <button
                onclick="location.href='/detail.html?boardsId=${
                id}'"
                    type="button"
                    class="btn btn-outline-primary">${title}</button>
                <h2>${user}</h2>
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
            let temphtml = `<li>
            <h1>${title}</h1>
            <h2>${user}</h2>
        </li>
        <li>
            <h3>${content}</h3>
        </li>
        `;

            $("#boardslist").append(temphtml);

            let temphtml2 = `<button class="btn btn-outline-primary" onclick="location.href='/boardsupdate.html?boardsId=${
                boardsId}'">수정</button>
            <button class="btn btn-outline-primary" onclick="deleteBoards(boardsId)">삭제</button>
            <button class="btn btn-outline-primary" onclick="location.href='/'">돌아가기</button>
            <input type="text" class="form-control" placeholder="비밀번호" id="inputPassword" >`
            
            $("#boardslist2").append(temphtml2);

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
            <button class="btn btn-outline-primary" onclick="location.href='/'">돌아가기</button>
        </div>
        `;

            $("#boardsUpdate").append(temphtml);

        }
    });
}

function updateBoards(boardsId){
    const title = $("#inputTitle").val();
    const content = $("#inputContent").val();
    $.ajax({
        type: "PATCH", url: `/api/boards/${boardsId}`,
        // headers: {   authorization: `Bearer ${localStorage.getItem("token")}`, },
        data:{
            title, content
        },
        success: function () {
            alert('게시글이 등록되었습니다.');
            window.location.href ='/'
        }
    });
}

function deleteBoards(boardsId) {
    $.ajax({
        type: "DELETE", url: `/api/boards/${boardsId}`,
        // headers: {   authorization: `Bearer ${localStorage.getItem("token")}`, },
        
        success: function () {
            alert('해당 게시글이 삭제되었습니다.');
            window.location.href ='/'
        }
    });
}
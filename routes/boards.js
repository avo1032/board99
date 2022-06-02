const express = require("express");
const Boards = require("../schemas/boards")
const Users = require("../schemas/user")
const Reply = require("../schemas/reply")
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/boardslist", async (req, res) => {

    const boardslist = await Boards.find().sort({'date':-1});
    // const boardslist = await Boards.find();
    res.json({
        boardslist
    })
})

router.get("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const replys = await Reply.find({boardsId: boardsId});
    // console.log(replys)

    const [detail] = await Boards.find({_id: boardsId});
    res.json({detail, replys})
})

router.get("/boards/goUpdate/:boardsId",authMiddleware, async (req, res) => {
    const { boardsId } = req.params;
    const { userId } = res.locals.user;

    // console.log(boardsId)
    // console.log(userId)

    const [detail] = await Boards.find({_id: boardsId});
    const [detail2] = await Users.find({_id: userId});

    // console.log(detail.user)
    // console.log(detail2.user)

    const isUser = (detail.user === detail2.user);
    res.send({
        isUser, boardsId
    })
})

router.delete("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const { password } = req.body;
    
    const existsBoards = await Boards.find({ _id: boardsId, password: password })
    if(!existsBoards.length){
        res.json({ result: "fail" })
    }else{
        await Boards.deleteOne({ _id: boardsId });
        res.json({ result: "success" });
    }
    
})

router.delete("/boards/replys/:replyId", authMiddleware, async (req, res) => {
    const { replyId } = req.params;
    const { userId } = res.locals.user;
    
    const [detail] = await Reply.find({_id: replyId});
    const [detail2] = await Users.find({_id: userId});

    if(detail.user === detail2.user){
        await Reply.deleteOne({ _id: replyId });
        res.json({ result: "success" });
    }else{
        res.json({ result: "fail" });
    }
    
})

router.patch("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const { title, content, password } = req.body;
    
    const existsBoards = await Boards.find({ _id: boardsId, password: password })

    if(!existsBoards.length){
        res.json({ result: "fail" })
    }else{
        await Boards.updateOne({ _id: boardsId }, { $set: { title, content } });
        res.json({ result: "success" });
    }
})

router.get("/boardswrite", authMiddleware, async (req, res) => {
    const {userId} = res.locals.user;
    const writeId = await Users
        .findOne({_id: userId})
        .exec();
    
    res.send(
        writeId.user
    )
})

router.post("/boardswrite", authMiddleware, async (req, res) =>{
    const { userId } = res.locals.user;
    const writeId = await Users
        .findOne({_id: userId})
        .exec();
    const { title, content } = req.body;

    const createdBoards = await Boards.create({ title: title, user: writeId.user, content: content });
    res.json({ boards: createdBoards });
});

router.post("/boardsreply", authMiddleware, async (req, res) =>{
    const { userId } = res.locals.user;
    const writeId = await Users
        .findOne({_id: userId})
        .exec();
    const { comment, boardsId } = req.body;

    if(comment === ''){
        res.send('댓글을 입력하세요.');
        return;
    }

    const createdReply = await Reply.create({ comment: comment, user: writeId.user, boardsId: boardsId });
    // res.send({ replys: createdReply });
    res.send('댓글이 등록되었습니다.')
});

module.exports = router;
const express = require("express");
const Boards = require("../schemas/boards")
const router = express.Router();

router.get("/boardslist", async (req, res) => {
    const boardslist = await Boards.find();

    res.json({
        boardslist
    })
})

router.get("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;

    const [detail] = await Boards.find({_id: boardsId});
    res.json({
        detail
    })
})

router.delete("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const { password } = req.body;
    
    const existsBoards = await Boards.find({ _id: boardsId, password: password })
    if(!existsBoards.length){
        res.json({ error: true })
    }else{
        await Boards.deleteOne({ _id: boardsId });
        res.send({ result: "success" });
    }
    
})

router.patch("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const { title, content, password } = req.body;
    
    const existsBoards = await Boards.find({ _id: boardsId, password: password })

    if(!existsBoards.length){
        res.json({ error: true })
    }else{
        await Boards.updateOne({ _id: boardsId }, { $set: { title, content } });
        res.send({ result: "success" });
    }
})

router.post("/boardswrite", async (req, res) =>{
    const { title, user, password, content } = req.body;
    console.log(title, user, password, content)
    console.log(req.body)

    // const goods = await Goods.find({ goodsId })
    // if (goods.length){
    //     return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    // }

    const createdBoards = await Boards.create({ title: title, user: user, password: password, content: content });
    res.json({ boards: createdBoards });
    // await Boards.create({ title, user, password, content });
    // res.send({ result: "success" });
});

// router.put("/boards/:boardsId", async (req, res) => {
//     const { boardsId } = req.params;
//     const { title, content } = req.body;


// })


module.exports = router;
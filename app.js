const express = require("express");

const cors = require("cors");
const connect = require("./schemas")          // index.js 는 생략가능함
const app = express();
const bodyParser = require('body-parser');
const port = 3000;


connect();

const boardsRouter = require("./routes/boards");

const requestMiddleware = (req, res, next) =>{
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(express.static("static"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(requestMiddleware);

app.use("/api", [boardsRouter]);

app.get('/', (req,res) => {                 //req객체와 res객체를 넣어준다.
    res.send("Hello World")
});

app.listen(port, () => {
    console.log(port, "포트가 서버가 켜졌어요!");
});
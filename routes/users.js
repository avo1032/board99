const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Boards = require("../schemas/boards")
const Users = require("../schemas/user")
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const postUsersSchema = Joi.object({
    user: Joi
        .string()
        .required(),
    password: Joi
        .string()
        .required(),
    confirmPassword: Joi
        .string()
        .required()
});

const postAuthSchema = Joi.object({
    user: Joi
        .string()
        .required(),
    password: Joi
        .string()
        .required()
});
router.post("/users", async(req, res) => {
    try{
        const {user, password, confirmPassword} = await postUsersSchema.validateAsync(
            req.body
        );

        if(password !== confirmPassword){
            res.status(400).send({errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다."});
            return;
        }

        const existUsers = await Users.find({
            user
        });
        if(existUsers.length){
            res.status(400).send({errorMessage: "이미 가입된 닉네임이 있습니다."});
            return;
        }

        const users = new Users({user, password});
        await users.save();

        res.status(201).send({});
    } catch (err) {
        console.log(err);
        res.status(400).send({errorMessage: "요청한 데이터 형식이 올바르지 않습니다."});
    }
});

router.post("/auth", async (req, res) => {
    try {
        const {user, password} = await postAuthSchema.validateAsync(req.body);

        const loginuser = await Users
            .findOne({user, password})
            .exec();

        if (!loginuser) {
            res
                .status(400)
                .send({errorMessage: "닉네임 또는 패스워드가 잘못됐습니다."});
            return;
        }

        const token = jwt.sign({ userId: loginuser.userId }, "my-secret-key");
        res.send({token});
    } catch (err) {
        console.log(err);
        res
            .status(400)
            .send({errorMessage: "요청한 데이터 형식이 올바르지 않습니다."});
    }
});

module.exports = router;
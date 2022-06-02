const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');


    if(tokenType !== 'Bearer'){
        console.log('1미들웨어에서 걸림')
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }

    try{
        const { userId } = jwt.verify(tokenValue, "my-secret-key");

        User.findById(userId).exec().then((user) =>{
            
            res.locals.user = user;
            console.log('미들웨어 정상적으로지나침')
            next();
        });
    }catch(error){
        console.log('2미들웨어에서 걸림')
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }


};
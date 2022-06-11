import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        let decodedData;
        if(token && isCustomAuth){
            decodedData = jwt.verify(token, 'test'); // returns the decoded payload(the user info which was placed in the token)
            req.userId = decodedData?.id; //population the request 
        }else{
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    }catch(err){
        console.log(err);
    }
};

export default auth;
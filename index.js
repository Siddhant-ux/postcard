import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'; 
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(bodyParser.json({limit: "30mb", extended: true}));
const corsOptions ={
    origin:'https://postcard-mern.netlify.app', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


// app.use(function(req, res, next){
//     res.header("Access-Control-Allow-Origin", "https://postcard-mern.netlify.app");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use('/posts', postRoutes);  //adds a /posts at the end of all the routes in postRoutes
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.send("App is Running");
});
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, () => console.log(`Server started on Port ${PORT}`)))
.catch((err) => console.log(err));


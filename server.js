const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');




const usersRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');


const app = express();


//bodyparser middleware  바디파서쓸라면 그냥 있어야함
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//db config
const db = require('./config/keys').mongoURI;


mongoose.Promise = global.Promise; //
//connect to mongo
mongoose
    .connect(db,{
        useNewUrlParser:true,
        useCreateIndex:true
    }) //adding new mongo url parser
    .then( () => console.log('mongodb connected'))
    .catch(err => console.log('err'));
//connect to mongo end




//user routes  , localhost:3000/api/users 경로면 usersRoutes 안에 지정한 경로로 열림
app.use('/api/users' , usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/post' , postsRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sever running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');



const usersRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');


const app = express();



//user routes  , localhost:3000/api/users 경로면 usersRoutes 안에 지정한 경로로 열림
app.use('/api/users' , usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/post' , postsRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sever running on port ${PORT}`));
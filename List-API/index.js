const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();
let password = "759846Eipk%25"; 

mongoose.connect(`mongodb://ipek:${password}@cluster0-shard-00-00-hlfkl.mongodb.net:27017,cluster0-shard-00-01-hlfkl.mongodb.net:27017,cluster0-shard-00-02-hlfkl.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`,
{ useNewUrlParser: true },
(error)=>{
    if(error)
    {
        console.log(error);
    }
    else
        console.log("Connected")
});



app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute); 

app.listen(4000, () => console.log(`Server Running at port 4000`));


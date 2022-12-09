require("dotenv").config();
const cors = require('cors')
const express = require("express");
const morgan = require("morgan");
const connect = require('./db/connection');
const { notFound, commonErrorHandler } = require("./middleware/errorHandler");
const userAuthRoute = require('./router/userAuthRoute')
const userChatRoute = require('./router/userChatRoute')
const userDetails = require('./router/userDetails')
const app = express();
app.use(cors({
  origin:process.env.CLIENT_URL
}))


app.use(express.json());
app.use(morgan("dev"));

//route handle here 

app.use('/api/auth',userAuthRoute)
app.use('/api/user',userChatRoute)
app.use('/api/user-details',userDetails)
// error handler function use here
app.use(notFound)
app.use(commonErrorHandler)

// db connectoin
connect();
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
  });
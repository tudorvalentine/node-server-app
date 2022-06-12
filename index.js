const express = require("express");
const path = require("path");
const { hostname } = require("os");
const fs = require("fs");
const userRouter = require('./routes/routes')
const app = express();
const port = process.env.PORT || 80;

app.use(express.json())
app.use('/app', userRouter)

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
9

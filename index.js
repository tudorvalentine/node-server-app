const express = require("express");
const userRouter = require('./routes/routes')
const app = express();
const port = process.env.PORT || 80;

app.use(express.json())
app.use('/app', userRouter)

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
9

const express = require("express");
const app = express();

const host = 'localhost'
const port = process.env.PORT || 8080;


const userRouter = require('./routes/routes')

app.use(express.json())
app.use('/app', userRouter)
app.get('/', (req, res) => {
    res.send("ZBS")
})

app.listen(port, () => {
    console.log(`Listen on ${port}`)
})
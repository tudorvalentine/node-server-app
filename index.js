const express = require('express')

const app = express()
const port = process.env.PORT || 80
app.get("/",(req,res)=>{
    res.end("<h1>ZBS</h1>")
})

app.listen(port, ()=>{
    console.log(`App listen on port ${port}`)
})


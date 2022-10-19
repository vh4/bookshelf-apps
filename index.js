const express = require('express')
const app = express()
const path = require('path')

app.use('/', express.static(path.join(__dirname, 'public')))
const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>{
    console.log("listening to port 3000 berhasil")
})

var express = require("express")
var app = express()

app.use(express.static("website"))
app.listen(33102)
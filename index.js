var http = require ("http")
var server = http.createServer ((request,response)=>{
	response.write ("Hallo willkommen auf diesem Heimserver")
	response.write (""+new Date())
	response.end (""+Date.now())
})
server.listen(19132)
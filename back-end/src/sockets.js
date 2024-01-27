const server = require('http').createServer();
const io = require('socket.io')(server);


function createSocketServer() {
    console.log("socket server!");
    io.on('connection', client => {
        client.on('event', data => { /* … */ });
        client.on('disconnect', () => { /* … */ });
    });
    server.listen(4000);
}

module.exports = {
    createSocketServer,
}
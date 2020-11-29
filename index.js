const express = require('express')
const http = require('http')
const socket_io = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socket_io(server)

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = []

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('nickName', data => {
    users.push({
      nickName: data,
      socket
    })
  })
  socket.on('message', ({ userName, message }) => {
    console.log(users.length)
    const user = users.find(item => item.nickName === userName)
    if (!user) return
    user.socket.emit('private', {
      nickName: user.nickName,
      data: message
    })
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

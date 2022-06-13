require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const { socketConnection } = require('./utils/socket-io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.routes');

const PORT = process.env.PORT || 3000;

socketConnection(http);

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', userRouter);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

// io.on('connection', function (socket) {
//   console.log('A user connected');
//   io.emit('notification', 'hi');

//   // socket.on('notification', function (msg) {
//   //   console.log(msg);
//   //   io.emit('notification', msg);
//   // });

//   socket.on('disconect', function () {
//     console.log('Made socket diskonected');
//   });

//   socket.on('send-notification', function (data) {
//     io.emit('new-notification', data);
//   });
// });

http.listen(PORT, () => console.log('Server started on port ' + PORT));

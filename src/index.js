const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMesaage,generateLocationMesaage} = require('./utils/messages');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));

// let count = 0 ;

io.on('connection',(socket)=>{
    console.log('New web socket connection');

    socket.emit('message',generateMesaage('Welcome!'));

    socket.broadcast.emit('message',generateMesaage('A new user has joined!'));

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter();

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed');
        }

        io.emit('message',generateMesaage(message));
        callback();
    });

    socket.on('sendLocation',({latitude,longitude},callback)=>{
        io.emit('locationMessage',generateLocationMesaage(`https://google.com/maps?q=${latitude},${longitude}`));
        callback();
    });

    socket.on('disconnect',()=>{
        io.emit('message',generateMesaage('A user has left'));
    });
});

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`);
});
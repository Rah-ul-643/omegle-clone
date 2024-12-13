const express = require('express');
const cors = require('cors');
const server = require('http').createServer();
const Queue=require('./queue');

const io = require('socket.io')(server);
const app = express();

const CLIENT_URL = 'http://localhost:3000'
const PORT = 3000;

let activeUsers = [];
let activePairs = [];

const queue = new Queue();


app.use(cors({
    origin: CLIENT_URL,
    optionsSuccessStatus: 200,    // For legacy browser support
}));


io.on('connection',(socket) => {
    console.log(`Client connected with socket id: ${socket.id}`);
    activeUsers.push(socket.id);

    
    const sendMessage = ((clientIDs,response) => {
        io.to(clientIDs).emit('response',response);          // make the to an array of clients
    })


    const connectPair = () => {

        while (queue.size()>1){
            const user1 = queue.dequeue();
            const user2 = queue.dequeue();

            activePairs.push([user1,user2]);
            sendMessage(user1,{status:2, message:"connected", receiverId:user2});
            sendMessage(user2,{status:2, message:"connected", receiverId:user1});
            console.log(`${user1} and ${user2} are now connected.`);
        }
    }

    const removePair = (socketId) => {
        const pair = activePairs.find((pair) => pair.find((id) => id===socket.id ));
        activePairs = activePairs.filter( (pair) => pair.every((id) => id!==socketId));
        console.log(`Terminated chat between users: ${pair}`);
        sendMessage(pair, {status:3, message: "Connection terminated"}); // send message to both the users
    }

    socket.on('requestConnection', () => {
        queue.enqueue(socket.id);
        if (queue.size()>1) connectPair();
        else sendMessage(socket.id, {status:1, message:"waiting for connection"});
    })

    socket.on('closeChat', () => {
        removePair(socket.id);        
    })

    socket.on('disconnect', ()=>{
        console.log(`Client with socket id: ${socket.id} disconnected`);
        activeUsers = activeUsers.filter( (id) => socket.id !== id);
        removePair(socket.id);
    });

    socket.on('sendMsg', (receiverId, message) => {
        console.log('Received message from client:',socket.id);
        io.to(receiverId).emit('receiverMsg', message);
    })


})



server.listen(PORT,() => {
    console.log(`server listening on port: ${PORT}`);    
})
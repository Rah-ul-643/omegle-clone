const express = require('express');
const cors = require('cors');
const server = require('http').createServer();
const { Server } = require('socket.io');

const Queue = require('./queue');

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from your frontend
        methods: ["GET", "POST"],       // Allow these methods
        credentials: true               // Allow credentials (if needed)
    }
});

const app = express();

const CLIENT_URL = 'http://localhost:3000'
const PORT = 4000;

let activeUsers = [];
let activePairs = [];

const queue = new Queue();


app.use(cors({
    origin: CLIENT_URL,
    optionsSuccessStatus: 200,    // For legacy browser support
}));


io.on('connection', (socket) => {
    console.log(`Client connected with socket id: ${socket.id}`);
    activeUsers.push(socket.id);


    const sendMessage = ((clientID, response) => {
        io.to(clientID).emit('response', response);          // make the to an array of clients
    })


    const connectPair = () => {

        while (queue.size() > 1) {
            const user1 = queue.dequeue();
            if (!activeUsers.includes(user1)) continue;

            const user2 = queue.dequeue();
            if (!activeUsers.includes(user2)) {
                queue.enqueue(user1);
                continue;
            }

            activePairs.push([user1, user2]);
            sendMessage(user1, { status: 2, message: "connected", receiverId: user2 });
            sendMessage(user2, { status: 2, message: "connected", receiverId: user1 });
            console.log(`${user1} and ${user2} are now connected.`);
        }
    }

    const removePair = (socketId) => {
        const pair = activePairs.find((pair) => pair.includes(socketId));
        if (!pair) return; // Avoid sending messages for non-existent pairs

        activePairs = activePairs.filter((p) => !p.includes(socketId));
        console.log(`Terminated chat between users: ${pair}`);

        // Notify both users if they exist
        pair.forEach((id) => sendMessage(id, { status: 3, message: "Connection terminated" }));
    };

    socket.on('requestConnection', () => {
        queue.enqueue(socket.id);
        if (queue.size() > 1) connectPair();
        else sendMessage(socket.id, { status: 1, message: "waiting for connection" });
    })

    socket.on('closeChat', () => {
        removePair(socket.id);
    })

    socket.on('disconnect', () => {
        console.log(`Client with socket id: ${socket.id} disconnected`);
        activeUsers = activeUsers.filter((id) => socket.id !== id);
        removePair(socket.id);
        queue.remove(socket.id);    // if still in queue    
    });

    socket.on('sendMsg', (receiverId, message) => {
        console.log('Received message from client:', socket.id);
        if (activePairs.find((pair) => pair.includes(receiverId) && pair.includes(socket.id))) {
            io.to(receiverId).emit('receiverMsg', message);
        }
    })


})



server.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
})
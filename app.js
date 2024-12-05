import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ChatManager from './src/managers/chatManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const chatManager = new ChatManager('./chat.json');

app.use(express.static('public'));

// Manejo de conexiones
io.on('connection', async (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Solicita el nombre de usuario
    socket.on('registerUser', async (username) => {
        socket.username = username;
        console.log(`Usuario registrado: ${username}`);

        // Notificar conexión a todos los usuarios
        io.emit('userConnected', username);

        // Enviar mensajes previos al usuario
        const messages = await chatManager.getMessages();
        socket.emit('loadMessages', messages);
    });

    // Manejo de nuevos mensajes
    socket.on('newMessage', async (message) => {
        const messageObject = { user: socket.username, text: message };
        await chatManager.saveMessage(messageObject);
        io.emit('broadcastMessage', messageObject);
    });

    // Notificar cuando un usuario se desconecta
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.username || 'Sin nombre');
    });
});

// Inicia el servidor
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
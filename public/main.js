const socket = io();
let username;

// Solicitar nombre de usuario con SweetAlert2
Swal.fire({
    title: 'Ingresa tu nombre',
    input: 'text',
    inputPlaceholder: 'Nombre',
    allowOutsideClick: false,
    inputValidator: (value) => {
        return !value && "Por favor ingrese un usuario"
    },
    confirmButtonText: 'OK'
}).then((result) => {
    if (result.value) {
        username = result.value.trim();
        socket.emit('registerUser', username);
    }
});

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

// Mostrar mensajes en pantalla
function displayMessage({ user, text }) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span>${user}:</span> ${text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Mostrar usuarios conectados
socket.on('userConnected', (user) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.style.color = 'green';
    div.textContent = `${user} se ha conectado.`;
    messagesDiv.appendChild(div);
});

// Cargar mensajes previos
socket.on('loadMessages', (messages) => {
    messages.forEach(displayMessage);
});

// Recibir nuevos mensajes
socket.on('broadcastMessage', (message) => {
    displayMessage(message);
});

// Enviar mensaje
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('newMessage', message);
        messageInput.value = '';
    }
});

// Enviar mensaje al presionar Enter
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

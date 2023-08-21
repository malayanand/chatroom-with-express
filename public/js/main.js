const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

// Get username and room from url query
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// Join chatroom
socket.emit('joinRoom', { username, room });

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emiting a message to server
    socket.emit('chatMessage', msg);
    
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

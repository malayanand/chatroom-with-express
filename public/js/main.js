const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const leaveBtn = document.querySelector(".btn");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users")

const socket = io();

// Get username and room from url query
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// Join chatroom
socket.emit('joinRoom', { username, room });

// Ger room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

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
});

// Prompt user before leaving
leaveBtn.addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chat?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {}
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
   userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

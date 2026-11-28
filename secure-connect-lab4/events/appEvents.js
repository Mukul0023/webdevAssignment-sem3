const EventEmitter = require('events');

class AppEmitter extends EventEmitter {}
const appEvents = new AppEmitter();

// Event listeners for system logging & auditing
appEvents.on('user:registered', (user) => {
  console.log(`[Event] New user registered: ${user.username} (${user.email})`);
});

appEvents.on('user:loggedIn', (user) => {
  console.log(`[Event] User logged in: ${user.username}`);
});

appEvents.on('note:created', (note) => {
  console.log(`[Event] Note created: "${note.title}" by User ID ${note.owner}`);
});

module.exports = appEvents; 
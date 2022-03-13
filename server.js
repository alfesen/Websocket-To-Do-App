const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '/client')));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found' });
});

const io = socket(server);

const tasks = [];

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', task => {
    console.log(`${socket.id} adds task ${task.name} with id ${task.id}`);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (id) => {
    console.log(`${socket.id} removes  ${id}`);

    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', id)
  });
});
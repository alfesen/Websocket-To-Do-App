const express = require('express')
const socket = require('socket.io')
const path = require('path')

const app = express()
app.use(express.static(path.join(__dirname, '/client')))

const server = app.listen(8000, () => {
  console.log('Server is running on port 8000')
})

app.use((req, res) => {
  res.status(404).send({ message: 'Not found' })
})

const io = socket(server, { cookieName: 'io', sameSite: 'lax' })

const tasks = []

io.on('connection', socket => {
  socket.emit('updateData', tasks)
  socket.on('addTask', task => {
    tasks.push(task)
    socket.broadcast.emit('addTask', task)
  })
  socket.on('removeTask', id => {
    const taskIndex = tasks.findIndex(task => task.id === id)
    tasks.splice(taskIndex, 1)
    socket.broadcast.emit('removeTask', id)
  })
})

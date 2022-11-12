import React from 'react'
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io('localhost:8000')
    this.socket.on('updateData', task => this.updateTasks(task))
    this.socket.on('addTask', task => this.addTask(task))
    this.socket.on('removeTask', id => this.removeTask(id))
  }

  updateTasks(task) {
    this.setState({ tasks: task })
  }

  removeTask = (id, local = false) => {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id),
    })
    if (local) {
      this.socket.emit('removeTask', id)
    }
  }

  submitForm = event => {
    event.preventDefault()
    const id = uuidv4()
    if (this.state.taskName === '') return 
    this.addTask({ id, name: this.state.taskName })
    this.socket.emit('addTask', { id, name: this.state.taskName })
    this.setState({ taskName: '' })
  }

  addTask = task => {
    this.setState({
      tasks: [...this.state.tasks, task],
    })
  }

  render() {
    return (
      <div className='App'>
        <header>
          <h1>ToDoApp</h1>
        </header>
        <section className='tasks-section' id='tasks-section'>
          <ul className='tasks-section__list' id='tasks-list'>
            {this.state.tasks.map(({ id, name }) => (
              <li key={id} className='task'>
                {name}
                <button
                  onClick={() => this.removeTask(id, true)}
                  className='btn btn--red'>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id='add-task-form' onSubmit={event => this.submitForm(event)}>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              id='task-name'
              value={this.state.taskName}
              onChange={event =>
                this.setState({ taskName: event.target.value })
              }
            />
            <button className='btn' type='submit'>
              Add
            </button>
          </form>
        </section>
      </div>
    )
  }
}

export default App

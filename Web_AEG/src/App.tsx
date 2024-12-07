import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')
  const [newStudent, setNewStudent] = useState({ name: '', age: 0, course: '' })

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://localhost:7263/api/Student')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5024/api/Auth/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5024/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      setLoginMessage(data.message)
    } catch (error) {
      setLoginMessage('Error connecting to the server')
    }
  }

  const addStudent = async (student) => {
    try {
      const response = await fetch('https://localhost:7263/api/Student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      })
      if (response.ok) {
        fetchStudents() // Actualiza la lista de estudiantes
      }
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  const deleteStudent = async (studentId) => {
    try {
      const response = await fetch(`https://localhost:7263/api/Student/${studentId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchStudents() // Actualiza la lista de estudiantes
      }
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const updateStudent = async (student) => {
    try {
      const response = await fetch(`https://localhost:7263/api/Student/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      })
      if (response.ok) {
        fetchStudents() // Actualiza la lista de estudiantes
      }
    } catch (error) {
      console.error('Error updating student:', error)
    }
  }

  const handleAddStudent = (e) => {
    e.preventDefault()
    addStudent(newStudent)
    setNewStudent({ name: '', age: 0, course: '' })
  }

  const handleDeleteStudent = (id) => {
    deleteStudent(id)
  }

  const handleUpdateStudent = (student) => {
    const updatedStudent = { ...student, name: prompt("Enter new name:", student.name) }
    updateStudent(updatedStudent)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Students and Users</h1>
      <button onClick={fetchStudents}>Get All Students</button>
      <button onClick={fetchUsers}>Get All Users</button>
      
      <div>
        <h2>Add Student</h2>
        <form onSubmit={handleAddStudent}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              value={newStudent.age}
              onChange={(e) => setNewStudent({ ...newStudent, age: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <label>Course:</label>
            <input
              type="text"
              value={newStudent.course}
              onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
              required
            />
          </div>
          <button type="submit">Add Student</button>
        </form>
      </div>
      
      <div>
        <h2>Students</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} - {student.age} - {student.course}
              <button onClick={() => handleUpdateStudent(student)}>Edit</button>
              <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      </div>
      
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {loginMessage && <p>{loginMessage}</p>}
    </>
  )
}

export default App

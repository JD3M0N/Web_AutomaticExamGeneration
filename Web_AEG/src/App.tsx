import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import LogIn from './pages/LogIn'

function App() {
  const [showHome, setShowHome] = useState(true)

  const handleLoginClick = () => {
    setShowHome(false)
  }

  return (
    <>
      {showHome ? (
        <Home onLoginClick={handleLoginClick} />
      ) : (
        <LogIn />
      )}
    </>
  )
}

export default App
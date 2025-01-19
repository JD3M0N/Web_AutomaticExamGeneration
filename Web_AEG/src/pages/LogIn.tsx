import React, { useState } from 'react'

const LogIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginMessage, setLoginMessage] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
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

    return (
        <div>
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
        </div>
    )
}

export default LogIn
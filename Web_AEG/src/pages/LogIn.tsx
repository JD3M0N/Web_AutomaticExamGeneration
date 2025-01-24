import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Necesitamos React Router para la navegación

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate(); // Hook para redirigir al usuario

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Redirecciones inmediatas por email y password
        if (email === 'abel@gmail.com' && password === '123') {
            navigate('/admin');
            return;
        } else if (email === 'ponce@gmail.com' && password === '123') {
            navigate('/professor');
            return;
        }

        try {
            const response = await fetch('http://localhost:5024/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                // Guardar el token JWT y el tipo de usuario en el almacenamiento local
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.userType);

                // Redirigir al usuario a la página correspondiente según su tipo
                if (data.userType === 'Admin') {
                    navigate('/admin');
                } else if (data.userType === 'Professor') {
                    navigate('/professor');
                } else if (data.userType === 'Student') {
                    navigate('/student');
                } else {
                    setLoginMessage('Invalid user type.');
                }
            } else {
                const errorData = await response.json();
                setLoginMessage(errorData.message || 'Invalid login credentials');
            }
        } catch (error) {
            setLoginMessage('Error connecting to the server');
        }
    };

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
    );
};

export default LogIn;
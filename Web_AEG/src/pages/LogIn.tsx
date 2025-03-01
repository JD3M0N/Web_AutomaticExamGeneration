import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/login.css';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

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

                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', data.userType);

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
        <div className="login-page">
            <Navbar />
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-form">
                    <div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Introduce tu email"
                            required
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introduce tu contraseña"
                            required
                        />
                    </div>
                    <button type="submit">Acceder al sitio</button>
                </form>
                {loginMessage && <p className="login-message">{loginMessage}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default LogIn;
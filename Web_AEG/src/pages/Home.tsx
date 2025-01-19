import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate(); // Hook para la redirección

    const handleLoginClick = () => {
        navigate('/login'); // Redirigir a la página de login
    };

    return (
        <div className="home">
            <header className="home-header">
                <h1>Bienvenidos a Nuestra Escuela</h1>
                <p>
                    Nuestra escuela se dedica a proporcionar una educación de calidad y
                    fomentar el crecimiento personal y académico de nuestros estudiantes.
                </p>
                <button onClick={handleLoginClick} className="login-button">
                    Iniciar Sesión
                </button>
            </header>
        </div>
    );
};

export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const navigate = useNavigate(); // Hook para la redirección

    const handleLoginClick = () => {
        navigate('/login'); // Redirigir a la página de login
    };

    return (
        <div className="home">
            <Navbar />
            <section className="hero-section">
                <h1>Simplifica la creación de exámenes en minutos</h1>
                <p>Automatiza la gestión de preguntas y exámenes con una interfaz intuitiva para profesores y estudiantes.</p>
                <button onClick={handleLoginClick} className="cta-button">Comenzar ahora</button>
            </section>
            <Footer />
        </div>
    );
};

export default Home;
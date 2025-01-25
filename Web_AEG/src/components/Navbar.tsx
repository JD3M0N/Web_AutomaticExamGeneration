import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // Asegúrate de tener un logo en esta ruta
import '../css/navbar.css';


const Navbar = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleFeaturesClick = () => {
        navigate('/features');
    };

    const handleHomeClick = () => {
        navigate('/');
    }

    return (
        <header className="home-header">
            <div className="logo-container">
                <img src={logo} alt="ExamGeneration Logo" className="logo" />
                <span className="project-name">ExamGeneration</span>
            </div>
            <nav className="navbar">
                <ul>
                    <li><a href="#home" onClick={handleHomeClick}>Inicio</a></li>
                    <li><a href="#features" onClick={handleFeaturesClick}>Funcionalidades</a></li>
                    <li><a href="#contact">Contacto</a></li>
                    <li><a href="#login" onClick={handleLoginClick}>Login</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
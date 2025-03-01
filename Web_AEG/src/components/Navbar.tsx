import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // Asegúrate de tener un logo en esta ruta
import '../css/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleFeaturesClick = () => {
        navigate('/features');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <header className="home-header">
            <div className="logo-container">
                <img src={logo} alt="ExamGeneration Logo" className="logo" />
                <h1 className="project-name">ExamGeneration</h1>
            </div>
            <nav className="navbar">
                <ul>
                    <li>
                        <a
                            href="#home"
                            onClick={handleHomeClick}
                            className={location.pathname === '/' ? 'active' : ''}
                        >
                            Inicio
                        </a>
                    </li>
                    <li>
                        <a
                            href="#features"
                            onClick={handleFeaturesClick}
                            className={location.pathname === '/features' ? 'active' : ''}
                        >
                            Funcionalidades
                        </a>
                    </li>
                    <li>
                        <a onClick={() => navigate('/statistics')} className={location.pathname === '/statistics' ? 'active' : ''}>
                            Estadísticas
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className={location.pathname === '/contact' ? 'active' : ''}>
                            Contacto
                        </a>
                    </li>
                    <li>
                        <a
                            href="#login"
                            onClick={handleLoginClick}
                            className={location.pathname === '/login' ? 'active' : ''}
                        >
                            Registrarse
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
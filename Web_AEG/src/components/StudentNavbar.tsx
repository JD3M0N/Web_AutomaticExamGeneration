import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // Asegúrate de tener un logo en esta ruta
import '../css/navbar.css';

const StudentNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/');
    };

    return (
        <header className="home-header">
            <div className="logo-container">
                <img src={logo} alt="ExamGeneration Logo" className="logo" />
                <span className="project-name">ExamGeneration</span>
            </div>
            <nav className="navbar">
                <ul>
                    <li className="admin-link">Estudiante</li>
                    <li>
                        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default StudentNavbar;

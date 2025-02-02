import React, { useState } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import '../css/student.css';

const StudentPage = () => {
    const [activeForm, setActiveForm] = useState('');

    return (
        <div className="student-page">
            <StudentNavbar />
            <div className="student-content">
                <div className="sidebar">
                    <button onClick={() => setActiveForm('accessExams')}>Acceder a Exámenes</button>
                    <button onClick={() => setActiveForm('viewGrades')}>Consultar Calificaciones</button>
                    <button onClick={() => setActiveForm('requestRegrade')}>Solicitar Recalificación</button>
                </div>
                <div className="form-container">
                    {activeForm === 'accessExams' && (
                        <div>
                            <h2>Lista de exámenes asignados</h2>
                            <ul>
                                {exams.map((exam) => (
                                    <li key={exam.id}>
                                        <span>{exam.name} - {exam.date}</span>
                                        <button onClick={() => setActiveForm('takeExam')}>Realizar Examen</button>
                                    </li>
                                ))}    
                            </ul>
                        </div>
                    )}        
                    {activeForm === 'takeExam' && <p>Formulario para realizar un examen.</p>}
                    {activeForm === 'viewGrades' && <p>Historial de calificaciones.</p>}
                    {activeForm === 'requestRegrade' && <p>Formulario para solicitar una recalificación.</p>}
                </div>
            </div>
        </div>
    );
};

export default StudentPage;

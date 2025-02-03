import React, { useState, useEffect } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import { fetchStudentAssignments, fetchUnattemptedExams } from '../utils/crudExam';
import { jwtDecode } from 'jwt-decode';
import '../css/student.css';

const StudentPage = () => {
    const [activeForm, setActiveForm] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [exams, setExams] = useState([]);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token en localStorage:', token);
    
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                console.log('Token decodificado:', decoded);
    
                const studentIdFromToken = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    
                if (studentIdFromToken) {
                    console.log('Student ID extraído:', studentIdFromToken);
                    setStudentId(parseInt(studentIdFromToken));
                } else {
                    console.error('No se encontró studentId en el token.');
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
            }
        } else {
            console.error('No se encontró token en localStorage.');
        }
    }, []);
    

    useEffect(() => {
        console.log('activeForm:', activeForm);
        console.log('studentId:', studentId);

        if (activeForm === 'accessExams' && studentId) {
            console.log('Llamando a fetchStudentAssignments...');
            fetchStudentAssignments(studentId, setAssignments, setNotification);
        } else if (activeForm.startsWith('viewExams_') && studentId) {
            const assignmentId = parseInt(activeForm.split('_')[1]);
            setSelectedAssignment(assignmentId);
            console.log(`Llamando a fetchUnattemptedExams para la asignatura ${assignmentId}...`);
            fetchUnattemptedExams(studentId, assignmentId, setExams, setNotification);
        }
    }, [activeForm, studentId]);

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
                    {notification && <p className={`notification ${notification.type}`}>{notification.message}</p>}

                    {activeForm === 'accessExams' && (
                        <div className="list-container">
                            <h2>Lista de asignaturas cursadas</h2>
                            {assignments.length > 0 ? (
                                <ul>
                                    {assignments.map((assignment: { id: number, name: string }) => (
                                        <li key={assignment.id}>
                                            <button onClick={() => setActiveForm(`viewExams_${assignment.id}`)}>
                                                {assignment.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay asignaturas disponibles.</p>
                            )}
                        </div>
                    )}
                    {activeForm.startsWith('viewExams_') && selectedAssignment && (
                        <div className="list-container">
                            <h2>Exámenes disponibles</h2>
                            {exams.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Total de Preguntas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.map((exam: { id: number, date: string, totalQuestions: number }) => (
                                            <tr key={exam.id}>
                                                <td>{exam.date}</td>
                                                <td>{exam.totalQuestions}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay exámenes disponibles para esta asignatura.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentPage;
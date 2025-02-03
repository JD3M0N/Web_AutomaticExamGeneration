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
    const [selectedExam, setSelectedExam] = useState<number | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [grades, setGrades] = useState<{ examId: number, grade: number }[]>([]);


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


    const handleTakeExam = async (examId: number) => {
        try {
            const response = await fetch(`http://localhost:5024/api/Belong/exam/${examId}/questions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                setQuestions(data.$values || []);
                setSelectedExam(examId);
                setActiveForm('takeExam'); // Activamos la vista de examen
            } else {
                console.error('Error al obtener preguntas del examen:', await response.json());
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
        }
    };



    const handleAnswerChange = (questionId: number, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value,
        }));
    };    
    


    const handleSubmitExam = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!selectedExam || !studentId) {
            alert("No se puede enviar el examen. Datos faltantes.");
            return;
        }
    
        try {
            // Enviar cada respuesta de manera individual
            const promises = Object.entries(answers).map(async ([questionId, response]) => {
                const payload = {
                    studentId: studentId,
                    examId: selectedExam,
                    questionId: Number(questionId),
                    answer: response,
                };
    
                console.log("Enviando respuesta:", payload); // Debug
    
                const responseFetch = await fetch("http://localhost:5024/api/Response", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
    
                if (!responseFetch.ok) {
                    console.error(`Error al enviar la respuesta de la pregunta ${questionId}:`, await responseFetch.json());
                }
            });
    
            await Promise.all(promises); // Esperar que todas las respuestas sean enviadas
    
            alert("Examen enviado con éxito.");
            setActiveForm("accessExams"); // Regresar a la lista de exámenes
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
        }
    }; 
    
    
    const fetchStudentGrades = async () => {
        if (!studentId) {
            console.error("No se encontró studentId.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5024/api/Grade/student/${studentId}/graded-exams`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Notas recibidas:", data);
    
                setGrades(data.$values || []); // Almacena las calificaciones
                setActiveForm("viewGrades"); // Cambia la vista a la tabla de calificaciones
            } else {
                console.error("Error al obtener calificaciones:", await response.json());
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
        }
    };    


    return (
        <div className="student-page">
            <StudentNavbar />
            <div className="student-content">
                <div className="sidebar">
                    <button onClick={() => setActiveForm('accessExams')}>Acceder a Exámenes</button>
                    <button onClick={fetchStudentGrades}>Consultar Calificaciones</button>
                    <button onClick={() => setActiveForm('requestRegrade')}>Solicitar Recalificación</button>
                </div>
                <div className="form-container">
                    {activeForm === 'takeExam' && selectedExam && (
                        <div className="exam-container">
                            <h2>Realizando Examen</h2>
                            <form onSubmit={handleSubmitExam}>
                                {questions.map((question, index) => (
                                    <div key={index} className="question-block">
                                        <p>{question.questionText}</p>
                                        
                                        {question.type === 'MultipleChoice' && (
                                            <div>
                                                {question.options.map((option: string, i: number) => (
                                                    <label key={i}>
                                                        <input
                                                            type="radio"
                                                            name={`question-${index}`}
                                                            value={option}
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                        />
                                                        {option}
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {question.type === 'Essay' && (
                                            <textarea
                                                name={`question-${index}`}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            />
                                        )}

                                        {question.type === 'TrueFalse' && (
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`question-${index}`}
                                                        value="true"
                                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    />
                                                    Verdadero
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`question-${index}`}
                                                        value="false"
                                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    />
                                                    Falso
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button type="submit">Enviar Examen</button>
                            </form>
                        </div>
                    )}
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
                                            <th>Acción</th> {/* Nueva columna para el botón */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.map((exam: { id: number, date: string, totalQuestions: number }) => (
                                            <tr key={exam.id}>
                                                <td>{exam.date}</td>
                                                <td>{exam.totalQuestions}</td>
                                                <td>
                                                    <button onClick={() => handleTakeExam(exam.id)}>Realizar Examen</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay exámenes disponibles para esta asignatura.</p>
                            )}
                        </div>
                    )}

                    {activeForm === "viewGrades" && (
                        <div className="list-container">
                            <h2>Calificaciones</h2>
                            {grades.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Exam ID</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grades.map((grade, index) => (
                                            <tr key={index}>
                                                <td>{grade.examId}</td>
                                                <td>{grade.grade}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay calificaciones disponibles.</p>
                            )}
                        </div>
                    )}

                </div>
                                                        
            </div>
        </div>
    );
};

export default StudentPage;





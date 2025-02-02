import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import ProfessorNavbar from '../components/ProfessorNavbar';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { fetchProfessorTopics } from '../utils/crudTopic';
import { fetchQuestions } from '../utils/crudQuestion';
import { fetchExams } from '../utils/crudExam';
import { fetchAssignmentsByProfessor } from '../utils/crudAssignment';
import '../css/professor.css';

const ProfessorPage = () => {
    const [activeForm, setActiveForm] = useState('');
    const [professorId, setProfessorId] = useState<number | null>(null);
    const [isHeadOfAssignment, setIsHeadOfAssignment] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        difficulty: '',
        type: '',
        questionText: '',
        topicId: '',
    });
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [exams, setExams] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
    const [examData, setExamData] = useState([
        { topicId: '', difficulty: '' },
        { topicId: '', difficulty: '' },
        { topicId: '', difficulty: '' },
        { topicId: '', difficulty: '' },
        { topicId: '', difficulty: '' },
    ]);

    // Obtiene el ID del profesor desde el token almacenado en localStorage
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded: any = jwtDecode(token);
                if (decoded.professorId) {
                    setProfessorId(decoded.professorId);
                    setIsHeadOfAssignment(decoded.IsHeadOfAssignment);
                    console.log('Profesor ID:', decoded.professorId);
                } else {
                    console.error('El token no contiene professorId.');
                    alert('No se pudo obtener la información del profesor. Inicia sesión nuevamente.');
                }
            } else {
                console.error('No se encontró ningún token en localStorage.');
                alert('Inicia sesión para continuar.');
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            alert('Hubo un error al procesar tu sesión. Inicia sesión nuevamente.');
        }
    }, []);

    // Carga los temas disponibles para el profesor logueado
    useEffect(() => {
        if (professorId) {
            fetchProfessorTopics(professorId, setTopics, setNotification);
            fetchAssignmentsByProfessor(professorId, setAssignments, setNotification);
        }
    }, [professorId]);

    // Carga las preguntas cuando se selecciona "Ver Preguntas"
    useEffect(() => {
        if (activeForm === 'viewQuestions' && professorId) {
            fetchQuestions(professorId, setQuestions, setNotification);
            console.log('Preguntas obtenidas:', questions);
        }
    }, [activeForm, professorId]);

    // Carga los exámenes cuando se selecciona "Ver Exámenes"
    useEffect(() => {
        if (activeForm === 'viewExams' && professorId) {
            fetchExams(professorId, setExams, setNotification);
            console.log('Exámenes obtenidos:', exams);
        }
    }, [activeForm, professorId]);

    // Manejo de cambios en los inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Manejo del envío del formulario de agregar preguntas
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!professorId) {
            alert('No se pudo identificar al profesor. Inicia sesión nuevamente.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5024/api/Question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    difficulty: parseInt(formData.difficulty),
                    type: formData.type,
                    questionText: formData.questionText,
                    topicId: parseInt(formData.topicId),
                    professorId: professorId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            alert('Pregunta añadida exitosamente');
            setFormData({
                difficulty: '',
                type: '',
                questionText: '',
                topicId: '',
            });
        } catch (error) {
            console.error('Error al enviar la pregunta:', error);
            alert('Hubo un error al intentar enviar la pregunta.');
        }
    };

    // Manejo de cambios en los inputs del examen
    const handleExamInputChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newExamData = [...examData];
        newExamData[index] = {
            ...newExamData[index],
            [name]: value,
        };
        setExamData(newExamData);
    };

    // Manejo del envío del formulario de crear examen
    const handleExamSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (examData.filter(block => block.topicId && block.difficulty).length < 3) {
            alert('El examen debe tener al menos 3 preguntas.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5024/api/Exam/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    professorId: professorId,
                    assignmentId: selectedAssignment,
                    questions: examData.filter(block => block.topicId && block.difficulty),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            alert('Examen creado exitosamente');
            setExamData([
                { topicId: '', difficulty: '' },
                { topicId: '', difficulty: '' },
                { topicId: '', difficulty: '' },
                { topicId: '', difficulty: '' },
                { topicId: '', difficulty: '' },
            ]);
        } catch (error) {
            console.error('Error al crear el examen:', error);
            alert('Hubo un error al intentar crear el examen.');
        }
    };

    // Función para obtener el nombre del tema a partir del ID
    const getTopicName = (topicId: number) => {
        const topic = topics.find((t: { id: number }) => t.id === topicId);
        return topic ? topic.name : 'Desconocido';
    };

    // Manejo de la selección de una asignatura
    const handleAssignmentSelect = (assignmentId: number) => {
        setSelectedAssignment(assignmentId);
        setActiveForm('createExam'); // Cambia el formulario activo a 'createExam'
        fetchProfessorTopics(professorId!, setTopics, setNotification);
    };

    return (
        <div className="professor-page">
            <ProfessorNavbar />
            <div className="professor-content">
                <div className="sidebar">
                    <button onClick={() => setActiveForm('addQuestion')}>Añadir Pregunta</button>
                    <button onClick={() => setActiveForm('viewQuestions')}>Ver Preguntas</button>
                    <button onClick={() => setActiveForm('selectAssignment')}>Crear Examen</button>
                    <button onClick={() => setActiveForm('viewExams')}>Ver Exámenes</button>
                    {isHeadOfAssignment && (
                        <button onClick={() => window.location.href = '/endpoint'}>Validar Examen</button>
                    )}
                </div>
                <div className="form-container">
                    {notification && <Notification message={notification.message} type={notification.type} />}

                    {activeForm === 'addQuestion' && (
                        <form onSubmit={handleSubmit} className="professor-form">
                            <h2>Añadir Pregunta</h2>
                            <div>
                                <label className="custom-label">Dificultad:</label>
                                <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} required>
                                    <option value="">Selecciona una opción</option>
                                    <option value="1">Fácil</option>
                                    <option value="2">Media</option>
                                    <option value="3">Difícil</option>
                                </select>
                            </div>
                            <div>
                                <label className="custom-label">Tipo:</label>
                                <select name="type" value={formData.type} onChange={handleInputChange} required>
                                    <option value="">Selecciona un tipo</option>
                                    <option value="MultipleChoice">Opción Múltiple</option>
                                    <option value="TrueFalse">Verdadero/Falso</option>
                                    <option value="Essay">Ensayo</option>
                                </select>
                            </div>
                            <div>
                                <label className="custom-label">Texto de la Pregunta:</label>
                                <textarea name="questionText" value={formData.questionText} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label className="custom-label">Tema:</label>
                                <select name="topicId" value={formData.topicId} onChange={handleInputChange} required>
                                    <option value="">Selecciona un tema</option>
                                    {topics.map((topic: { id: number, name: string }) => (
                                        <option key={topic.id} value={topic.id}>
                                            {topic.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Enviar Pregunta</button>
                        </form>
                    )}

                    {activeForm === 'viewQuestions' && (
                        <div className="list-container">
                            {questions.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Texto de la Pregunta</th>
                                            <th>Dificultad</th>
                                            <th>Tipo</th>
                                            <th>Tema</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((question: { id: number, questionText: string, difficulty: number, type: string, topicId: number }) => (
                                            <tr key={question.id}>
                                                <td>{question.questionText}</td>
                                                <td>{question.difficulty}</td>
                                                <td>{question.type}</td>
                                                <td>{getTopicName(question.topicId)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay preguntas disponibles.</p>
                            )}
                        </div>
                    )}

                    {activeForm === 'viewExams' && (
                        <div className="list-container">
                            <h2>Ver Exámenes</h2>
                            {exams.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre del Examen</th>
                                            <th>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.map((exam: { id: number, name: string, date: string }) => (
                                            <tr key={exam.id}>
                                                <td>{exam.name}</td>
                                                <td>{exam.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay exámenes disponibles.</p>
                            )}
                        </div>
                    )}

                    {activeForm === 'selectAssignment' && (
                        <div className="list-container">
                            <h2>Selecciona una Asignatura</h2>
                            {assignments.length > 0 ? (
                                <ul>
                                    {assignments.map((assignment: { id: number, name: string }) => (
                                        <li key={assignment.id}>
                                            <button onClick={() => handleAssignmentSelect(assignment.id)}>{assignment.name}</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay asignaturas disponibles.</p>
                            )}
                        </div>
                    )}

                    {activeForm === 'createExam' && selectedAssignment && (
                        <form onSubmit={handleExamSubmit} className="professor-form">
                            <h2>Crear Examen</h2>
                            <button type="button" onClick={() => setActiveForm('selectAssignment')} className="back-button">←</button>
                            {examData.map((block, index) => (
                                <div key={index} className="exam-block">
                                    <label className="custom-label">Tema:</label>
                                    <select name="topicId" value={block.topicId} onChange={(e) => handleExamInputChange(index, e)} required>
                                        <option value="">Selecciona un tema</option>
                                        {topics.map((topic: { id: number, name: string }) => (
                                            <option key={topic.id} value={topic.id}>
                                                {topic.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="custom-label">Dificultad:</label>
                                    <select name="difficulty" value={block.difficulty} onChange={(e) => handleExamInputChange(index, e)} required>
                                        <option value="">Selecciona una opción</option>
                                        <option value="1">Fácil</option>
                                        <option value="2">Media</option>
                                        <option value="3">Difícil</option>
                                    </select>
                                </div>
                            ))}
                            <button type="submit">Crear Examen</button>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfessorPage;
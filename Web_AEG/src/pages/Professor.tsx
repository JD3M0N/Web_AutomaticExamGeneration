import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
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
    const [unvalidatedExams, setUnvalidatedExams] = useState<any[]>([]);

    const handleViewExamsSelect = async (assignmentId: number) => {
        setSelectedAssignment(assignmentId);
        try {
            const response = await fetch(`http://localhost:5024/api/Assignment/${assignmentId}/exams`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const examsData = data.$values || [];
                const enrichedExams = await Promise.all(
                    examsData.map(async (exam: any) => {
                        try {
                            const profResponse = await fetch(`http://localhost:5024/api/Professor/${exam.professorId}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (profResponse.ok) {
                                const professorData = await profResponse.json();
                                // Se obtiene el email del profesor junto con sus demás datos
                                exam.professor = professorData;
                            }
                        } catch (error) {
                            console.error('Error al obtener profesor:', error);
                        }
                        return exam;
                    })
                );
                setExams(enrichedExams);
                setActiveForm('viewExams');
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message, type: 'error' });
            }
        } catch (error) {
            setNotification({ message: 'Error al conectar con el servidor.', type: 'error' });
        }
    };

    // En el useEffect donde cargas las asignaturas
    useEffect(() => {
        if (professorId) {
            fetchAssignmentsByProfessor(
                professorId,
                setAssignments,
                setNotification
            ).catch(error => {
                console.error('Error al cargar asignaturas:', error);
                setNotification({
                    message: 'Error al cargar las asignaturas',
                    type: 'error'
                });
            });
        }
    }, [professorId]);

    const fetchUnvalidatedExams = async () => {
        try {
            const response = await fetch(`http://localhost:5024/api/Professor/${professorId}/unvalidated-exams`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const exams = data.$values || [];
                const enrichedExams = await Promise.all(
                    exams.map(async (exam: any) => {
                        // Obtener los detalles del profesor
                        try {
                            const profResponse = await fetch(`http://localhost:5024/api/Professor/${exam.professorId}`, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json' },
                            });
                            if (profResponse.ok) {
                                const professorData = await profResponse.json();
                                exam.professor = professorData;
                            }
                        } catch (error) {
                            console.error('Error al obtener profesor:', error);
                        }
                        // Obtener los detalles de la asignatura
                        try {
                            const assignResponse = await fetch(`http://localhost:5024/api/Assignment/${exam.assignmentId}`, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json' },
                            });
                            if (assignResponse.ok) {
                                const assignmentData = await assignResponse.json();
                                exam.assignment = assignmentData;
                            }
                        } catch (error) {
                            console.error('Error al obtener asignatura:', error);
                        }
                        return exam;
                    })
                );
                setUnvalidatedExams(enrichedExams);
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message, type: 'error' });
            }
        } catch (error) {
            setNotification({ message: 'Error al conectar con el servidor.', type: 'error' });
        }
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        if (activeForm === 'createExam' && selectedAssignment) {
            fetch(`http://localhost:5024/api/Assignment/${selectedAssignment}/topics`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((res) => {
                    if (res.ok) return res.json();
                    throw new Error('Error al obtener los temas.');
                })
                .then((data) => {
                    const topicsData = data.$values || [];
                    setTopics(topicsData);
                })
                .catch((error) => {
                    console.error('Error fetching topics:', error);
                });
        }
    }, [activeForm, selectedAssignment]);

    // Función para validar o denegar un examen
    const handleExamValidation = async (examId: number, isValid: boolean) => {
        if (!isHeadOfAssignment) {
            setNotification({ message: "No tienes permisos para validar este examen.", type: "error" });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5024/api/ExamValidation/${examId}?isValid=${isValid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                setUnvalidatedExams(prev => prev.filter(exam => exam.id !== examId));
                setNotification({ message: "Examen validado correctamente", type: "success" });
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message || "Error al validar el examen", type: "error" });
            }
        } catch (error) {
            setNotification({ message: "Error al conectar con el servidor.", type: "error" });
        }
    };

    useEffect(() => {
        // Verifica y decodifica el token
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded: any = jwtDecode(token);
                if (decoded.professorId) {
                    setProfessorId(decoded.professorId);
                    setIsHeadOfAssignment(decoded.IsHeadOfAssignment);
                    console.log("ahora viene si es jefe de asignatura");
                    console.log(isHeadOfAssignment);
                } else {
                    alert('No se pudo obtener la información del profesor. Inicia sesión nuevamente.');
                }
            }
        } catch {
            alert('Hubo un error al procesar tu sesión. Inicia sesión nuevamente.');
        }
    }, []);

    // Decodificar el token y obtener el professorId y isHeadOfAssignment
    useEffect(() => {
        try {
            const token = localStorage.getItem('token'); // Cambia si usas otro almacenamiento
            if (token) {
                const decoded: any = jwtDecode(token); // Decodifica el token
                console.log('Token decodificado:', decoded);
                if (decoded.professorId) {
                    setProfessorId(decoded.professorId); // Extrae el professorId
                    setIsHeadOfAssignment(decoded.IsHeadOfAssignment); // Extrae isHeadOfAssignment
                    console.log('IsHeadOfAssignment:', decoded.IsHeadOfAssignment);
                } else {
                    console.error('El token no contiene professorId.');
                    alert('No se pudo obtener la información del profesor. Por favor, inicia sesión nuevamente.');
                }
            } else {
                console.error('No se encontró ningún token en localStorage.');
                alert('Por favor, inicia sesión para continuar.');
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            alert('Hubo un error al procesar tu sesión. Por favor, inicia sesión nuevamente.');
        }
    }, []);
    // Carga los temas disponibles para el profesor logueado
    useEffect(() => {
        if (professorId) {
            fetchProfessorTopics(professorId, setTopics, setNotification);

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
        if (activeForm === 'viewExams' && !selectedAssignment && professorId) {
            fetchExams(professorId, setExams, setNotification);
            console.log('Exámenes obtenidos:', exams);
        }
    }, [activeForm, professorId, selectedAssignment]);

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

    const handleValidateExamsClick = async () => {
        await fetchUnvalidatedExams();
        setActiveForm('validateExams');
    };

    // ----------Modal para la visualizacion de las preguntas
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    const openQuestionModal = (question: any) => {
        setSelectedQuestion(question);
        setShowQuestionModal(true);
    };

    const closeQuestionModal = () => {
        setShowQuestionModal(false);
        setSelectedQuestion(null);
    };

    return (
        <div className="professor-page">
            <ProfessorNavbar />
            <div className="professor-content">
                <div className="sidebar">
                    <button onClick={() => setActiveForm('addQuestion')}>Añadir Pregunta</button>
                    <button onClick={() => setActiveForm('viewQuestions')}>Ver Preguntas</button>
                    <button onClick={() => setActiveForm('selectAssignment')}>Crear Examen</button>
                    <button onClick={() => setActiveForm('selectAssignmentForExams')}>Ver Exámenes</button>
                    {isHeadOfAssignment && (
                        <button onClick={handleValidateExamsClick}>Validar Examen</button>
                    )}
                </div>
                <div className="form-container">
                    {notification && <Notification message={notification.message} type={notification.type} />}

                    {activeForm === 'validateExams' && unvalidatedExams.length > 0 && (
                        <div className="list-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email del Profesor</th>
                                        <th>Nombre de la Asignatura</th>
                                        <th>Fecha</th>
                                        <th>Total preguntas</th>
                                        <th>Dificultad</th>
                                        <th>Cantidad de temas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unvalidatedExams.map((exam) => (
                                        <tr key={exam.id}>
                                            <td>{exam.professor?.email || 'Desconocido'}</td>
                                            <td>{exam.assignment?.name || 'Desconocido'}</td>
                                            <td>{exam.date}</td>
                                            <td>{exam.totalQuestions}</td>
                                            <td>{exam.difficulty}</td>
                                            <td>{exam.topicLimit}</td>
                                            <td>
                                                <div className="button-group">
                                                    <button
                                                        className="validate-button"
                                                        onClick={() => handleExamValidation(exam.id, true)}
                                                    >
                                                        <i className="fa fa-check" aria-hidden="true"></i>
                                                    </button>
                                                    <button
                                                        className="deny-button"
                                                        onClick={() => handleExamValidation(exam.id, false)}
                                                    >
                                                        <i className="fa fa-times" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeForm === 'addQuestion' && (
                        <form className="custom-form" onSubmit={handleSubmit}>
                            <h2>Añadir Pregunta</h2>
                            <div className="form-group">
                                <label className="custom-label">Texto de la Pregunta:</label>
                                <textarea
                                    name="questionText"
                                    className="custom-textarea"
                                    value={formData.questionText}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="custom-label">Tema:</label>
                                <select
                                    name="topicId"
                                    className="custom-select"
                                    value={formData.topicId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecciona un tema</option>
                                    {topics.map((topic: { id: number; name: string }) => (
                                        <option key={topic.id} value={topic.id}>
                                            {topic.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="custom-label">Dificultad:</label>
                                <select
                                    name="difficulty"
                                    className="custom-select"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="1">Fácil</option>
                                    <option value="2">Media</option>
                                    <option value="3">Difícil</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="custom-label">Tipo:</label>
                                <select
                                    name="type"
                                    className="custom-select"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecciona un tipo</option>
                                    <option value="MultipleChoice">Opción Múltiple</option>
                                    <option value="TrueFalse">Verdadero/Falso</option>
                                    <option value="Essay">Ensayo</option>
                                </select>
                            </div>
                            <button type="submit" className="submit-button">
                                Enviar Pregunta
                            </button>
                        </form>
                    )}
                    {activeForm === 'viewQuestions' && (
                        <div className="list-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email del Profesor</th>
                                        <th>Texto de la Pregunta</th>
                                        <th>Dificultad</th>
                                        <th>Tipo</th>
                                        <th>Tema</th>
                                        <th>Ver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((question: any) => (
                                        <tr key={question.id}>
                                            <td>{question.professor?.email || 'Desconocido'}</td>
                                            <td>{question.questionText}</td>
                                            <td>{question.difficulty}</td>
                                            <td>{question.type}</td>
                                            <td>{question.topic?.name || 'Desconocido'}</td>
                                            <td>
                                                <button
                                                    style={{ backgroundColor: '#ADD8E6', border: 'none', padding: '0.5rem', borderRadius: '4px' }}
                                                    onClick={() => openQuestionModal(question)}
                                                >
                                                    <i className="fa fa-book" aria-hidden="true"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {showQuestionModal && selectedQuestion && (
                        <div className="modal" style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}>
                            <div className="modal-content" style={{
                                background: '#fff',
                                padding: '2rem',
                                borderRadius: '8px',
                                maxWidth: '600px',
                                width: '90%'
                            }}>
                                <h2>Pregunta</h2>
                                <p>{selectedQuestion.questionText}</p>
                                <button onClick={closeQuestionModal}>Cerrar</button>
                            </div>
                        </div>
                    )}

                    {activeForm === 'viewExams' && (
                        <div className="list-container">
                            <h2>Ver Exámenes</h2>
                            {exams.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Email del Profesor</th>
                                            <th>Fecha</th>
                                            <th>Total preguntas</th>
                                            <th>Dificultad</th>
                                            <th>Cantidad de temas</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.map((exam: {
                                            id: number,
                                            name: string,
                                            date: string,
                                            totalQuestions: number,
                                            difficulty: number,
                                            topicLimit: number,
                                            state?: string
                                        }) => (
                                            <tr key={exam.id}>
                                                <td>{exam.professor?.email || 'Desconocido'}</td>
                                                <td>{exam.date}</td>
                                                <td>{exam.totalQuestions}</td>
                                                <td>{exam.difficulty}</td>
                                                <td>{exam.topicLimit}</td>
                                                <td>{exam.state || 'Sin definir'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay exámenes disponibles.</p>
                            )}
                        </div>
                    )}
                    {activeForm === 'selectAssignmentForExams' && (
                        <div className="list-container">
                            <h2>Ver Exámenes de una Asignatura</h2>
                            {assignments.length > 0 ? (
                                <ul>
                                    {assignments.map((assignment: { id: number; name: string }) => (
                                        <li key={assignment.id}>
                                            <button onClick={() => handleViewExamsSelect(assignment.id)}>
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
                    {activeForm === 'selectAssignment' && (
                        <div className="list-container">
                            <h2>Crear Exámenes de una Asignatura</h2>
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
                            <button
                                type="button"
                                onClick={() => setActiveForm('selectAssignment')}
                                className="back-button"
                            >
                                ←
                            </button>
                            {examData.map((block, index) => (
                                <div key={index} className="exam-block">
                                    <label className="custom-label">Tema:</label>
                                    <select
                                        name="topicId"
                                        value={block.topicId}
                                        onChange={(e) => handleExamInputChange(index, e)}
                                        required
                                    >
                                        <option value="">Selecciona un tema</option>
                                        {topics.map((topic: { id: number, name: string }) => (
                                            <option key={topic.id} value={topic.id}>
                                                {topic.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="custom-label">Dificultad:</label>
                                    <select
                                        name="difficulty"
                                        value={block.difficulty}
                                        onChange={(e) => handleExamInputChange(index, e)}
                                        required
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="1">Fácil</option>
                                        <option value="2">Media</option>
                                        <option value="3">Difícil</option>
                                    </select>
                                </div>
                            ))}
                            <button type="submit" className="submit-button">
                                Crear Examen
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfessorPage;
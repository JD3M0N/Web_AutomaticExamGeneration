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
import { updateQuestion } from '../utils/crudQuestion';

const ProfessorPage = () => {
    const token = localStorage.getItem('token');
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
            const validationData = {
                examId: examId,
                professorId: professorId, // Asegúrate de que este valor ya esté definido en el componente
                observations: "",
                validationDate: new Date().toISOString(),
                validationState: isValid
            };

            const response = await fetch(`http://localhost:5024/api/Validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(validationData)
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

    // Decodificar el token y obtener el professorId y isHeadOfAssignment
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded: any = jwtDecode(token);
                console.log('Valor de IsHeadOfAssignment:', decoded.IsHeadOfAssignment);
                console.log('Tipo de IsHeadOfAssignment:', typeof decoded.IsHeadOfAssignment);
                console.log('Token decodificado:', decoded);
                if (decoded.professorId) {
                    setProfessorId(decoded.professorId);
                    // Asignar isHeadOfAssignment dependiendo del tipo de dato
                    if (typeof decoded.IsHeadOfAssignment === 'string') {
                        setIsHeadOfAssignment(decoded.IsHeadOfAssignment.toLowerCase() === "true");
                    } else {
                        setIsHeadOfAssignment(decoded.IsHeadOfAssignment);
                    }
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
    //------------------Modal para visualizar examens
    // Agrega nuevos estados para las preguntas del examen y el modal, por ejemplo:
    const [examQuestions, setExamQuestions] = useState<any[]>([]);
    const [showExamModal, setShowExamModal] = useState(false);

    // Función para abrir el modal y obtener las preguntas del examen desde el endpoint
    const openExamModal = async (examId: number) => {
        try {
            const response = await fetch(`http://localhost:5024/api/Belong/exam/${examId}/questions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const questions = data.$values || [];
                setExamQuestions(questions);
                setShowExamModal(true);
            } else {
                throw new Error('Error al obtener las preguntas del examen.');
            }
        } catch (error) {
            console.error('Error fetching exam questions:', error);
        }
    };

    // Función para cerrar el modal
    const closeExamModal = () => {
        setShowExamModal(false);
        setExamQuestions([]);
    };

    // Agrega nuevos estados al inicio del componente
    const [reviewableExams, setReviewableExams] = useState<any[]>([]);
    const [selectedExamToGrade, setSelectedExamToGrade] = useState<number | null>(null);
    const [examResponses, setExamResponses] = useState<any[]>([]);
    const [showGradeModal, setShowGradeModal] = useState(false);

    // Función para obtener los exámenes revisables
    const handleFetchReviewableExams = async () => {
        try {
            const response = await fetch(
                `http://localhost:5024/api/Professor/${professorId}/reviewable-exams`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                const exams: any[] = data.$values || [];
                // Para cada examen, se consulta el endpoint para obtener el nombre de la asignatura
                const updatedExams = await Promise.all(
                    exams.map(async (exam) => {
                        if (exam.assignmentId && !exam.assignmentName) {
                            try {
                                const assignResponse = await fetch(
                                    `http://localhost:5024/api/Assignment/${exam.assignmentId}`,
                                    {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                        },
                                    }
                                );
                                if (assignResponse.ok) {
                                    const assignData = await assignResponse.json();
                                    // Ajusta el nombre del campo según la respuesta de la API.
                                    exam.assignmentName = assignData.name || assignData.assignmentName;
                                }
                            } catch (error) {
                                console.error('Error fetching assignment:', error);
                            }
                        }
                        return exam;
                    })
                );
                setReviewableExams(updatedExams);
            } else {
                console.error('Error al obtener los exámenes para calificar');
            }
        } catch (error) {
            console.error('Error fetching reviewable exams:', error);
        }
    };

    // Usa un efecto para cargar los exámenes cuando se active el formulario 'gradeExams'
    useEffect(() => {
        if (activeForm === 'gradeExams') {
            handleFetchReviewableExams();
        }
    }, [activeForm]);

    // Función para abrir el modal de calificación de examenes
    const handleOpenGradeModal = async (examId: number) => {
        try {
            // Suponiendo que existe un endpoint para obtener las respuestas del examen,
            // ajusta la URL según corresponda.
            const response = await fetch(
                `http://localhost:5024/api/Exam/${examId}/responses`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setExamResponses(data.$values || []);
                setSelectedExamToGrade(examId);
                setShowGradeModal(true);
            } else {
                console.error('Error al obtener las respuestas del examen');
            }
        } catch (error) {
            console.error('Error fetching exam responses:', error);
        }
    };

    const [myQuestions, setMyQuestions] = useState<any[]>([]);
    const [selectedQuestionForUpdate, setSelectedQuestionForUpdate] = useState<any>(null);
    const [showUpdateQuestionModal, setShowUpdateQuestionModal] = useState(false);

    // Función para obtener las preguntas creadas por el profesor logueado
    // Función para obtener las preguntas creadas por el profesor logueado
    const handleFetchMyQuestions = async () => {
        try {
            const response = await fetch(
                `http://localhost:5024/api/Question/professor/${professorId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                const questions: any[] = data.$values || [];
                // Enriquecer cada pregunta con el nombre del tema
                const enrichedQuestions = await Promise.all(
                    questions.map(async (question) => {
                        if (question.topicId) {
                            try {
                                const topicResponse = await fetch(
                                    `http://localhost:5024/api/Topic/${question.topicId}`,
                                    {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    }
                                );
                                if (topicResponse.ok) {
                                    const topicData = await topicResponse.json();
                                    question.topic = topicData;
                                }
                            } catch (error) {
                                console.error('Error fetching topic:', error);
                            }
                        }
                        return question;
                    })
                );
                setMyQuestions(enrichedQuestions);
            } else {
                console.error('Error al obtener las preguntas del profesor');
            }
        } catch (error) {
            console.error('Error fetching my questions:', error);
        }
    };

    // Efecto para cargar las preguntas cuando se activa el formulario 'myQuestions'
    useEffect(() => {
        if (activeForm === 'myQuestions') {
            handleFetchMyQuestions();
        }
    }, [activeForm]);

    // Función para abrir el modal de actualización de preguntas
    const openUpdateQuestionModal = (question: any) => {
        setSelectedQuestionForUpdate(question);
        setShowUpdateQuestionModal(true);
    };

    // Función para manejar los cambios en los inputs del formulario de actualización
    const handleUpdateQuestionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedQuestionForUpdate({ ...selectedQuestionForUpdate, [name]: value });
    };


    const handleUpdateQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!professorId) {
            console.error("Error: El professorId es nulo o no está definido.");
            alert("No se pudo identificar al profesor. Intenta iniciar sesión nuevamente.");
            return;
        }
        console.log("Actualizando pregunta:", selectedQuestionForUpdate);
    
        // Clonar la pregunta y eliminar propiedades innecesarias
        const questionToUpdate = { ...selectedQuestionForUpdate };
        delete questionToUpdate.professor;
        delete questionToUpdate.exams;
        delete questionToUpdate.belongs;
        delete questionToUpdate.enters;
    
        await updateQuestion(
            selectedQuestionForUpdate.id,
            questionToUpdate,
            handleFetchMyQuestions,
            setNotification
        );
    };




    return (
        <div className="professor-page">
            <ProfessorNavbar />
            <div className="professor-content">
                <div className="sidebar">
                    <button onClick={() => setActiveForm('addQuestion')}>Añadir Pregunta</button>
                    <button onClick={() => setActiveForm('viewQuestions')}>Ver Preguntas</button>
                    <button onClick={() => setActiveForm('myQuestions')}>Mis Preguntas</button>
                    <button onClick={() => setActiveForm('selectAssignment')}>Crear Examen</button>
                    <button onClick={() => setActiveForm('selectAssignmentForExams')}>Ver Exámenes</button>
                    <button onClick={() => setActiveForm('gradeExams')}>Calificar Exámenes</button>
                    {(() => {
                        if (isHeadOfAssignment) {
                            return <button onClick={handleValidateExamsClick}>Validar Examen</button>;
                        }
                        return null;
                    })()}
                </div>
                <div className="form-container">
                    {notification && <Notification message={notification.message} type={notification.type} />}
                    {activeForm === 'myQuestions' && (
                        <div className="list-container">
                            <h2>Mis Preguntas</h2>
                            {myQuestions.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Texto de la Pregunta</th>
                                            <th>Dificultad</th>
                                            <th>Tipo</th>
                                            <th>Tema</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myQuestions.map((question: any) => (
                                            <tr key={question.id}>
                                                <td>{question.id}</td>
                                                <td>{question.questionText}</td>
                                                <td>{question.difficulty}</td>
                                                <td>{question.type}</td>
                                                <td>{question.topic?.name || 'Desconocido'}</td>
                                                <td>
                                                    <button onClick={() => openUpdateQuestionModal(question)}>
                                                        Modificar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No has creado ninguna pregunta.</p>
                            )}
                        </div>
                    )}

                    {showUpdateQuestionModal && selectedQuestionForUpdate && (
                        <div
                            className="modal"
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000,
                            }}
                        >
                            <div
                                className="modal-content"
                                style={{
                                    background: '#fff',
                                    padding: '2rem',
                                    borderRadius: '8px',
                                    maxWidth: '600px',
                                    width: '90%',
                                }}
                            >
                                <h2>Modificar Pregunta {selectedQuestionForUpdate.id}</h2>
                                <form onSubmit={handleUpdateQuestionSubmit}>
                                    <div>
                                        <label>Texto de la Pregunta:</label>
                                        <textarea
                                            name="questionText"
                                            value={selectedQuestionForUpdate.questionText}
                                            onChange={handleUpdateQuestionInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Dificultad:</label>
                                        <input
                                            type="number"
                                            name="difficulty"
                                            value={selectedQuestionForUpdate.difficulty}
                                            onChange={handleUpdateQuestionInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Tipo:</label>
                                        <select
                                            name="type"
                                            value={selectedQuestionForUpdate.type}
                                            onChange={handleUpdateQuestionInputChange}
                                            required
                                        >
                                            <option value="">Selecciona un tipo</option>
                                            <option value="MultipleChoice">Opción Múltiple</option>
                                            <option value="TrueFalse">Verdadero/Falso</option>
                                            <option value="Essay">Ensayo</option>
                                        </select>
                                    </div>
                                    {/* Agrega más campos si fuese necesario, p.ej. el tema */}
                                    <button type="submit">Guardar Cambios</button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUpdateQuestionModal(false);
                                            setSelectedQuestionForUpdate(null);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                    {activeForm === 'gradeExams' && (
                        <div className="list-container">
                            <h2>Exámenes para calificar</h2>
                            {reviewableExams.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID Examen</th>
                                            <th>Asignatura</th>
                                            <th>Fecha</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviewableExams.map((exam: any) => (
                                            <tr key={exam.id}>
                                                <td>{exam.id}</td>
                                                <td>{exam.assignmentName || exam.assignment?.name}</td>
                                                <td>{new Date(exam.date).toLocaleDateString()}</td>
                                                <td>
                                                    <button onClick={() => handleOpenGradeModal(exam.id)}>
                                                        Calificar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay exámenes para calificar.</p>
                            )}
                        </div>
                    )}

                    {showGradeModal && (
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
                                <h2>Respuestas del Examen {selectedExamToGrade}</h2>
                                <ul>
                                    {examResponses.map((resp: any) => (
                                        <li key={resp.questionId}>
                                            <strong>{resp.questionText}</strong>: {resp.answer}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => {
                                    setShowGradeModal(false);
                                    setExamResponses([]);
                                    setSelectedExamToGrade(null);
                                }}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
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
                                            <th>Ver</th>
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
                                            state?: string,
                                            professor?: { email: string }
                                        }) => (
                                            <tr key={exam.id}>
                                                <td>{exam.professor?.email || 'Desconocido'}</td>
                                                <td>{exam.date}</td>
                                                <td>{exam.totalQuestions}</td>
                                                <td>{exam.difficulty}</td>
                                                <td>{exam.topicLimit}</td>
                                                <td>{exam.state || 'Sin definir'}</td>
                                                <td>
                                                    <button
                                                        style={{
                                                            backgroundColor: '#ADD8E6',
                                                            border: 'none',
                                                            padding: '0.5rem',
                                                            borderRadius: '4px'
                                                        }}
                                                        onClick={() => openExamModal(exam.id)}
                                                    >
                                                        <i className="fa fa-book" aria-hidden="true"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay exámenes disponibles.</p>
                            )}
                        </div>
                    )}

                    {showExamModal && examQuestions.length > 0 && (
                        <div
                            className="modal"
                            style={{
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
                            }}
                        >
                            <div
                                className="modal-content"
                                style={{
                                    background: '#fff',
                                    padding: '2rem',
                                    borderRadius: '8px',
                                    maxWidth: '600px',
                                    width: '90%'
                                }}
                            >
                                <h2>Preguntas del Examen</h2>
                                <ul>
                                    {examQuestions.map((question: any) => (
                                        <li key={question.id}>
                                            <strong>{question.type}:</strong> {question.questionText} - Dificultad: {question.difficulty}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={closeExamModal}>Cerrar</button>
                            </div>
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
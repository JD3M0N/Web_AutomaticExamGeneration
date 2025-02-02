import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import ProfessorNavbar from '../components/ProfessorNavbar';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { fetchProfessorTopics } from '../utils/crudTopic';
import { fetchQuestions } from '../utils/crudQuestion';
import { fetchExams } from '../utils/crudExam';
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
            const selectedQuestions = [];
            for (const block of examData) {
                if (block.topicId && block.difficulty) {
                    const filteredQuestions = questions.filter(
                        (q: { topicId: number; difficulty: number }) =>
                            q.topicId === parseInt(block.topicId) && q.difficulty === parseInt(block.difficulty)
                    );
                    if (filteredQuestions.length > 0) {
                        const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
                        selectedQuestions.push(randomQuestion);
                    }
                }
            }

            if (selectedQuestions.length < 3) {
                alert('No se encontraron suficientes preguntas para los criterios seleccionados.');
                return;
            }

            console.log('Preguntas seleccionadas para el examen:', selectedQuestions);
            alert('Examen creado exitosamente.');
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

    return (
        <div className="professor-page">
            <ProfessorNavbar />
            <div className="professor-content">
                <div className="sidebar">
                    <button onClick={() => setActiveForm('addQuestion')}>Añadir Pregunta</button>
                    <button onClick={() => setActiveForm('viewQuestions')}>Ver Preguntas</button>
                    <button onClick={() => setActiveForm('createExam')}>Crear Examen</button>
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
                            <h2>Ver Preguntas</h2>
                            {questions.length > 0 ? (
                                <ul>
                                    {questions.map((question: { id: number, questionText: string, difficulty: number, type: string, topicId: number }) => (
                                        <li key={question.id}>
                                            <span>{question.questionText}</span>
                                            <span>{question.difficulty}</span>
                                            <span>{question.type}</span>
                                            <span>{getTopicName(question.topicId)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay preguntas disponibles.</p>
                            )}
                        </div>
                    )}

                    {activeForm === 'viewExams' && (
                        <div className="list-container">
                            <h2>Ver Exámenes</h2>
                            {exams.length > 0 ? (
                                <ul>
                                    {exams.map((exam: { id: number, name: string, date: string }) => (
                                        <li key={exam.id}>
                                            <span>{exam.name}</span>
                                            <span>{exam.date}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay exámenes disponibles.</p>
                            )}
                        </div>
                    )}

                    {activeForm === 'createExam' && (
                        <form onSubmit={handleExamSubmit} className="professor-form">
                            <h2>Crear Examen</h2>
                            {examData.map((block, index) => (
                                <div key={index}>
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
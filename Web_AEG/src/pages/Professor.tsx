import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import ProfessorNavbar from '../components/ProfessorNavbar';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { fetchTopics } from '../utils/crudTopic';
import { fetchQuestions } from '../utils/crudQuestion';
import '../css/professor.css';

const ProfessorPage = () => {
    const [activeForm, setActiveForm] = useState('');
    const [professorId, setProfessorId] = useState<number | null>(null); // Estado para almacenar el ID del profesor
    const [isHeadOfAssignment, setIsHeadOfAssignment] = useState(false); // Estado para almacenar si es líder de asignatura
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        difficulty: '',
        type: '',
        questionText: '',
        topicId: '',
    });
    const [topics, setTopics] = useState([]); // Estado para almacenar los temas disponibles
    const [questions, setQuestions] = useState([]); // Estado para almacenar las preguntas disponibles

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

    // Obtener los temas desde la base de datos
    useEffect(() => {
        fetchTopics(setTopics, setNotification);
    }, []);

    // Obtener las preguntas cuando se selecciona "viewQuestions"
    useEffect(() => {
        if (activeForm === 'viewQuestions') {
            fetchQuestions(setQuestions, setNotification);
        }
    }, [activeForm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!professorId) {
            alert('No se pudo identificar al profesor. Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5024/api/Question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Envía el token en el encabezado
                },
                body: JSON.stringify({
                    difficulty: parseInt(formData.difficulty),
                    type: formData.type,
                    questionText: formData.questionText,
                    topicId: parseInt(formData.topicId),
                    professorId: professorId, // Usa el ID del profesor extraído del token
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

    return (
        <div className="professor-page">
            <ProfessorNavbar />
            <div className="professor-content">
                <div className="sidebar">
                    <button onClick={() => setActiveForm('addQuestion')}>Añadir Pregunta</button>
                    <button onClick={() => setActiveForm('viewQuestions')}>Ver Preguntas</button>
                    <button onClick={() => setActiveForm('editProfile')}>Editar Perfil</button>
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
                                <textarea
                                    name="questionText"
                                    value={formData.questionText}
                                    onChange={handleInputChange}
                                    required
                                />
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
                                    {questions.map((question: { id: number, questionText: string, difficulty: number, type: string }) => (
                                        <li key={question.id}>
                                            <span>{question.questionText}</span>
                                            <span>{question.difficulty}</span>
                                            <span>{question.type}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay preguntas disponibles.</p>
                            )}
                        </div>
                    )}
                    {activeForm === 'editProfile' && (
                        <div>
                            <h2>Editar Perfil</h2>
                            {/* Aquí puedes agregar la lógica para editar el perfil */}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfessorPage;
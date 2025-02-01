import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProfessorNavbar from '../components/ProfessorNavbar';
import Footer from '../components/Footer';
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
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await fetch('http://localhost:5024/api/Topic');
            if (response.ok) {
                const data = await response.json();
                const topics = data.$values; // Extrae los valores relevantes
                console.log('Temas obtenidos:', topics); // Verifica los datos obtenidos
                setTopics(topics);
            } else {
                const errorData = await response.json();
                console.error('Error al obtener los temas:', errorData);
                setNotification({ message: errorData.message || 'Error al obtener los temas.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

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
            <ProfessorNavbar/>
            <div className="professor-content">
                <div className="sidebar">
                    <button onClick={() => setActiveForm('addQuestion')}>Añadir Pregunta</button>
                    <button onClick={() => setActiveForm('viewQuestions')}>Ver Preguntas</button>
                    <button onClick={() => setActiveForm('editProfile')}>Editar Perfil</button>
                </div>
                <div className="form-container">
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
                        <div>
                            <h2>Ver Preguntas</h2>
                            {/* Aquí puedes agregar la lógica para mostrar las preguntas */}
                        </div>
                    )}
                    {activeForm === 'editProfile' && (
                        <div>
                            <h2>Editar Perfil</h2>
                            {/* Aquí puedes agregar la lógica para editar el perfil */}
                        </div>
                    )}
                    {isHeadOfAssignment && (
                        <button onClick={() => window.location.href = '/endpoint'}>Acceder al Endpoint</button>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfessorPage;
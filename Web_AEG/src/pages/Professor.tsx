import React, { useState } from 'react';

const ProfessorPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        difficulty: '',
        type: '',
        questionText: '',
        topicId: '',
        professorId: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5024/api/Question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    difficulty: parseInt(formData.difficulty),
                    type: formData.type,
                    questionText: formData.questionText,
                    topicId: parseInt(formData.topicId),
                    professorId: parseInt(formData.professorId),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            alert('Pregunta añadida exitosamente');
            setShowForm(false); // Cierra el formulario después de enviarlo
            setFormData({
                difficulty: '',
                type: '',
                questionText: '',
                topicId: '',
                professorId: '',
            });
        } catch (error) {
            console.error('Error al enviar la pregunta:', error);
            alert('Hubo un error al intentar enviar la pregunta.');
        }
    };

    return (
        <div>
            <h1>Professor Dashboard</h1>
            <p>Bienvenido al panel de profesores.</p>
            <button onClick={() => setShowForm(true)}>Añadir Pregunta</button>

            {showForm && (
                <div>
                    <h2>Formulario para Añadir Pregunta</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Dificultad:
                            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} required>
                                <option value="">Selecciona una opción</option>
                                <option value="1">Fácil</option>
                                <option value="2">Media</option>
                                <option value="3">Difícil</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            Tipo:
                            <select name="type" value={formData.type} onChange={handleInputChange} required>
                                <option value="">Selecciona un tipo</option>
                                <option value="MultipleChoice">Opción Múltiple</option>
                                <option value="TrueFalse">Verdadero/Falso</option>
                                <option value="Essay">Ensayo</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            Texto de la Pregunta:
                            <textarea
                                name="questionText"
                                value={formData.questionText}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            ID del Tema:
                            <input
                                type="number"
                                name="topicId"
                                value={formData.topicId}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            ID del Profesor:
                            <input
                                type="number"
                                name="professorId"
                                value={formData.professorId}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <br />
                        <button type="submit">Enviar Pregunta</button>
                        <button type="button" onClick={() => setShowForm(false)}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfessorPage;

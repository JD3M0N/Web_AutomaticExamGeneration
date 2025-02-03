export const fetchQuestions = async (professorId: number, setQuestions: Function, setNotification: Function) => {
    try {
        const response = await fetch('http://localhost:5024/api/Question', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }

        const data = await response.json();
        const questionsArray = data.$values || [];

        // Enriquecer las preguntas con información del profesor y del tema
        const enrichedQuestions = await Promise.all(
            questionsArray.map(async (question: any) => {
                try {
                    // Obtener información del profesor
                    const profResponse = await fetch(`http://localhost:5024/api/Professor/${question.professorId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (profResponse.ok) {
                        const professorData = await profResponse.json();
                        question.professor = professorData;
                    }

                    // Obtener información del tema
                    const topicResponse = await fetch(`http://localhost:5024/api/Topic/${question.topicId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (topicResponse.ok) {
                        const topicData = await topicResponse.json();
                        question.topic = topicData;
                    }
                } catch (error) {
                    console.error('Error al obtener detalles:', error);
                }
                return question;
            })
        );

        setQuestions(enrichedQuestions);
    } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        setNotification({ message: 'Error al obtener las preguntas.', type: 'error' });
    }
};

export const updateQuestion = async (
    id: number,
    questionData: { 
        questionText?: string;
        difficulty?: number;
        type?: string;
        topicId?: number;
    },
    fetchQuestions: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        // Asegúrate de extraer solo los datos que se deben actualizar,
        // evitando propiedades de metadatos como "$id", "$values", "professor", "exams", etc.
        const payload = {
            questionText: questionData.questionText,
            difficulty: questionData.difficulty,
            type: questionData.type,
            topicId: questionData.topicId,
        };

        const response = await fetch(`http://localhost:5024/api/Question/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Pregunta actualizada:', data);
            fetchQuestions(); // Actualiza la lista de preguntas
            setNotification({ message: 'Pregunta actualizada exitosamente.', type: 'success' });
        } else {
            const errorData = await response.json();
            console.error('Error al actualizar la pregunta:', errorData);
            setNotification({ message: errorData.message || 'Error al actualizar la pregunta.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};
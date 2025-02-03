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
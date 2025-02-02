export const fetchQuestions = async (professorId: number, setQuestions: Function, setNotification: Function) => {
    try {
        const response = await fetch(`http://localhost:5024/api/Question`, {
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

        // Verifica si los datos están encapsulados en $values
        const questionsArray = data.$values || []; 

        console.log("Preguntas obtenidas:", questionsArray); // Para depuración
        setQuestions(questionsArray);
    } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        setNotification({ message: 'Error al obtener las preguntas.', type: 'error' });
    }
};

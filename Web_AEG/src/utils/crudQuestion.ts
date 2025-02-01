export const fetchQuestions = async (
    setQuestions: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch('http://localhost:5024/api/Question', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Envía el token en el encabezado
            },
        });
        if (response.ok) {
            const data = await response.json();
            setQuestions(data);
        } else {
            const errorData = await response.json();
            setNotification({ message: errorData.message || 'Error al obtener las preguntas.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};
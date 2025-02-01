   // src/utils/crudTopic.ts

export const handleNewTopicInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setNewTopicData: React.Dispatch<React.SetStateAction<{ name: string; assignmentId: string }>>,
    newTopicData: { name: string; assignmentId: string }
) => {
    const { name, value } = e.target;
    setNewTopicData({ ...newTopicData, [name]: value });
};

export const fetchTopics = async (
    setTopics: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification?: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
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
            if (setNotification) {
                setNotification({ message: errorData.message || 'Error al obtener los temas.', type: 'error' });
            }
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        if (setNotification) {
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    }
};

export const handleAddTopicSubmit = async (
    e: React.FormEvent,
    newTopicData: { name: string; assignmentId: string },
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>,
    fetchTopics: () => void,
    setNewTopicData: React.Dispatch<React.SetStateAction<{ name: string; assignmentId: string }>>,
    setShowAddTopicModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
    e.preventDefault();
    const endpoint = 'http://localhost:5024/api/Topic';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTopicData),
        });

        if (response.ok) {
            setNotification({ message: 'Topic añadido exitosamente.', type: 'success' });
            setNewTopicData({ name: '', assignmentId: '' });
            fetchTopics();
            setShowAddTopicModal(false);
        } else {
            const errorData = await response.json();
            setNotification({ message: errorData.message || 'Error al añadir el topic.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const deleteTopic = async (
    id: number,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>,
    fetchTopics: () => void
) => {
    try {
        console.log('Eliminando tema con ID:', id);
        const response = await fetch(`http://localhost:5024/api/Topic/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('Tema eliminado exitosamente');
            setNotification({ message: 'Tema eliminado exitosamente.', type: 'success' });
            fetchTopics();
        } else {
            const errorData = await response.json();
            console.error('Error al eliminar el tema:', errorData);
            setNotification({ message: errorData.message || 'Error al eliminar el tema.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};
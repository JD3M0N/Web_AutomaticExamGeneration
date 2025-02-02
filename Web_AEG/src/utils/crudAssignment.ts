export const handleNewAssignmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setNewAssignmentData: React.Dispatch<React.SetStateAction<{ name: string; studyProgram: string; email: string }>>,
    newAssignmentData: { name: string; studyProgram: string; email: string }
) => {
    const { name, value } = e.target;
    setNewAssignmentData({ ...newAssignmentData, [name]: value });
};

export const handleAddAssignmentSubmit = async (
    e: React.FormEvent,
    newAssignmentData: { name: string; studyProgram: string; email: string },
    setShowAddAssignmentModal: React.Dispatch<React.SetStateAction<boolean>>,
    setNewAssignmentData: React.Dispatch<React.SetStateAction<{ name: string; studyProgram: string; email: string }>>,
    fetchAssignments: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    e.preventDefault();
    try {
        await addAssignment(newAssignmentData, fetchAssignments, setNotification);
        setShowAddAssignmentModal(false);
        setNewAssignmentData({
            name: '',
            studyProgram: '',
            email: '',
        });
    } catch (error: any) {
        setNotification({ message: error.message, type: 'error' });
    }
};

export const addAssignment = async (
    assignmentData: { name: string; studyProgram: string; email: string },
    fetchAssignments: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch('http://localhost:5024/api/Assignment/add-with-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignmentData),
        });

        if (response.ok) {
            try {
                const data = await response.json();
                console.log('Asignatura añadida:', data); // Verifica los datos obtenidos
                fetchAssignments(); // Actualiza la lista de asignaturas
                setNotification({ message: 'Asignatura añadida exitosamente.', type: 'success' });
            } catch (error) {
                console.log('Asignatura añadida, pero la respuesta no es JSON.');
                fetchAssignments(); // Actualiza la lista de asignaturas
                setNotification({ message: 'Asignatura añadida exitosamente.', type: 'success' });
            }
        } else {
            const errorData = await response.json();
            console.error('Error al añadir la asignatura:', errorData);
            setNotification({ message: errorData.message || 'Error al añadir la asignatura.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const fetchAssignments = async (
    setAssignments: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>,
    setActiveForm: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const response = await fetch('http://localhost:5024/api/Assignment');
        if (response.ok) {
            const data = await response.json();
            const assignments = data.$values; // Extrae los valores relevantes
            console.log('Asignaturas obtenidas:', assignments); // Verifica los datos obtenidos
            setAssignments(assignments);
            setActiveForm('viewAssignments'); // Cambia el estado para mostrar la lista de asignaturas
        } else {
            const errorData = await response.json();
            console.error('Error al obtener las asignaturas:', errorData);
            setNotification({ message: errorData.message || 'Error al obtener las asignaturas.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const fetchAssignmentsByProfessor = async (
    professorId: number,
    setAssignments: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch(`http://localhost:5024/api/Teach/professor/${professorId}/assignments`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            const assignments = data.$values.map((item: any) => ({
                id: item.assignmentId,
                name: item.assignmentName,
            })); // Extrae los valores relevantes
            console.log('Asignaturas obtenidas:', assignments); // Verifica los datos obtenidos
            setAssignments(assignments);
        } else {
            const errorData = await response.json();
            console.error('Error al obtener las asignaturas:', errorData);
            setNotification({ message: errorData.message || 'Error al obtener las asignaturas.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const deleteAssignment = async (
    id: number,
    fetchAssignments: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch(`http://localhost:5024/api/Assignment/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('Asignatura eliminada'); // Verifica la eliminación
            fetchAssignments(); // Actualiza la lista de asignaturas
            setNotification({ message: 'Asignatura eliminada exitosamente.', type: 'success' });
        } else {
            const errorData = await response.json();
            console.error('Error al eliminar la asignatura:', errorData);
            setNotification({ message: errorData.message || 'Error al eliminar la asignatura.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};
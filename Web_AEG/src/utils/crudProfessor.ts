// src/utils/crudProfessor.ts

export const handleNewProfessorInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setNewProfessorData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; specialization: string }>>,
    newProfessorData: { name: string; email: string; password: string; specialization: string }
) => {
    const { name, value } = e.target;
    setNewProfessorData({ ...newProfessorData, [name]: value });
};

export const handleAddProfessorSubmit = async (
    e: React.FormEvent,
    newProfessorData: { name: string; email: string; password: string; specialization: string },
    setShowAddProfessorModal: React.Dispatch<React.SetStateAction<boolean>>,
    setNewProfessorData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; specialization: string }>>,
    fetchProfessors: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    e.preventDefault();
    try {
        await addProfessor(newProfessorData, fetchProfessors, setNotification);
        setShowAddProfessorModal(false);
        setNewProfessorData({
            name: '',
            email: '',
            password: '',
            specialization: '',
        });
    } catch (error: any) {
        setNotification({ message: error.message, type: 'error' });
    }
};

export const handleUpdateProfessorInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUpdateProfessorData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; specialization: string }>>,
    updateProfessorData: { name: string; email: string; password: string; specialization: string }
) => {
    const { name, value } = e.target;
    setUpdateProfessorData({ ...updateProfessorData, [name]: value });
};

export const handleUpdateProfessorSubmit = async (
    e: React.FormEvent,
    currentProfessorId: number | null,
    updateProfessorData: { name: string; email: string; password: string; specialization: string },
    setShowUpdateProfessorModal: React.Dispatch<React.SetStateAction<boolean>>,
    setUpdateProfessorData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; specialization: string }>>,
    fetchProfessors: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    e.preventDefault();
    if (currentProfessorId !== null) {
        try {
            await updateProfessor(currentProfessorId, updateProfessorData, fetchProfessors, setNotification);
            setShowUpdateProfessorModal(false);
            setUpdateProfessorData({
                name: '',
                email: '',
                password: '',
                specialization: '',
            });
        } catch (error: any) {
            setNotification({ message: error.message, type: 'error' });
        }
    }
};

export const addProfessor = async (
    professorData: { name: string; email: string; password: string; specialization: string },
    fetchProfessors: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch('http://localhost:5024/api/Professor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(professorData),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Profesor añadido:', data); // Verifica los datos obtenidos
            fetchProfessors(); // Actualiza la lista de profesores
            setNotification({ message: 'Profesor añadido exitosamente.', type: 'success' });
        } else {
            const errorData = await response.json();
            console.error('Error al añadir el profesor:', errorData);
            setNotification({ message: errorData.message || 'Error al añadir el profesor.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const updateProfessor = async (
    id: number,
    professorData: { name?: string; email?: string; password?: string; specialization?: string },
    fetchProfessors: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch(`http://localhost:5024/api/Professor/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(professorData),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Profesor actualizado:', data); // Verifica los datos obtenidos
            fetchProfessors(); // Actualiza la lista de profesores
            setNotification({ message: 'Profesor actualizado exitosamente.', type: 'success' });
        } else {
            const errorData = await response.json();
            console.error('Error al actualizar el profesor:', errorData);
            setNotification({ message: errorData.message || 'Error al actualizar el profesor.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const fetchProfessors = async (
    setProfessors: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>,
    setActiveForm: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const response = await fetch('http://localhost:5024/api/Professor');
        if (response.ok) {
            const data = await response.json();
            const professors = data.$values; // Extrae los valores relevantes
            console.log('Profesores obtenidos:', professors); // Verifica los datos obtenidos
            setProfessors(professors);
            setActiveForm('viewProfessors'); // Cambia el estado para mostrar la lista de profesores
        } else {
            const errorData = await response.json();
            console.error('Error al obtener los profesores:', errorData);
            setNotification({ message: errorData.message || 'Error al obtener los profesores.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const deleteProfessor = async (
    id: number,
    fetchProfessors: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch(`http://localhost:5024/api/Professor/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('Profesor eliminado'); // Verifica la eliminación
            fetchProfessors(); // Actualiza la lista de profesores
            setNotification({ message: 'Profesor eliminado exitosamente.', type: 'success' });
        } else {
            const errorData = await response.json();
            console.error('Error al eliminar el profesor:', errorData);
            setNotification({ message: errorData.message || 'Error al eliminar el profesor.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};
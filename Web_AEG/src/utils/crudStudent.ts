// src/utils/crudStudent.ts

export const handleNewStudentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setNewStudentData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; age: number; grade: string }>>,
    newStudentData: { name: string; email: string; password: string; age: number; grade: string }
) => {
    const { name, value } = e.target;
    setNewStudentData({ ...newStudentData, [name]: value });
};

export const handleAddStudentSubmit = async (
    e: React.FormEvent,
    newStudentData: { name: string; email: string; password: string; age: number; grade: string },
    setShowAddStudentModal: React.Dispatch<React.SetStateAction<boolean>>,
    setNewStudentData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; age: number; grade: string }>>,
    fetchStudents: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    e.preventDefault();
    try {
        await addStudent(newStudentData, fetchStudents, setNotification);
        setShowAddStudentModal(false);
        setNewStudentData({
            name: '',
            email: '',
            password: '',
            age: 0,
            grade: '',
        });
    } catch (error: any) {
        setNotification({ message: error.message, type: 'error' });
    }
};

export const handleUpdateStudentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUpdateStudentData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; age: number; grade: string }>>,
    updateStudentData: { name: string; email: string; password: string; age: number; grade: string }
) => {
    const { name, value } = e.target;
    setUpdateStudentData({ ...updateStudentData, [name]: value });
};

export const handleUpdateStudentSubmit = async (
    e: React.FormEvent,
    currentStudentId: number | null,
    updateStudentData: { name: string; email: string; password: string; age: number; grade: string },
    setShowUpdateStudentModal: React.Dispatch<React.SetStateAction<boolean>>,
    setUpdateStudentData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; age: number; grade: string }>>,
    fetchStudents: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    e.preventDefault();
    if (currentStudentId !== null) {
        try {
            await updateStudent(currentStudentId, updateStudentData, fetchStudents, setNotification);
            setShowUpdateStudentModal(false);
            setUpdateStudentData({
                name: '',
                email: '',
                password: '',
                age: 0,
                grade: '',
            });
        } catch (error: any) {
            setNotification({ message: error.message, type: 'error' });
        }
    }
};

export const fetchStudents = async (
    setStudents: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>,
    setActiveForm: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const response = await fetch('http://localhost:5024/api/Student', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            const students = data.$values; // Extrae los valores relevantes
            console.log('Estudiantes obtenidos:', students); // Verifica los datos obtenidos
            setStudents(students);
            setActiveForm('viewStudents'); // Cambia el estado para mostrar la lista de estudiantes
        } else {
            const errorData = await response.json();
            console.error('Error al obtener los estudiantes:', errorData);
            setNotification({ message: errorData.message || 'Error al obtener los estudiantes.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const addStudent = async (
    studentData: { name: string; email: string; password: string; age: number; grade: string },
    fetchStudents: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch('http://localhost:5024/api/Student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Estudiante añadido:', data); // Verifica los datos obtenidos
            fetchStudents(); // Actualiza la lista de estudiantes
            setNotification({ message: 'Estudiante añadido exitosamente.', type: 'success' });
        } else {
            const errorData = await response.json();
            console.error('Error al añadir el estudiante:', errorData);
            setNotification({ message: errorData.message || 'Error al añadir el estudiante.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const updateStudent = async (
    id: number,
    studentData: { name?: string; email?: string; password?: string; age?: number; grade?: string },
    fetchStudents: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch(`http://localhost:5024/api/Student/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Estudiante actualizado:', data); // Verifica los datos obtenidos
            fetchStudents(); // Actualiza la lista de estudiantes
            setNotification({ message: 'Estudiante actualizado exitosamente.', type: 'success' });
        } else {
            const errorData = await response.json();
            console.error('Error al actualizar el estudiante:', errorData);
            setNotification({ message: errorData.message || 'Error al actualizar el estudiante.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};

export const deleteStudent = async (
    id: number,
    fetchStudents: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch(`http://localhost:5024/api/Student/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('Estudiante eliminado'); // Verifica la eliminación
            fetchStudents(); // Actualiza la lista de estudiantes
            setNotification({ message: 'Estudiante eliminado exitosamente.', type: 'success' });
        } else {
            const errorData = await response.json();
            console.error('Error al eliminar el estudiante:', errorData);
            setNotification({ message: errorData.message || 'Error al eliminar el estudiante.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};
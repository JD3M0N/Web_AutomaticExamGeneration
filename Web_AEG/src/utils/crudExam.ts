// src/utils/crudExam.ts

export const fetchExams = async (
    professorId: number,
    setExams: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        const response = await fetch(`http://localhost:5024/api/Exam/professor/${professorId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            const exams = data.$values || []; // Extrae los valores relevantes
            console.log('Exámenes obtenidos:', exams); // Verifica los datos obtenidos
            setExams(exams);
        } else {
            const errorData = await response.json();
            console.error('Error al obtener los exámenes:', errorData);
            setNotification({ message: errorData.message || 'Error al obtener los exámenes.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};



export const fetchStudentAssignments = async (
    studentId: number,
    setAssignments: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    try {
        console.log(`Llamando al backend con studentId: ${studentId}`);

        const response = await fetch(`http://localhost:5024/api/Enroll/${studentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Respuesta del backend:', data);

            if (data.$values) {
                const assignments = data.$values
                    .filter((item: any) => !item.$ref) // Filtrar referencias circulares
                    .map((item: any) => ({
                        id: item.id,
                        name: item.name,
                    }));

                console.log('Asignaturas procesadas:', assignments);
                setAssignments(assignments);
            } else {
                console.warn('Estructura inesperada en la respuesta:', data);
                setAssignments([]);
            }
        } else {
            const errorData = await response.json();
            console.error('Error al obtener asignaturas:', errorData);
            setNotification({ message: errorData.message || 'Error al obtener las asignaturas.', type: 'error' });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
    }
};




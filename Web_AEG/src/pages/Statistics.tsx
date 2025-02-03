import React, { useEffect, useState } from 'react';

interface Exam {
    examId: number;
    professorName: string;
    creationDate: string;
    totalQuestions: number;
    difficulty: number;
    topicLimit: number;
    state: string;
}

const Statistics: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [assignmentId, setAssignmentId] = useState<number>(1); // ID de la asignatura por defecto
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExams();
    }, [assignmentId]);

    const fetchExams = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5024/api/Stats/exams-by-assignment/${assignmentId}`);
            if (!response.ok) throw new Error('Error al obtener los datos');

            const data: Exam[] = await response.json();
            setExams(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Estadísticas de Exámenes</h2>
            <label>
                ID de Asignatura:
                <input
                    type="number"
                    value={assignmentId}
                    onChange={(e) => setAssignmentId(Number(e.target.value))}
                    style={{ marginLeft: '1rem', padding: '0.5rem' }}
                />
            </label>
            <button onClick={fetchExams} style={{ marginLeft: '1rem', padding: '0.5rem' }}>Cargar</button>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table border={1} style={{ marginTop: '1rem', width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Profesor</th>
                        <th>Fecha de Creación</th>
                        <th>Total Preguntas</th>
                        <th>Dificultad</th>
                        <th>Límite de Temas</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam) => (
                        <tr key={exam.examId}>
                            <td>{exam.examId}</td>
                            <td>{exam.professorName}</td>
                            <td>{new Date(exam.creationDate).toLocaleDateString()}</td>
                            <td>{exam.totalQuestions}</td>
                            <td>{exam.difficulty}</td>
                            <td>{exam.topicLimit}</td>
                            <td>{exam.state}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Statistics;

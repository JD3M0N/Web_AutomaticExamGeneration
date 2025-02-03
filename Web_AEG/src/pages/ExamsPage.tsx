import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/exams.css';

const ExamsPage = () => {
    const { assignmentId } = useParams();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5024/api/Stats/exams-by-assignment/${assignmentId}`)
            .then(response => response.json())
            .then(data => {
                setExams(data.$values || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener exámenes:', error);
                setLoading(false);
            });
    }, [assignmentId]);

    return (
        <div>
            <Navbar />
            <div className="exams-page">
                <h1>Exámenes Generados</h1>
                {loading && <p>Cargando...</p>}
                {!loading && exams.length === 0 && <p>No hay exámenes disponibles.</p>}
                {exams.length > 0 && (
                    <table className="exams-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Profesor</th>
                                <th>Fecha de Creación</th>
                                <th>Preguntas Totales</th>
                                <th>Dificultad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((exam: any) => (
                                <tr key={exam.examId}>
                                    <td>{exam.examId}</td>
                                    <td>{exam.professorName}</td>
                                    <td>{new Date(exam.creationDate).toLocaleDateString()}</td>
                                    <td>{exam.totalQuestions}</td>
                                    <td>{exam.difficulty}</td>
                                    <td>{exam.state || 'Pendiente'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ExamsPage;

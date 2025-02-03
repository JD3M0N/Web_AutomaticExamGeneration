import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../css/compareExams.css';

const CompareExamsPage = () => {
    const [examComparisons, setExamComparisons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5024/api/Stats/compare-exams')
            .then(response => response.json())
            .then(data => {
                setExamComparisons(data.$values ?? []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener comparación de exámenes:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <Navbar />
            <div className="compare-exams-page">
                <h1>Comparación de Exámenes por Asignatura</h1>

                {loading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <table className="compare-table">
                        <thead>
                            <tr>
                                <th>Asignatura</th>
                                <th>Distribución de Temas (%)</th>
                                <th>Dificultad Promedio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examComparisons.map((exam: any, index: number) => (
                                <tr key={index}>
                                    <td>{exam.assignmentName}</td>
                                    <td>
                                        {Object.entries(exam.topicDistribution).map(([topic, percentage]: any) => (
                                            <div key={topic}>{topic}: {percentage}%</div>
                                        ))}
                                    </td>
                                    <td>{exam.averageDifficulty.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CompareExamsPage;

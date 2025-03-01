import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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

    // Función para generar y descargar el PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Comparación de Exámenes", 14, 10);

        const tableColumn = ["Asignatura", "Distribución de Temas", "Dificultad Promedio"];
        const tableRows = [];

        examComparisons.forEach((exam: any) => {
            // Filtrar la clave "$id" de la distribución de temas
            const topicDistribution = Object.entries(exam.topicDistribution)
                .filter(([topic]) => topic !== "$id")
                .map(([topic, percentage]) => `${topic}: ${percentage}%`)
                .join(", ");

            const rowData = [
                exam.assignmentName,
                topicDistribution,
                exam.averageDifficulty.toFixed(2)
            ];
            tableRows.push(rowData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("comparacion_examenes.pdf");
    };

    return (
        <div>
            <Navbar />
            <div className="compare-exams-page">
                <h1>Comparación de Exámenes por Asignatura</h1>

                <button className="download-pdf-button" onClick={downloadPDF}>
                    Descargar PDF
                </button>

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
                                        {Object.entries(exam.topicDistribution)
                                            .filter(([topic]) => topic !== "$id")
                                            .map(([topic, percentage]: any) => (
                                                <div key={topic}>
                                                    {topic}: {percentage}%
                                                </div>
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

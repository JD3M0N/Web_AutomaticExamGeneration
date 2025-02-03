import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../css/exams.css';

const ExamsPage = () => {
    const { assignmentId } = useParams();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5024/api/Stats/exams-by-assignment/${assignmentId}`)
            .then(response => response.json())
            .then(data => {
                setExams(data.$values ?? []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener exámenes:', error);
                setLoading(false);
            });
    }, [assignmentId]);

    // Función para generar y descargar el PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Exámenes Generados", 14, 10);

        const tableColumn = ["ID", "Profesor", "Fecha Creación", "Preguntas", "Dificultad", "Estado"];
        const tableRows = [];

        exams.forEach((exam: any) => {
            const rowData = [
                exam.examId,
                exam.professorName,
                new Date(exam.creationDate).toLocaleDateString(),
                exam.totalQuestions,
                exam.difficulty,
                exam.state || 'Pendiente'
            ];
            tableRows.push(rowData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("examenes_generados.pdf");
    };

    return (
        <div>
            <Navbar />
            <div className="exams-page">
                <h1>Exámenes Generados</h1>

                <button className="download-pdf-button" onClick={downloadPDF}>
                    Descargar PDF
                </button>

                {loading ? (
                    <p>Cargando datos...</p>
                ) : (
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

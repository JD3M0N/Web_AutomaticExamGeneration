import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../css/unusedQuestions.css';

const UnusedQuestionsPage = () => {
    const [unusedQuestions, setUnusedQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5024/api/Stats/unused-questions')
            .then(response => response.json())
            .then(data => {
                setUnusedQuestions(data.$values ?? []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener preguntas no utilizadas:", error);
                setLoading(false);
            });
    }, []);

    // Función para generar y descargar el PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Preguntas No Utilizadas", 14, 10);

        const tableColumn = ["ID", "Pregunta", "Dificultad", "Tema", "Profesor"];
        const tableRows = [];

        unusedQuestions.forEach((question: any) => {
            const rowData = [
                question.questionId,
                question.questionText,
                question.difficulty,
                question.topicName,
                question.professorName
            ];
            tableRows.push(rowData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("preguntas_no_utilizadas.pdf");
    };

    return (
        <div>
            <Navbar />
            <div className="unused-questions-page">
                <h1>Preguntas No Utilizadas en los Últimos 2 Años</h1>

                <button className="download-pdf-button" onClick={downloadPDF}>
                    Descargar PDF
                </button>

                {loading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <table className="unused-questions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Pregunta</th>
                                <th>Dificultad</th>
                                <th>Tema</th>
                                <th>Profesor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unusedQuestions.map((question: any, index: number) => (
                                <tr key={index}>
                                    <td>{question.questionId}</td>
                                    <td>{question.questionText}</td>
                                    <td>{question.difficulty}</td>
                                    <td>{question.topicName}</td>
                                    <td>{question.professorName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UnusedQuestionsPage;

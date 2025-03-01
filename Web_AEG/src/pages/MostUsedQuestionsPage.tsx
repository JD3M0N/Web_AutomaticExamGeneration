import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../css/mostUsedQuestions.css';

const MostUsedQuestionsPage = () => {
    const { assignmentId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5024/api/Stats/most-used-questions/${assignmentId}`)
            .then(response => response.json())
            .then(data => {
                setQuestions(data.$values ?? []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener preguntas más usadas:', error);
                setLoading(false);
            });
    }, [assignmentId]);

    // Función para convertir la dificultad numérica a texto
    const getDifficultyLabel = (difficulty: number) => {
        switch (difficulty) {
            case 1:
                return "facil";
            case 2:
                return "dificil";
            case 3:
                return "media";
            default:
                return difficulty.toString();
        }
    };

    // Función para generar y descargar el PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Preguntas Más Usadas", 14, 10);

        const tableColumn = ["ID", "Pregunta", "Dificultad", "Tema", "Usos"];
        const tableRows = [];

        questions.forEach((question: any) => {
            const rowData = [
                question.questionId,
                question.questionText,
                getDifficultyLabel(question.difficulty),
                question.topicName,
                question.usageCount
            ];
            tableRows.push(rowData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("preguntas_mas_usadas.pdf");
    };

    return (
        <div>
            <Navbar />
            <div className="most-used-questions-page">
                <h1>Preguntas Más Usadas en Exámenes Finales</h1>

                <button className="download-pdf-button" onClick={downloadPDF}>
                    Descargar PDF
                </button>

                {loading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <table className="most-used-questions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Texto de la pregunta</th>
                                <th>Dificultad</th>
                                <th>Tema</th>
                                <th>Veces Usada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question: any, index: number) => (
                                <tr key={index}>
                                    <td>{question.questionId}</td>
                                    <td>{question.questionText}</td>
                                    <td>{getDifficultyLabel(question.difficulty)}</td>
                                    <td>{question.topicName}</td>
                                    <td>{question.usageCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MostUsedQuestionsPage;

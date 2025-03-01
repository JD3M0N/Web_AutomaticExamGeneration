import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/statistics.css';

const Statistics = () => {
    const [assignments, setAssignments] = useState<{ id: number; name: string }[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const navigate = useNavigate();

    // Obtener lista de asignaturas al cargar la página
    useEffect(() => {
        console.log("Obteniendo asignaturas...");

        fetch('http://localhost:5024/api/Assignment')
            .then(response => response.json())
            .then(data => {
                console.log("Datos recibidos:", data);

                // Extraer el array correctamente desde $values si existe
                const parsedData = data?.$values ?? [];

                if (Array.isArray(parsedData)) {
                    setAssignments(parsedData);
                } else {
                    console.error("Error: La API no devolvió un array válido.", parsedData);
                    setAssignments([]);
                }
            })
            .catch(error => {
                console.error("Error al obtener asignaturas:", error);
                setAssignments([]);
            });
    }, []);

    // Manejar selección de asignatura
    const handleAssignmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAssignment(event.target.value);
    };

    // Redirigir a la página de exámenes generados
    const goToExamsPage = () => {
        if (!selectedAssignment) {
            alert('Por favor, selecciona una asignatura.');
            return;
        }
        navigate(`/exams/${selectedAssignment}`);
    };

    // Redirigir a la página de comparación de exámenes
    const goToCompareExamsPage = () => {
        navigate(`/compare-exams`);
    };

    // Redirigir a la página de revisores de exámenes
    const goToProfessorReviewsPage = () => {
        navigate(`/professor-reviews`);
    };

    // Redirigir a la página de preguntas no utilizadas
    const goToUnusedQuestionsPage = () => {
        navigate(`/unused-questions`);
    };

    // Redirigir a la página de preguntas más usadas
    const goToMostUsedQuestionsPage = () => {
        if (!selectedAssignment) {
            alert('Por favor, selecciona una asignatura.');
            return;
        }
        navigate(`/most-used-questions/${selectedAssignment}`);
    };

    return (
        <div>
            <Navbar />
            <div className="statistics-page">
                <h1 className="statistics-title">Estadísticas del Sistema</h1>

                <div className="buttons-container">
                    {/* Exámenes Generados - Selector + Botón */}
                    <div className="button-row">
                        <button onClick={goToExamsPage}>Exámenes Generados</button>
                        <select id="assignment" value={selectedAssignment} onChange={handleAssignmentChange}>
                            <option value="">-- Selecciona Asignatura --</option>
                            {assignments.map((assignment) => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={goToMostUsedQuestionsPage}>Preguntas Más Usadas</button>
                    <select id="assignment" value={selectedAssignment} onChange={handleAssignmentChange}>
                        <option value="">-- Selecciona Asignatura --</option>
                        {assignments.map((assignment) => (
                            <option key={assignment.id} value={assignment.id}>
                                {assignment.name}
                            </option>
                        ))}
                    </select>
                    {/* Resto de botones sin selector */}
                    {/* <button>Preguntas Más Usadas</button> */}
                    <button>Exámenes Validados</button>
                    <button>Desempeño en Exámenes</button>
                    <button onClick={goToUnusedQuestionsPage}>Preguntas No Utilizadas</button>
                    <button onClick={goToCompareExamsPage}>Comparación de Exámenes</button>
                    <button onClick={goToProfessorReviewsPage}>Revisores de Exámenes</button>
                </div>
            </div>
        </div>
    );
};

export default Statistics;

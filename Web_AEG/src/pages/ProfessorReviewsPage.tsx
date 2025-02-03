import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../css/professorReviews.css';

const ProfessorReviewsPage = () => {
    const [professorReviews, setProfessorReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5024/api/Stats/professor-reviews')
            .then(response => response.json())
            .then(data => {
                setProfessorReviews(data.$values ?? []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener revisores de exámenes:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <Navbar />
            <div className="professor-reviews-page">
                <h1>Revisores de Exámenes</h1>

                {loading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <table className="professor-reviews-table">
                        <thead>
                            <tr>
                                <th>Profesor</th>
                                <th>Asignatura</th>
                                <th>Exámenes Revisados</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professorReviews.map((review: any, index: number) => (
                                <tr key={index}>
                                    <td>{review.professorName}</td>
                                    <td>{review.assignmentName}</td>
                                    <td>{review.examsReviewed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProfessorReviewsPage;

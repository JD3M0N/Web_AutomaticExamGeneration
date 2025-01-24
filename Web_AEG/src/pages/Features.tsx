import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/features.css';

const Features = () => {
    return (
        <div className="features-page">
            <Navbar />
            <header className="features-header">
                <h1>Funcionalidades del Proyecto</h1>
            </header>
            <section className="feature-section">
                <div className="feature-block">
                    <div className="feature-description">
                        <h2>Listado de Exámenes Generados</h2>
                        <p>Obtener el listado de exámenes generados automáticamente para una asignatura específica, indicando el nombre del creador, la fecha de creación y los parámetros utilizados.</p>
                    </div>
                    <div className="feature-video">
                        <video controls>
                            <source src="/path/to/video1.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="feature-block">
                    <div className="feature-description">
                        <h2>Preguntas Más Utilizadas</h2>
                        <p>Obtener las preguntas más utilizadas en los exámenes finales de una asignatura, clasificadas por nivel de dificultad y tema.</p>
                    </div>
                    <div className="feature-video">
                        <video controls>
                            <source src="/path/to/video2.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="feature-block">
                    <div className="feature-description">
                        <h2>Exámenes Validados</h2>
                        <p>Listar los exámenes que fueron validados por un revisor determinado, indicando la fecha de validación y las observaciones hechas durante el proceso.</p>
                    </div>
                    <div className="feature-video">
                        <video controls>
                            <source src="/path/to/video3.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="feature-block">
                    <div className="feature-description">
                        <h2>Reporte de Desempeño</h2>
                        <p>Generar un reporte sobre el desempeño de los estudiantes en un examen, clasificando las preguntas por dificultad y comparando las tasas de acierto.</p>
                    </div>
                    <div className="feature-video">
                        <video controls>
                            <source src="/path/to/video4.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="feature-block">
                    <div className="feature-description">
                        <h2>Preguntas No Utilizadas</h2>
                        <p>Obtener un informe de las preguntas que no han sido utilizadas en exámenes generados en los últimos dos años.</p>
                    </div>
                    <div className="feature-video">
                        <video controls>
                            <source src="/path/to/video5.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="feature-block">
                    <div className="feature-description">
                        <h2>Comparar Exámenes</h2>
                        <p>Comparar los exámenes generados para diferentes asignaturas, verificando la distribución de preguntas por tema y nivel de dificultad y si los criterios de equilibrio fueron cumplidos.</p>
                    </div>
                    <div className="feature-video">
                        <video controls>
                            <source src="/path/to/video6.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="feature-block">
                    <div className="feature-description">
                        <h2>Registro de Profesores Revisores</h2>
                        <p>Obtener un registro detallado de los profesores que han revisado exámenes en los últimos dos semestres, especificando la asignatura y el número de exámenes revisados por cada uno.</p>
                    </div>
                    <div className="feature-video">
                        <video controls>
                            <source src="/path/to/video7.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="feature-block">
                    <div className="feature-description">
                        <h2>Exportar Información</h2>
                        <p>La posibilidad de exportar la información mostrada a ficheros con formato PDF tiene que ser una funcionalidad provista por el sistema para todo tipo de usuario.</p>
                    </div>
                    <div className="feature-video">
                        <video controls>
                            <source src="/path/to/video8.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Features;
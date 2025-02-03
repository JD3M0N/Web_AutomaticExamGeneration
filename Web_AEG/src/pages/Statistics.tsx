import React from 'react';
import Navbar from '../components/Navbar'; // Asegúrate de que la ruta sea correcta
import '../css/statistics.css'; // Archivo CSS para estilos

const Statistics = () => {
    return (
        <div>
            <Navbar /> {/* Incluir la barra de navegación */}
            <div className="statistics-page">
                <h1>Estadísticas del Sistema</h1>
                <div className="buttons-container">
                    <button onClick={() => console.log('Redirigir a Exámenes Generados')}>
                        Exámenes Generados
                    </button>
                    <button onClick={() => console.log('Redirigir a Preguntas Más Usadas')}>
                        Preguntas Más Usadas
                    </button>
                    <button onClick={() => console.log('Redirigir a Exámenes Validados')}>
                        Exámenes Validados
                    </button>
                    <button onClick={() => console.log('Redirigir a Desempeño en Exámenes')}>
                        Desempeño en Exámenes
                    </button>
                    <button onClick={() => console.log('Redirigir a Preguntas No Utilizadas')}>
                        Preguntas No Utilizadas
                    </button>
                    <button onClick={() => console.log('Redirigir a Comparación de Exámenes')}>
                        Comparación de Exámenes
                    </button>
                    <button onClick={() => console.log('Redirigir a Revisores de Exámenes')}>
                        Revisores de Exámenes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Statistics;

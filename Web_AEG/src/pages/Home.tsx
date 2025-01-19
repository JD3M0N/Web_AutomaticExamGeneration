import React from 'react'

const Home = ({ onLoginClick }: { onLoginClick: () => void }) => {
    return (
        <div className="home">
            <header className="home-header">
                <h1>Bienvenidos a Nuestra Escuela</h1>
                <p>
                    Nuestra escuela se dedica a proporcionar una educación de calidad y
                    fomentar el crecimiento personal y académico de nuestros estudiantes.
                </p>
                <button onClick={onLoginClick} className="login-button">
                    Iniciar Sesión
                </button>
            </header>
        </div>
    )
}

export default Home
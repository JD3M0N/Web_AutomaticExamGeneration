import React, { useState } from 'react';

const AdminPage = () => {
    const [userType, setUserType] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        age: '',
        grade: '',
    });
    const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar el mensaje de error

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserType(e.target.value);
        setErrorMessage(''); // Limpiar mensaje de error al cambiar el tipo de usuario
        setFormData({
            name: '',
            email: '',
            password: '',
            specialization: '',
            age: '',
            grade: '',
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMessage(''); // Limpiar mensaje de error al escribir en los campos
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let endpoint = '';

        switch (userType) {
            case 'Admin':
                endpoint = 'http://localhost:5024/api/Admin';
                break;
            case 'Professor':
                endpoint = 'http://localhost:5024/api/Professor';
                break;
            case 'Student':
                endpoint = 'http://localhost:5024/api/Student';
                break;
            default:
                alert('Por favor, selecciona un tipo de usuario.');
                return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert(`${userType} añadido exitosamente.`);
                setErrorMessage(''); // Limpiar cualquier error previo
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    specialization: '',
                    age: '',
                    grade: '',
                });
            } else {
                // Capturar el mensaje de error del servidor
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Error al añadir el usuario.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Hubo un problema con la conexión al servidor.');
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Bienvenido al panel de administración.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tipo de Usuario:</label>
                    <select value={userType} onChange={handleUserTypeChange} required>
                        <option value="">Seleccione un tipo</option>
                        <option value="Admin">Admin</option>
                        <option value="Professor">Professor</option>
                        <option value="Student">Student</option>
                    </select>
                </div>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {userType === 'Professor' && (
                    <div>
                        <label>Especialización:</label>
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
                {userType === 'Student' && (
                    <>
                        <div>
                            <label>Edad:</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Grado:</label>
                            <input
                                type="text"
                                name="grade"
                                value={formData.grade}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                )}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Mostrar el error en la página */}
                <button type="submit">Agregar Usuario</button>
            </form>
        </div>
    );
};

export default AdminPage;

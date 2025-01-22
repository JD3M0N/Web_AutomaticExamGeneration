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
    const [assignmentData, setAssignmentData] = useState({
        name: '',
        studyProgram: '',
        email: '',
    });
    const [teachData, setTeachData] = useState({
        email: '',
        assignmentName: '',
    });
    const [topicData, setTopicData] = useState({
        name: '',
    });
    const [ownData, setOwnData] = useState({
        assignmentName: '',
        topicName: '',
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

    const handleAssignmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAssignmentData({ ...assignmentData, [name]: value });
    };

    const handleTeachChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTeachData({ ...teachData, [name]: value });
    };

    const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTopicData({ ...topicData, [name]: value });
    };

    const handleOwnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOwnData({ ...ownData, [name]: value });
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

    const handleAssignmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = 'http://localhost:5024/api/Assignment/add-with-email';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignmentData),
            });

            if (response.ok) {
                alert('Asignatura añadida exitosamente.');
                setAssignmentData({
                    name: '',
                    studyProgram: '',
                    email: '',
                });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Error al añadir la asignatura.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Hubo un problema con la conexión al servidor.');
        }
    };

    const handleTeachSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = 'http://localhost:5024/api/Teach/add-with-email-and-assignment';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teachData),
            });

            if (response.ok) {
                alert('Teach añadido exitosamente.');
                setTeachData({
                    email: '',
                    assignmentName: '',
                });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Error al añadir Teach.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Hubo un problema con la conexión al servidor.');
        }
    };

    const handleTopicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = 'http://localhost:5024/api/Topic';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(topicData.name),
            });

            if (response.ok) {
                alert('Topic añadido exitosamente.');
                setTopicData({ name: '' });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Error al añadir el topic.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Hubo un problema con la conexión al servidor.');
        }
    };

    const handleOwnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = 'http://localhost:5024/api/Own/add-by-names';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ownData),
            });

            if (response.ok) {
                alert('Relación entre asignatura y tema añadida exitosamente.');
                setOwnData({
                    assignmentName: '',
                    topicName: '',
                });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Error al añadir la relación.');
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
            {/* Formulario para usuarios */}
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
                {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} Mostrar el error en la página */}
                <button type="submit">Agregar Usuario</button>
            </form>

            {/* Formulario para asignaturas */}
            <form onSubmit={handleAssignmentSubmit}>
                <h2>Añadir Asignatura</h2>
                <div>
                    <label>Nombre de la Asignatura:</label>
                    <input
                        type="text"
                        name="name"
                        value={assignmentData.name}
                        onChange={handleAssignmentChange}
                        required
                    />
                </div>
                <div>
                    <label>Programa de Estudio:</label>
                    <input
                        type="text"
                        name="studyProgram"
                        value={assignmentData.studyProgram}
                        onChange={handleAssignmentChange}
                        required
                    />
                </div>
                <div>
                    <label>Email del Profesor:</label>
                    <input
                        type="email"
                        name="email"
                        value={assignmentData.email}
                        onChange={handleAssignmentChange}
                        required
                    />
                </div>
                <button type="submit">Agregar Asignatura</button>
            </form>

            <form onSubmit={handleTeachSubmit}>
                <h2>Asignar Profesor a Asignatura</h2>
                <div>
                    <label>Email del Profesor:</label>
                    <input
                        type="email"
                        name="email"
                        value={teachData.email}
                        onChange={handleTeachChange}
                        required
                    />
                </div>
                <div>
                    <label>Nombre de la Asignatura:</label>
                    <input
                        type="text"
                        name="assignmentName"
                        value={teachData.assignmentName}
                        onChange={handleTeachChange}
                        required
                    />
                </div>
                <button type="submit">Asignar Teach</button>
            </form>

            <form onSubmit={handleTopicSubmit}>
                <h2>Añadir Topic</h2>
                <div>
                    <label>Nombre del Topic:</label>
                    <input
                        type="text"
                        name="name"
                        value={topicData.name}
                        onChange={handleTopicChange}
                        required
                    />
                </div>
                <button type="submit">Agregar Topic</button>
            </form>

            <form onSubmit={handleOwnSubmit}>
                <h2>Relacionar Asignatura con Tema</h2>
                <div>
                    <label>Nombre de la Asignatura:</label>
                    <input
                        type="text"
                        name="assignmentName"
                        value={ownData.assignmentName}
                        onChange={handleOwnChange}
                        required
                    />
                </div>
                <div>
                    <label>Nombre del Tema:</label>
                    <input
                        type="text"
                        name="topicName"
                        value={ownData.topicName}
                        onChange={handleOwnChange}
                        required
                    />
                </div>
                <button type="submit">Relacionar</button>
            </form>


            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default AdminPage;

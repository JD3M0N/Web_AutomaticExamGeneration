import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import '../css/admin.css';

const AdminPage = () => {
    const [activeForm, setActiveForm] = useState('')
    const [admins, setAdmins] = useState([]);
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
    const [students, setStudents] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    //manejo de ingreso de datos de admin

    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [newAdminData, setNewAdminData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleNewAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAdminData({ ...newAdminData, [name]: value });
    };

    const handleAddAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addAdmin(newAdminData);
            setShowAddAdminModal(false);
            setNewAdminData({
                name: '',
                email: '',
                password: '',
            });
            fetchAdmins();
        } catch (error: any) {
            setNotification({ message: error.message, type: 'error' });
        }
    };

    const [showUpdateAdminModal, setShowUpdateAdminModal] = useState(false);
    const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
    const [updateAdminData, setUpdateAdminData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleUpdateAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateAdminData({ ...updateAdminData, [name]: value });
    };

    const handleUpdateAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentAdminId !== null) {
            try {
                await updateAdmin(currentAdminId, updateAdminData);
                setShowUpdateAdminModal(false);
                setUpdateAdminData({
                    name: '',
                    email: '',
                    password: '',
                });
                fetchAdmins();
            } catch (error: any) {
                setNotification({ message: error.message, type: 'error' });
            }
        }
    };

    //----------------------------------------------------------

    //manejo de ingreso de datos d estudiante
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [newStudentData, setNewStudentData] = useState({
        name: '',
        email: '',
        password: '',
        age: 0,
        grade: '',
    });

    const handleNewStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStudentData({ ...newStudentData, [name]: value });
    };

    const handleAddStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addStudent(newStudentData);
            setShowAddStudentModal(false);
            setNewStudentData({
                name: '',
                email: '',
                password: '',
                age: 0,
                grade: '',
            });
            fetchStudents();
        } catch (error: any) {
            setNotification({ message: error.message, type: 'error' });
        }
    };
    //---------------------------------------------


    // Manejo de modal para update de estudiantes 

    const [showUpdateStudentModal, setShowUpdateStudentModal] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);
    const [updateStudentData, setUpdateStudentData] = useState({
        name: '',
        email: '',
        password: '',
        age: 0,
        grade: '',
    });

    const handleUpdateStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateStudentData({ ...updateStudentData, [name]: value });
    };
    const handleUpdateStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStudentId !== null) {
            try {
                await updateStudent(currentStudentId, updateStudentData);
                setShowUpdateStudentModal(false);
                setUpdateStudentData({
                    name: '',
                    email: '',
                    password: '',
                    age: 0,
                    grade: '',
                });
                fetchStudents();
            } catch (error: any) {
                setNotification({ message: error.message, type: 'error' });
            }
        }
    };

    //---------------------------------------------------------


    // Manejo de ingreso de datos de estudiante

    const [showAddProfessorModal, setShowAddProfessorModal] = useState(false);
    const [newProfessorData, setNewProfessorData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
    });

    const handleNewProfessorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProfessorData({ ...newProfessorData, [name]: value });
    };

    const handleAddProfessorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addProfessor(newProfessorData);
            setShowAddProfessorModal(false);
            setNewProfessorData({
                name: '',
                email: '',
                password: '',
                specialization: '',
            });
            fetchProfessors();
        } catch (error: any) {
            setNotification({ message: error.message, type: 'error' });
        }
    };
    //-------------------------------------------------------------------------------------

    //Manejo de modificacion de datos de profesor 
    const [showUpdateProfessorModal, setShowUpdateProfessorModal] = useState(false);
    const [currentProfessorId, setCurrentProfessorId] = useState<number | null>(null);
    const [updateProfessorData, setUpdateProfessorData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
    });

    const handleUpdateProfessorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateProfessorData({ ...updateProfessorData, [name]: value });
    };

    const handleUpdateProfessorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentProfessorId !== null) {
            try {
                await updateProfessor(currentProfessorId, updateProfessorData);
                setShowUpdateProfessorModal(false);
                setUpdateProfessorData({
                    name: '',
                    email: '',
                    password: '',
                    specialization: '',
                });
                fetchProfessors();
            } catch (error: any) {
                setNotification({ message: error.message, type: 'error' });
            }
        }
    };

    //-----------------------------------------------------------------------
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

   


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
                setNotification({ message: 'Asignatura añadida exitosamente.', type: 'success' });
                setAssignmentData({
                    name: '',
                    studyProgram: '',
                    email: '',
                });
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message || 'Error al añadir la asignatura.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
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
                setNotification({ message: 'Teach añadido exitosamente.', type: 'success' });
                setTeachData({
                    email: '',
                    assignmentName: '',
                });
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message || 'Error al añadir Teach.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
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
                setNotification({ message: 'Topic añadido exitosamente.', type: 'success' });
                setTopicData({ name: '' });
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message || 'Error al añadir el topic.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    //funciones crud de estudiante

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:5024/api/Student', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Estudiantes obtenidos:', data); // Verifica los datos obtenidos
                setStudents(data);
                setActiveForm('viewStudents'); // Cambia el estado para mostrar la lista de estudiantes
            } else {
                const errorData = await response.json();
                console.error('Error al obtener los estudiantes:', errorData);
                setNotification({ message: errorData.message || 'Error al obtener los estudiantes.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };
    const addStudent = async (studentData: { name: string, email: string, password: string, age: number, grade: string }) => {
        try {
            const response = await fetch('http://localhost:5024/api/Student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Estudiante añadido:', data); // Verifica los datos obtenidos
                fetchStudents(); // Actualiza la lista de estudiantes
                setNotification({ message: 'Estudiante añadido exitosamente.', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Error al añadir el estudiante:', errorData);
                setNotification({ message: errorData.message || 'Error al añadir el estudiante.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    const updateStudent = async (id: number, studentData: { name?: string, email?: string, password?: string, age?: number, grade?: string }) => {
        try {
            const response = await fetch(`http://localhost:5024/api/Student/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Estudiante actualizado:', data); // Verifica los datos obtenidos
                fetchStudents(); // Actualiza la lista de estudiantes
                setNotification({ message: 'Estudiante actualizado exitosamente.', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el estudiante:', errorData);
                setNotification({ message: errorData.message || 'Error al actualizar el estudiante.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    const deleteStudent = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5024/api/Student/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log('Estudiante eliminado'); // Verifica la eliminación
                fetchStudents(); // Actualiza la lista de estudiantes
                setNotification({ message: 'Estudiante eliminado exitosamente.', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar el estudiante:', errorData);
                setNotification({ message: errorData.message || 'Error al eliminar el estudiante.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    //-----------------------------------------------------------------------------

    //funciones crud de profesor

    const addProfessor = async (professorData: { name: string, email: string, password: string, specialization: string }) => {
        try {
            const response = await fetch('http://localhost:5024/api/Professor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(professorData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Profesor añadido:', data); // Verifica los datos obtenidos
                fetchProfessors(); // Actualiza la lista de profesores
                setNotification({ message: 'Profesor añadido exitosamente.', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Error al añadir el profesor:', errorData);
                setNotification({ message: errorData.message || 'Error al añadir el profesor.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    const updateProfessor = async (id: number, professorData: { name?: string, email?: string, password?: string, specialization?: string }) => {
        try {
            const response = await fetch(`http://localhost:5024/api/Professor/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(professorData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Profesor actualizado:', data); // Verifica los datos obtenidos
                fetchProfessors(); // Actualiza la lista de profesores
                setNotification({ message: 'Profesor actualizado exitosamente.', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el profesor:', errorData);
                setNotification({ message: errorData.message || 'Error al actualizar el profesor.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    const fetchProfessors = async () => {
        try {
            const response = await fetch('http://localhost:5024/api/Professor');
            if (response.ok) {
                const data = await response.json();
                console.log('Profesores obtenidos:', data); // Verifica los datos obtenidos
                setProfessors(data);
                setActiveForm('viewProfessors'); // Cambia el estado para mostrar la lista de profesores
            } else {
                const errorData = await response.json();
                console.error('Error al obtener los profesores:', errorData);
                setNotification({ message: errorData.message || 'Error al obtener los profesores.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    const deleteProfessor = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5024/api/Professor/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log('Profesor eliminado'); // Verifica la eliminación
                fetchProfessors(); // Actualiza la lista de profesores
                setNotification({ message: 'Profesor eliminado exitosamente.', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar el profesor:', errorData);
                setNotification({ message: errorData.message || 'Error al eliminar el profesor.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };
    //---------------------------------------------------------------------------------------------------

    //funciones crud de admin 
    const addAdmin = async (adminData: { name: string, email: string, password: string }) => {
        try {
            const response = await fetch('http://localhost:5024/api/Admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Admin añadido:', data); // Verifica los datos obtenidos
                fetchAdmins(); // Actualiza la lista de administradores
                setNotification({ message: 'Admin añadido exitosamente.', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Error al añadir el admin:', errorData);
                setNotification({ message: errorData.message || 'Error al añadir el admin.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    const updateAdmin = async (id: number, adminData: { name?: string, email?: string, password?: string }) => {
        try {
            const response = await fetch(`http://localhost:5024/api/Admin/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Admin actualizado:', data); // Verifica los datos obtenidos
                fetchAdmins(); // Actualiza la lista de administradores
                setNotification({ message: 'Admin actualizado exitosamente.', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el admin:', errorData);
                setNotification({ message: errorData.message || 'Error al actualizar el admin.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };
    const fetchAdmins = async () => {
        try {
            const response = await fetch('http://localhost:5024/api/Admin');
            if (response.ok) {
                const data = await response.json();
                console.log('Administradores obtenidos:', data); // Verifica los datos obtenidos
                setAdmins(data);
                setActiveForm('viewAdmins'); // Cambia el estado para mostrar la lista de administradores
            } else {
                const errorData = await response.json();
                console.error('Error al obtener los administradores:', errorData);
                setNotification({ message: errorData.message || 'Error al obtener los administradores.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    //----------------------------------------------------------------------------------

    return (
        <div className="admin-page">
            <AdminNavbar />
            <div className="admin-content">
                <div className="sidebar">
                    <button onClick={fetchAdmins}>Administradores</button>
                    <button onClick={fetchProfessors}>Profesores</button>
                    <button onClick={fetchStudents}>Estudiantes</button>
                    <button onClick={() => setActiveForm('assignment')}>Añadir Asignatura</button>
                    <button onClick={() => setActiveForm('teach')}>Asignar Profesor a Asignatura</button>
                    <button onClick={() => setActiveForm('topic')}>Añadir Topic</button>
                    
                </div>
                <div className="form-container">
                    {notification && <Notification message={notification.message} type={notification.type} />}
                    {activeForm === 'assignment' && (
                        <form onSubmit={handleAssignmentSubmit} className="admin-form">
                            <div>
                                <label className="custom-label">Nombre de la Asignatura:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={assignmentData.name}
                                    onChange={handleAssignmentChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="custom-label">Programa de Estudio:</label>
                                <input
                                    type="text"
                                    name="studyProgram"
                                    value={assignmentData.studyProgram}
                                    onChange={handleAssignmentChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="custom-label">Email del Profesor:</label>
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
                    )}
                    {activeForm === 'teach' && (
                        <form onSubmit={handleTeachSubmit} className="admin-form">
                            <div>
                                <label className="custom-label">Email del Profesor:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={teachData.email}
                                    onChange={handleTeachChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="custom-label">Nombre de la Asignatura:</label>
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
                    )}
                    {activeForm === 'topic' && (
                        <form onSubmit={handleTopicSubmit} className="admin-form">
                            <div>
                                <label className="custom-label">Nombre del Topic:</label>
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
                    )}
                    {activeForm === 'viewStudents' && (
                        <div className="list-container">
                            <h2>Estudiantes</h2>
                            <button
                                style={{ backgroundColor: 'green' }}
                                onClick={() => setShowAddStudentModal(true)}
                            >
                                +
                            </button>
                            {students.length > 0 ? (
                                <ul>
                                    {students.map((student: { id: number, name: string, email: string }) => (
                                        <li key={student.id}>
                                            <span>{student.name}</span>
                                            <span>{student.email}</span>
                                            <div className="button-group">
                                                <button
                                                    style={{ backgroundColor: 'orange' }}
                                                    onClick={() => {
                                                        setCurrentStudentId(student.id);
                                                        setUpdateStudentData({
                                                            name: student.name,
                                                            email: student.email,
                                                            password: '',
                                                            age: 0,
                                                            grade: '',
                                                        });
                                                        setShowUpdateStudentModal(true);
                                                    }}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    style={{ backgroundColor: 'red' }}
                                                    onClick={() => deleteStudent(student.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay estudiantes disponibles.</p>
                            )}
                            {showAddStudentModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h2>Añadir Estudiante</h2>
                                        <form onSubmit={handleAddStudentSubmit}>
                                            <div>
                                                <label>Nombre:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={newStudentData.name}
                                                    onChange={handleNewStudentInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={newStudentData.email}
                                                    onChange={handleNewStudentInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Contraseña:</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={newStudentData.password}
                                                    onChange={handleNewStudentInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Edad:</label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={newStudentData.age}
                                                    onChange={handleNewStudentInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Grado:</label>
                                                <input
                                                    type="text"
                                                    name="grade"
                                                    value={newStudentData.grade}
                                                    onChange={handleNewStudentInputChange}
                                                    required
                                                />
                                            </div>
                                            <button type="submit">Añadir</button>
                                            <button type="button" onClick={() => setShowAddStudentModal(false)}>Cancelar</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                            {showUpdateStudentModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h2>Modificar Estudiante</h2>
                                        <form onSubmit={handleUpdateStudentSubmit}>
                                            <div>
                                                <label>Nombre:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={updateStudentData.name}
                                                    onChange={handleUpdateStudentInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={updateStudentData.email}
                                                    onChange={handleUpdateStudentInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Contraseña:</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={updateStudentData.password}
                                                    onChange={handleUpdateStudentInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Edad:</label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={updateStudentData.age}
                                                    onChange={handleUpdateStudentInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Grado:</label>
                                                <input
                                                    type="text"
                                                    name="grade"
                                                    value={updateStudentData.grade}
                                                    onChange={handleUpdateStudentInputChange}
                                                />
                                            </div>
                                            <button type="submit">Modificar</button>
                                            <button type="button" onClick={() => setShowUpdateStudentModal(false)}>Cancelar</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>

                    )}
                    {activeForm === 'viewProfessors' && (
                        <div className="list-container">
                            <h2>Profesores</h2>
                            <button
                                style={{ backgroundColor: 'green' }}
                                onClick={() => setShowAddProfessorModal(true)}
                            >
                                +
                            </button>
                            {professors.length > 0 ? (
                                <ul>
                                    {professors.map((professor: { id: number, name: string, email: string }) => (
                                        <li key={professor.id}>
                                            <span>{professor.name}</span>
                                            <span>{professor.email}</span>
                                            <div className="button-group">
                                                <button
                                                    style={{ backgroundColor: 'orange' }}
                                                    onClick={() => {
                                                        setCurrentProfessorId(professor.id);
                                                        setUpdateProfessorData({
                                                            name: professor.name,
                                                            email: professor.email,
                                                            password: '',
                                                            specialization: '',
                                                        });
                                                        setShowUpdateProfessorModal(true);
                                                    }}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    style={{ backgroundColor: 'red' }}
                                                    onClick={() => deleteProfessor(professor.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay profesores disponibles.</p>
                            )}

                            {showAddProfessorModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h2>Añadir Profesor</h2>
                                        <form onSubmit={handleAddProfessorSubmit}>
                                            <div>
                                                <label>Nombre:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={newProfessorData.name}
                                                    onChange={handleNewProfessorInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={newProfessorData.email}
                                                    onChange={handleNewProfessorInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Contraseña:</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={newProfessorData.password}
                                                    onChange={handleNewProfessorInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Especialización:</label>
                                                <input
                                                    type="text"
                                                    name="specialization"
                                                    value={newProfessorData.specialization}
                                                    onChange={handleNewProfessorInputChange}
                                                    required
                                                />
                                            </div>
                                            <button type="submit">Añadir</button>
                                            <button type="button" onClick={() => setShowAddProfessorModal(false)}>Cancelar</button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {showUpdateProfessorModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h2>Modificar Profesor</h2>
                                        <form onSubmit={handleUpdateProfessorSubmit}>
                                            <div>
                                                <label>Nombre:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={updateProfessorData.name}
                                                    onChange={handleUpdateProfessorInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={updateProfessorData.email}
                                                    onChange={handleUpdateProfessorInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Contraseña:</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={updateProfessorData.password}
                                                    onChange={handleUpdateProfessorInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Especialización:</label>
                                                <input
                                                    type="text"
                                                    name="specialization"
                                                    value={updateProfessorData.specialization}
                                                    onChange={handleUpdateProfessorInputChange}
                                                />
                                            </div>
                                            <button type="submit">Modificar</button>
                                            <button type="button" onClick={() => setShowUpdateProfessorModal(false)}>Cancelar</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeForm === 'viewAdmins' && (
                        <div className="list-container">
                            <h2>Administradores</h2>
                            <button

                                style={{ backgroundColor: 'green' }}
                                onClick={() => setShowAddAdminModal(true)}
                            >
                                +
                            </button>
                            {admins.length > 0 ? (
                                <ul>
                                    {admins.map((admin: { id: number, name: string, email: string }) => (
                                        <li key={admin.id}>
                                            <span>{admin.name}</span>
                                            <span>{admin.email}</span>
                                            <div className="button-group">
                                                <button
                                                    style={{ backgroundColor: 'orange' }}
                                                    onClick={() => {
                                                        setCurrentAdminId(admin.id);
                                                        setUpdateAdminData({
                                                            name: admin.name,
                                                            email: admin.email,
                                                            password: '',
                                                        });
                                                        setShowUpdateAdminModal(true);
                                                    }}
                                                >
                                                    ↑
                                                </button>
                                             
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay administradores disponibles.</p>
                            )}

                            {showAddAdminModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h2>Añadir Administrador</h2>
                                        <form onSubmit={handleAddAdminSubmit}>
                                            <div>
                                                <label>Nombre:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={newAdminData.name}
                                                    onChange={handleNewAdminInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={newAdminData.email}
                                                    onChange={handleNewAdminInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Contraseña:</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={newAdminData.password}
                                                    onChange={handleNewAdminInputChange}
                                                    required
                                                />
                                            </div>
                                            <button type="submit">Añadir</button>
                                            <button type="button" onClick={() => setShowAddAdminModal(false)}>Cancelar</button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {showUpdateAdminModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h2>Modificar Administrador</h2>
                                        <form onSubmit={handleUpdateAdminSubmit}>
                                            <div>
                                                <label>Nombre:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={updateAdminData.name}
                                                    onChange={handleUpdateAdminInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={updateAdminData.email}
                                                    onChange={handleUpdateAdminInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label>Contraseña:</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={updateAdminData.password}
                                                    onChange={handleUpdateAdminInputChange}
                                                />
                                            </div>
                                            <button type="submit">Modificar</button>
                                            <button type="button" onClick={() => setShowUpdateAdminModal(false)}>Cancelar</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminPage;
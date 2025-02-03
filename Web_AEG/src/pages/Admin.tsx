import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import AdminSection from '../components/AdminSection';
import ProfessorSection from '../components/ProfessorSection';
import StudentSection from '../components/StudentSection';
import AssignmentSection from '../components/AssignmentSection';
import TopicSection from '../components/TopicSection';
import { fetchTopics } from '../utils/crudTopic';
import { fetchAdmins } from '../utils/crudAdmin';
import { fetchStudents } from '../utils/crudStudent';
import { fetchProfessors } from '../utils/crudProfessor';
import { fetchAssignments } from '../utils/crudAssignment';
import '../css/admin.css';

const AdminPage = () => {
    const [activeForm, setActiveForm] = useState('')
    const [admins, setAdmins] = useState([]);

    const [assignments, setAssignments] = useState([]);
    const [teachData, setTeachData] = useState({
        email: '',
        assignmentName: '',
    });

    // lo relacionado con topic
    const [topics, setTopics] = useState([]);
    const [newTopicData, setNewTopicData] = useState({
        name: '',
        assignmentId: '',
    });

    // Al inicio del componente, junto a los demás estados:
    const [enrollData, setEnrollData] = useState({
        studentId: '',
        assignmentId: '',
    });

    // Maneja el cambio de los campos del formulario de enroll
    const handleEnrollChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEnrollData({ ...enrollData, [name]: value });
    };

    // Maneja el submit del formulario de enroll
    const handleEnrollSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = 'http://localhost:5024/api/Enroll';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    s_ID: Number(enrollData.studentId),
                    a_ID: Number(enrollData.assignmentId),
                }),
            });

            if (response.ok) {
                setNotification({ message: 'Estudiante asignado a la asignatura exitosamente.', type: 'success' });
                // Limpia el formulario si lo deseas
                setEnrollData({ studentId: '', assignmentId: '' });
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message || 'Error al asignar.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al asignar estudiante:', error);
            setNotification({ message: 'Hubo un problema con la conexión al servidor.', type: 'error' });
        }
    };

    const [showAddTopicModal, setShowAddTopicModal] = useState(false);

    useEffect(() => {
        fetchAssignments(setAssignments, setNotification, setActiveForm);
        fetchTopics(setTopics, setNotification);
    }, []);

    //----------------------------------


    //manejo de ingreso de datos de admin

    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [newAdminData, setNewAdminData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [showUpdateAdminModal, setShowUpdateAdminModal] = useState(false);
    const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
    const [updateAdminData, setUpdateAdminData] = useState({
        name: '',
        email: '',
        password: '',
    });



    const [students, setStudents] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [newStudentData, setNewStudentData] = useState({
        name: '',
        email: '',
        password: '',
        age: 0,
        grade: '',
    });

    const [showUpdateStudentModal, setShowUpdateStudentModal] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);
    const [updateStudentData, setUpdateStudentData] = useState({
        name: '',
        email: '',
        password: '',
        age: 0,
        grade: '',
    });

    const [showAddProfessorModal, setShowAddProfessorModal] = useState(false);
    const [newProfessorData, setNewProfessorData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
    });

    const [showUpdateProfessorModal, setShowUpdateProfessorModal] = useState(false);
    const [currentProfessorId, setCurrentProfessorId] = useState<number | null>(null);
    const [updateProfessorData, setUpdateProfessorData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
    });

    const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
    const [newAssignmentData, setNewAssignmentData] = useState({
        name: '',
        studyProgram: '',
        email: '',
    });

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        fetchAssignments(setAssignments, setNotification, setActiveForm);
    }, []);

    const handleTeachChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTeachData({ ...teachData, [name]: value });
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
                    assignmentName: '', // Cambiado a assignmentName
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


    // Nuevo estado para guardar las estadísticas obtenidas
    const [examStats, setExamStats] = useState<any[]>([]);

    // Función para manejar la obtención de estadísticas
    const handleFetchExamStats = async () => {
        if (!enrollData.assignmentId) {
            alert('Por favor, selecciona una asignatura.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5024/api/Stats/exams-by-assignment/${enrollData.assignmentId}`);
            if (response.ok) {
                const data = await response.json();
                const stats = data.$values || [];
                setExamStats(stats);
            } else {
                console.error('Error al obtener las estadísticas');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };

    //-----------------------------------------------------------------------------

    const [mostUsedQuestions, setMostUsedQuestions] = useState<any[]>([]);
    const [showMostUsedQuestions, setShowMostUsedQuestions] = useState(false);

    const handleFetchMostUsedQuestions = async () => {
        if (!enrollData.assignmentId) {
            alert('Por favor, selecciona una asignatura.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5024/api/Stats/most-used-questions/${enrollData.assignmentId}`);
            if (response.ok) {
                const data = await response.json();
                const questions = data.$values || [];
                setMostUsedQuestions(questions);
                setShowMostUsedQuestions(true);
            } else {
                setNotification({ message: 'Error al obtener las preguntas más usadas', type: 'error' });
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            setNotification({ message: 'Error al conectar con el servidor', type: 'error' });
        }
    };

    const [validatedExams, setValidatedExams] = useState<any[]>([]);
    const [selectedProfessorId, setSelectedProfessorId] = useState('');
    const [showValidatedExams, setShowValidatedExams] = useState(false);

    const handleFetchValidatedExams = async () => {
        if (!selectedProfessorId) {
            setNotification({ message: 'Por favor, selecciona un profesor', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5024/api/Stats/validated-exams/${selectedProfessorId}`);
            if (response.ok) {
                const data = await response.json();
                const exams = data.$values || [];
                setValidatedExams(exams);
                setShowValidatedExams(true);
            } else {
                setNotification({ message: 'Error al obtener los exámenes validados', type: 'error' });
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            setNotification({ message: 'Error al conectar con el servidor', type: 'error' });
        }
    };

    useEffect(() => {
        if (activeForm === 'examStats') {
            // Cargar la lista de profesores
            const fetchProfessorsData = async () => {
                try {
                    const response = await fetch('http://localhost:5024/api/Professor', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setProfessors(data.$values || []);
                    } else {
                        setNotification({ message: 'Error al cargar los profesores', type: 'error' });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setNotification({ message: 'Error al conectar con el servidor', type: 'error' });
                }
            };

            fetchProfessorsData();
        }
    }, [activeForm]);


    const [activeTab, setActiveTab] = useState<'examStats' | 'mostUsed'>('examStats');
    return (
        <div className="admin-page">
            <AdminNavbar />
            <div className="admin-content">
                <div className="sidebar">
                    <button onClick={() => fetchAdmins(setAdmins, setNotification, setActiveForm)}>Administradores</button>
                    <button onClick={() => fetchProfessors(setProfessors, setNotification, setActiveForm)}>Profesores</button>
                    <button onClick={() => fetchStudents(setStudents, setNotification, setActiveForm)}>Estudiantes</button>
                    <button onClick={() => fetchAssignments(setAssignments, setNotification, setActiveForm)}>Asignaturas</button>
                    <button onClick={() => setActiveForm('teach')}>Asignar Profesor a Asignatura</button>
                    <button onClick={() => setActiveForm('topic')}>Añadir Topic</button>
                    <button onClick={() => setActiveForm('enroll')}>Asignar Estudiante a Asignatura</button>
                    <button onClick={() => setActiveForm('examStats')}>Ver Estadísticas de Exámenes</button>
                </div>
                <div className="form-container">
                    {notification && <Notification message={notification.message} type={notification.type} />}
                    {activeForm === 'examStats' && (
                        <div className="stats-container">
                            <h2>Estadísticas de Exámenes</h2>
                            <div>
                                <label className="custom-label">Selecciona un Profesor:</label>
                                <select
                                    value={selectedProfessorId}
                                    onChange={(e) => setSelectedProfessorId(e.target.value)}
                                    className="custom-select"
                                >
                                    <option value="">Selecciona un profesor</option>
                                    {professors.map((professor: { id: number, name: string }) => (
                                        <option key={professor.id} value={professor.id}>
                                            {professor.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleFetchValidatedExams}
                                    className="stats-button"
                                >
                                    Ver Exámenes Validados
                                </button>
                            </div>

                            {showValidatedExams && validatedExams.length > 0 && (
                                <div className="validated-exams">
                                    <h3>Exámenes Validados</h3>
                                    <table className="stats-table">
                                        <thead>
                                            <tr>
                                                <th>ID Examen</th>
                                                <th>Asignatura</th>
                                                <th>Fecha de Validación</th>
                                                <th>Observaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {validatedExams.map((exam) => (
                                                <tr key={exam.examId}>
                                                    <td>{exam.examId}</td>
                                                    <td>{exam.assignmentName}</td>
                                                    <td>{new Date(exam.validationDate).toLocaleDateString()}</td>
                                                    <td>{exam.observations || 'Sin observaciones'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div>
                                <label className="custom-label">Selecciona una Asignatura:</label>
                                <select
                                    name="assignmentId"
                                    value={enrollData.assignmentId}
                                    onChange={handleEnrollChange}
                                    required
                                    className="custom-select"
                                >
                                    <option value="">Selecciona una asignatura</option>
                                    {assignments.map((assignment: { id: number, name: string }) => (
                                        <option key={assignment.id} value={assignment.id}>
                                            {assignment.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="button-group">
                                    <button
                                        onClick={() => {
                                            handleFetchExamStats();
                                            setActiveTab('examStats');
                                        }}
                                        className={`tab-button ${activeTab === 'examStats' ? 'active' : ''}`}
                                    >
                                        Ver Estadísticas de Exámenes
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleFetchMostUsedQuestions();
                                            setActiveTab('mostUsed');
                                        }}
                                        className={`tab-button ${activeTab === 'mostUsed' ? 'active' : ''}`}
                                    >
                                        Ver Preguntas Más Usadas
                                    </button>
                                </div>
                            </div>

                            {activeTab === 'examStats' && examStats.length > 0 && (
                                <table className="stats-table">
                                    <thead>
                                        <tr>
                                            <th>ID Examen</th>
                                            <th>Profesor</th>
                                            <th>Fecha de Creación</th>
                                            <th>Total Preguntas</th>
                                            <th>Dificultad</th>
                                            <th>Límite de Temas</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {examStats.map((stat) => (
                                            <tr key={stat.examId}>
                                                <td>{stat.examId}</td>
                                                <td>{stat.professorName}</td>
                                                <td>{new Date(stat.creationDate).toLocaleDateString()}</td>
                                                <td>{stat.totalQuestions}</td>
                                                <td>{stat.difficulty}</td>
                                                <td>{stat.topicLimit}</td>
                                                <td>{stat.state || 'Sin validar'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'mostUsed' && mostUsedQuestions.length > 0 && (
                                <div className="most-used-questions">
                                    <h3>Preguntas Más Usadas</h3>
                                    <table className="stats-table">
                                        <thead>
                                            <tr>
                                                <th>ID Pregunta</th>
                                                <th>Texto</th>
                                                <th>Dificultad</th>
                                                <th>Tema</th>
                                                <th>Veces Usada</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mostUsedQuestions.map((question) => (
                                                <tr key={question.questionId}>
                                                    <td>{question.questionId}</td>
                                                    <td>{question.questionText}</td>
                                                    <td>{question.difficulty}</td>
                                                    <td>{question.topicName}</td>
                                                    <td>{question.usageCount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                    {activeForm === 'enroll' && (
                        <form onSubmit={handleEnrollSubmit} className="admin-form">
                            <h2>Asignar Estudiante a Asignatura</h2>
                            <div>
                                <label className="custom-label">Estudiante:</label>
                                <select
                                    name="studentId"
                                    value={enrollData.studentId}
                                    onChange={handleEnrollChange}
                                    required
                                    className="custom-select"
                                >
                                    <option value="">Selecciona un estudiante</option>
                                    {students.map((student: { id: number, name: string }) => (
                                        <option key={student.id} value={student.id}>
                                            {student.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="custom-label">Asignatura:</label>
                                <select
                                    name="assignmentId"
                                    value={enrollData.assignmentId}
                                    onChange={handleEnrollChange}
                                    required
                                    className="custom-select"
                                >
                                    <option value="">Selecciona una asignatura</option>
                                    {assignments.map((assignment: { id: number, name: string }) => (
                                        <option key={assignment.id} value={assignment.id}>
                                            {assignment.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="submit-button">Asignar Estudiante</button>
                        </form>
                    )}
                    {activeForm === 'viewAssignments' && (
                        <AssignmentSection
                            assignments={assignments}
                            setAssignments={setAssignments}
                            setNotification={setNotification}
                            setActiveForm={setActiveForm}
                            showAddAssignmentModal={showAddAssignmentModal}
                            setShowAddAssignmentModal={setShowAddAssignmentModal}
                            newAssignmentData={newAssignmentData}
                            setNewAssignmentData={setNewAssignmentData}
                        />
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
                                <label className="custom-label">Asignatura:</label>
                                <select
                                    name="assignmentName"
                                    value={teachData.assignmentName}
                                    onChange={handleTeachChange}
                                    required
                                    className="custom-select" // Añade esta clase
                                >
                                    <option value="">Selecciona una asignatura</option>
                                    {assignments.map((assignment: { id: number, name: string }) => (
                                        <option key={assignment.id} value={assignment.name}>
                                            {assignment.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Asignar Teach</button>
                        </form>
                    )}
                    {activeForm === 'topic' && (
                        <TopicSection
                            topics={topics}
                            setTopics={setTopics}
                            setNotification={setNotification}
                            setActiveForm={setActiveForm}
                            showAddTopicModal={showAddTopicModal}
                            setShowAddTopicModal={setShowAddTopicModal}
                            newTopicData={newTopicData}
                            setNewTopicData={setNewTopicData}
                            assignments={assignments}
                        />
                    )}
                    {activeForm === 'viewStudents' && (
                        <StudentSection
                            students={students}
                            setStudents={setStudents}
                            setNotification={setNotification}
                            setActiveForm={setActiveForm}
                            showAddStudentModal={showAddStudentModal}
                            setShowAddStudentModal={setShowAddStudentModal}
                            newStudentData={newStudentData}
                            setNewStudentData={setNewStudentData}
                            showUpdateStudentModal={showUpdateStudentModal}
                            setShowUpdateStudentModal={setShowUpdateStudentModal}
                            currentStudentId={currentStudentId}
                            setCurrentStudentId={setCurrentStudentId}
                            updateStudentData={updateStudentData}
                            setUpdateStudentData={setUpdateStudentData}
                        />

                    )}
                    {activeForm === 'viewProfessors' && (
                        <ProfessorSection
                            professors={professors}
                            setProfessors={setProfessors}
                            setNotification={setNotification}
                            setActiveForm={setActiveForm}
                            showAddProfessorModal={showAddProfessorModal}
                            setShowAddProfessorModal={setShowAddProfessorModal}
                            newProfessorData={newProfessorData}
                            setNewProfessorData={setNewProfessorData}
                            showUpdateProfessorModal={showUpdateProfessorModal}
                            setShowUpdateProfessorModal={setShowUpdateProfessorModal}
                            currentProfessorId={currentProfessorId}
                            setCurrentProfessorId={setCurrentProfessorId}
                            updateProfessorData={updateProfessorData}
                            setUpdateProfessorData={setUpdateProfessorData}
                        />
                    )}

                    {activeForm === 'viewAdmins' && (
                        <AdminSection
                            admins={admins}
                            setAdmins={setAdmins}
                            setNotification={setNotification}
                            setActiveForm={setActiveForm}
                            showAddAdminModal={showAddAdminModal}
                            setShowAddAdminModal={setShowAddAdminModal}
                            newAdminData={newAdminData}
                            setNewAdminData={setNewAdminData}
                            showUpdateAdminModal={showUpdateAdminModal}
                            setShowUpdateAdminModal={setShowUpdateAdminModal}
                            currentAdminId={currentAdminId}
                            setCurrentAdminId={setCurrentAdminId}
                            updateAdminData={updateAdminData}
                            setUpdateAdminData={setUpdateAdminData}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminPage;
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
import { fetchStudents} from '../utils/crudStudent';
import { fetchProfessors } from '../utils/crudProfessor';
import { fetchAssignments} from '../utils/crudAssignment';
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


    

    //-----------------------------------------------------------------------------

    

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

                </div>
                <div className="form-container">
                    {notification && <Notification message={notification.message} type={notification.type} />}
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
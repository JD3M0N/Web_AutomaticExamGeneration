import React from 'react';
import { handleNewStudentInputChange, handleAddStudentSubmit, handleUpdateStudentInputChange, handleUpdateStudentSubmit, fetchStudents, deleteStudent } from '../utils/crudStudent';

const StudentSection = ({
    students,
    setStudents,
    setNotification,
    setActiveForm,
    showAddStudentModal,
    setShowAddStudentModal,
    newStudentData,
    setNewStudentData,
    showUpdateStudentModal,
    setShowUpdateStudentModal,
    currentStudentId,
    setCurrentStudentId,
    updateStudentData,
    setUpdateStudentData
}) => {
    const handleNewStudentInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleNewStudentInputChange(e, setNewStudentData, newStudentData);
    };

    const handleAddStudentSubmitWrapper = (e: React.FormEvent) => {
        handleAddStudentSubmit(e, newStudentData, setShowAddStudentModal, setNewStudentData, () => fetchStudents(setStudents, setNotification, setActiveForm), setNotification);
    };

    const handleUpdateStudentInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleUpdateStudentInputChange(e, setUpdateStudentData, updateStudentData);
    };

    const handleUpdateStudentSubmitWrapper = (e: React.FormEvent) => {
        handleUpdateStudentSubmit(e, currentStudentId, updateStudentData, setShowUpdateStudentModal, setUpdateStudentData, () => fetchStudents(setStudents, setNotification, setActiveForm), setNotification);
    };

    return (
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
                                    onClick={() => deleteStudent(student.id, setNotification, () => fetchStudents(setStudents, setNotification, setActiveForm))}
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
                        <form onSubmit={handleAddStudentSubmitWrapper}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newStudentData.name}
                                    onChange={handleNewStudentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newStudentData.email}
                                    onChange={handleNewStudentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newStudentData.password}
                                    onChange={handleNewStudentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Edad:</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={newStudentData.age}
                                    onChange={handleNewStudentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Grado:</label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={newStudentData.grade}
                                    onChange={handleNewStudentInputChangeWrapper}
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
                        <form onSubmit={handleUpdateStudentSubmitWrapper}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updateStudentData.name}
                                    onChange={handleUpdateStudentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={updateStudentData.email}
                                    onChange={handleUpdateStudentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={updateStudentData.password}
                                    onChange={handleUpdateStudentInputChangeWrapper}
                                />
                            </div>
                            <div>
                                <label>Edad:</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={updateStudentData.age}
                                    onChange={handleUpdateStudentInputChangeWrapper}
                                />
                            </div>
                            <div>
                                <label>Grado:</label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={updateStudentData.grade}
                                    onChange={handleUpdateStudentInputChangeWrapper}
                                />
                            </div>
                            <button type="submit">Modificar</button>
                            <button type="button" onClick={() => setShowUpdateStudentModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentSection;
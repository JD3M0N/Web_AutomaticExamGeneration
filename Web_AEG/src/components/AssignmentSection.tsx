import React from 'react';
import { handleNewAssignmentInputChange, handleAddAssignmentSubmit, fetchAssignments, deleteAssignment } from '../utils/crudAssignment';

const AssignmentSection = ({
    assignments,
    setAssignments,
    setNotification,
    setActiveForm,
    showAddAssignmentModal,
    setShowAddAssignmentModal,
    newAssignmentData,
    setNewAssignmentData
}) => {
    const handleNewAssignmentInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleNewAssignmentInputChange(e, setNewAssignmentData, newAssignmentData);
    };

    const handleAddAssignmentSubmitWrapper = (e: React.FormEvent) => {
        handleAddAssignmentSubmit(e, newAssignmentData, setShowAddAssignmentModal, setNewAssignmentData, () => fetchAssignments(setAssignments, setNotification, setActiveForm), setNotification);
    };

    const deleteAssignmentWrapper = (id: number) => {
        deleteAssignment(id, () => fetchAssignments(setAssignments, setNotification, setActiveForm), setNotification);
    };

    return (
        <div className="list-container">
            <h2>Asignaturas</h2>
            <button
                style={{ backgroundColor: 'green' }}
                onClick={() => setShowAddAssignmentModal(true)}
            >
                +
            </button>
            {assignments.length > 0 ? (
                <ul>
                    {assignments.map((assignment: { id: number, name: string, studyProgram: string, email: string }) => (
                        <li key={assignment.id}>
                            <span>{assignment.name}</span>
                            <span>{assignment.studyProgram}</span>
                            <span>{assignment.email}</span>
                            <div className="button-group">
                                <button
                                    style={{ backgroundColor: 'red' }}
                                    onClick={() => deleteAssignmentWrapper(assignment.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay asignaturas disponibles.</p>
            )}

            {showAddAssignmentModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Añadir Asignatura</h2>
                        <form onSubmit={handleAddAssignmentSubmitWrapper}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newAssignmentData.name}
                                    onChange={handleNewAssignmentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Programa de Estudio:</label>
                                <input
                                    type="text"
                                    name="studyProgram"
                                    value={newAssignmentData.studyProgram}
                                    onChange={handleNewAssignmentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email del Profesor:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newAssignmentData.email}
                                    onChange={handleNewAssignmentInputChangeWrapper}
                                    required
                                />
                            </div>
                            <button type="submit">Añadir</button>
                            <button type="button" onClick={() => setShowAddAssignmentModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentSection;
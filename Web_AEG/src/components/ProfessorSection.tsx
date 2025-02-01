import React from 'react';
import { handleNewProfessorInputChange, handleAddProfessorSubmit, handleUpdateProfessorInputChange, handleUpdateProfessorSubmit, fetchProfessors, deleteProfessor } from '../utils/crudProfessor';

const ProfessorSection = ({
    professors,
    setProfessors,
    setNotification,
    setActiveForm,
    showAddProfessorModal,
    setShowAddProfessorModal,
    newProfessorData,
    setNewProfessorData,
    showUpdateProfessorModal,
    setShowUpdateProfessorModal,
    currentProfessorId,
    setCurrentProfessorId,
    updateProfessorData,
    setUpdateProfessorData
}) => {
    const handleNewProfessorInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleNewProfessorInputChange(e, setNewProfessorData, newProfessorData);
    };

    const handleAddProfessorSubmitWrapper = (e: React.FormEvent) => {
        handleAddProfessorSubmit(e, newProfessorData, setShowAddProfessorModal, setNewProfessorData, () => fetchProfessors(setProfessors, setNotification, setActiveForm), setNotification);
    };

    const handleUpdateProfessorInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleUpdateProfessorInputChange(e, setUpdateProfessorData, updateProfessorData);
    };

    const handleUpdateProfessorSubmitWrapper = (e: React.FormEvent) => {
        handleUpdateProfessorSubmit(e, currentProfessorId, updateProfessorData, setShowUpdateProfessorModal, setUpdateProfessorData, () => fetchProfessors(setProfessors, setNotification, setActiveForm), setNotification);
    };

    return (
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
                                    onClick={() => deleteProfessor(professor.id, () => fetchProfessors(setProfessors, setNotification, setActiveForm), setNotification)}
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
                        <form onSubmit={handleAddProfessorSubmitWrapper}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProfessorData.name}
                                    onChange={handleNewProfessorInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newProfessorData.email}
                                    onChange={handleNewProfessorInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newProfessorData.password}
                                    onChange={handleNewProfessorInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Especialización:</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={newProfessorData.specialization}
                                    onChange={handleNewProfessorInputChangeWrapper}
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
                        <form onSubmit={handleUpdateProfessorSubmitWrapper}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updateProfessorData.name}
                                    onChange={handleUpdateProfessorInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={updateProfessorData.email}
                                    onChange={handleUpdateProfessorInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={updateProfessorData.password}
                                    onChange={handleUpdateProfessorInputChangeWrapper}
                                />
                            </div>
                            <div>
                                <label>Especialización:</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={updateProfessorData.specialization}
                                    onChange={handleUpdateProfessorInputChangeWrapper}
                                />
                            </div>
                            <button type="submit">Modificar</button>
                            <button type="button" onClick={() => setShowUpdateProfessorModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessorSection;
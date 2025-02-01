import React from 'react';
import { handleNewAdminInputChange, handleAddAdminSubmit, handleUpdateAdminInputChange, handleUpdateAdminSubmit, fetchAdmins } from '../utils/crudAdmin';

const AdminSection = ({
    admins,
    setAdmins,
    setNotification,
    setActiveForm,
    showAddAdminModal,
    setShowAddAdminModal,
    newAdminData,
    setNewAdminData,
    showUpdateAdminModal,
    setShowUpdateAdminModal,
    currentAdminId,
    setCurrentAdminId,
    updateAdminData,
    setUpdateAdminData
}) => {
    const handleNewAdminInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleNewAdminInputChange(e, setNewAdminData, newAdminData);
    };

    const handleAddAdminSubmitWrapper = (e: React.FormEvent) => {
        handleAddAdminSubmit(e, newAdminData, setShowAddAdminModal, setNewAdminData, () => fetchAdmins(setAdmins, setNotification, setActiveForm), setNotification);
    };

    const handleUpdateAdminInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleUpdateAdminInputChange(e, setUpdateAdminData, updateAdminData);
    };

    const handleUpdateAdminSubmitWrapper = (e: React.FormEvent) => {
        handleUpdateAdminSubmit(e, currentAdminId, updateAdminData, setShowUpdateAdminModal, setUpdateAdminData, () => fetchAdmins(setAdmins, setNotification, setActiveForm), setNotification);
    };

    return (
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
                        <form onSubmit={handleAddAdminSubmitWrapper}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newAdminData.name}
                                    onChange={handleNewAdminInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newAdminData.email}
                                    onChange={handleNewAdminInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newAdminData.password}
                                    onChange={handleNewAdminInputChangeWrapper}
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
                        <form onSubmit={handleUpdateAdminSubmitWrapper}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updateAdminData.name}
                                    onChange={handleUpdateAdminInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={updateAdminData.email}
                                    onChange={handleUpdateAdminInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contraseña:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={updateAdminData.password}
                                    onChange={handleUpdateAdminInputChangeWrapper}
                                />
                            </div>
                            <button type="submit">Modificar</button>
                            <button type="button" onClick={() => setShowUpdateAdminModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSection;
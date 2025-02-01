import React from 'react';
import { handleNewTopicInputChange, handleAddTopicSubmit, fetchTopics, deleteTopic } from '../utils/crudTopic';

const TopicSection = ({
    topics,
    setTopics,
    setNotification,
    setActiveForm,
    showAddTopicModal,
    setShowAddTopicModal,
    newTopicData,
    setNewTopicData,
    assignments
}) => {
    const handleNewTopicInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleNewTopicInputChange(e, setNewTopicData, newTopicData);
    };

    const handleAddTopicSubmitWrapper = (e: React.FormEvent) => {
        handleAddTopicSubmit(e, newTopicData, setNotification, () => fetchTopics(setTopics, setNotification), setNewTopicData, setShowAddTopicModal);
    };

    const deleteTopicWrapper = (id: number) => {
        deleteTopic(id, setNotification, () => fetchTopics(setTopics, setNotification));
    };

    return (
        <div className="list-container">
            <h2>Temas</h2>
            <button
                style={{ backgroundColor: 'green' }}
                onClick={() => setShowAddTopicModal(true)}
            >
                +
            </button>
            {topics.length > 0 ? (
                <ul>
                    {topics.map((topic: { id: number, name: string, assignmentName: string }) => (
                        <li key={topic.id}>
                            <span>{topic.name}</span>
                            <span>{topic.assignmentName}</span>
                            <div className="button-group">
                                <button
                                    style={{ backgroundColor: 'red' }}
                                    onClick={() => deleteTopicWrapper(topic.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay temas disponibles.</p>
            )}

            {showAddTopicModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Añadir Tema</h2>
                        <form onSubmit={handleAddTopicSubmitWrapper}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newTopicData.name}
                                    onChange={handleNewTopicInputChangeWrapper}
                                    required
                                />
                            </div>
                            <div>
                                <label>Asignatura:</label>
                                <select
                                    name="assignmentId"
                                    value={newTopicData.assignmentId}
                                    onChange={handleNewTopicInputChangeWrapper}
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
                            <button type="submit">Añadir</button>
                            <button type="button" onClick={() => setShowAddTopicModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopicSection;
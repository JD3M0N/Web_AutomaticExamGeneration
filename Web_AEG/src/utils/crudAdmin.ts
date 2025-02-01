// src/utils/crudAdmin.ts

export const handleNewAdminInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setNewAdminData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>,
    newAdminData: { name: string; email: string; password: string }
) => {
    const { name, value } = e.target;
    setNewAdminData({ ...newAdminData, [name]: value });
};

export const handleAddAdminSubmit = async (
    e: React.FormEvent,
    newAdminData: { name: string; email: string; password: string },
    setShowAddAdminModal: React.Dispatch<React.SetStateAction<boolean>>,
    setNewAdminData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>,
    fetchAdmins: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    e.preventDefault();
    try {
        await addAdmin(newAdminData, fetchAdmins, setNotification);
        setShowAddAdminModal(false);
        setNewAdminData({
            name: '',
            email: '',
            password: '',
        });
    } catch (error: any) {
        setNotification({ message: error.message, type: 'error' });
    }
};

export const handleUpdateAdminInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUpdateAdminData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>,
    updateAdminData: { name: string; email: string; password: string }
) => {
    const { name, value } = e.target;
    setUpdateAdminData({ ...updateAdminData, [name]: value });
};

export const handleUpdateAdminSubmit = async (
    e: React.FormEvent,
    currentAdminId: number | null,
    updateAdminData: { name: string; email: string; password: string },
    setShowUpdateAdminModal: React.Dispatch<React.SetStateAction<boolean>>,
    setUpdateAdminData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>,
    fetchAdmins: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
    e.preventDefault();
    if (currentAdminId !== null) {
        try {
            await updateAdmin(currentAdminId, updateAdminData, fetchAdmins, setNotification);
            setShowUpdateAdminModal(false);
            setUpdateAdminData({
                name: '',
                email: '',
                password: '',
            });
        } catch (error: any) {
            setNotification({ message: error.message, type: 'error' });
        }
    }
};

export const addAdmin = async (
    adminData: { name: string, email: string, password: string },
    fetchAdmins: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
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

export const updateAdmin = async (
    id: number,
    adminData: { name?: string, email?: string, password?: string },
    fetchAdmins: () => void,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>
) => {
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

export const fetchAdmins = async (
    setAdmins: React.Dispatch<React.SetStateAction<any[]>>,
    setNotification: React.Dispatch<React.SetStateAction<{ message: string; type: 'success' | 'error' } | null>>,
    setActiveForm: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const response = await fetch('http://localhost:5024/api/Admin');
        if (response.ok) {
            const data = await response.json();
            const admins = data.$values; // Extrae los valores relevantes
            console.log('Administradores obtenidos:', admins); // Verifica los datos obtenidos
            setAdmins(admins);
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
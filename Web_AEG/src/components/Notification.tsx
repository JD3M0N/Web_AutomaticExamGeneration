// src/components/Notification.tsx
import React from 'react';
import '../css/notification.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
};

export default Notification;
import { useState } from 'react';
import Alerts from '../common/alerts';

export const useAlerts = () => {
    const [alert, setShowAlert] = useState({
        show: false, 
        type: null, 
        message: null
    });

    const showAlert = (type, message, duration = 6000, ...props) => {
        setShowAlert({
            show: true,
            type,
            message,
            ...props
        });

        setTimeout(() => setShowAlert({ 
            show: false, 
            type: null, 
            message: null 
        }), duration);
    };
    
    return { 
        show: alert.show, 
        showAlert,
        Alerts: () => <Alerts {...alert} /> 
    };
};
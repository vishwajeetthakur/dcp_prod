import { useContext } from 'react';
import { KeycloakUserContext } from '../contexts/keycloakUserContext';

export const useKeycloakUser = () => {
    const { keycloakUser, setKeycloakUser } = useContext(KeycloakUserContext);

    function checkUserRoles(roles: any) {
        if (
            !roles || 
            keycloakUser.user_roles.includes('admin') ||
            keycloakUser.user_roles.includes('developer')
        ) return true

        if (!Array.isArray(roles)) roles = [roles]

        for (let role of roles) {
            if (keycloakUser.user_roles.includes(role)) return true
        }

        return false
    }

    return { keycloakUser, setKeycloakUser, checkUserRoles };
};
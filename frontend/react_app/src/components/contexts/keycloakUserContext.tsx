import React, { createContext, useState } from 'react';

interface IProps {
  children: React.ReactNode;
}

interface IObject {
  [key: string]: any;
}

export const KeycloakUserContext = createContext<any | null>(null);

export function KeycloakUserContextProvider({ children }: IProps) {
  const dummyData: IObject = {
    name: 'John Doe',
    // Add other properties as needed
  };
  const [keycloakUser, setKeycloakUser] = useState<IObject | null>(dummyData);

  return (
    <KeycloakUserContext.Provider value={{ keycloakUser, setKeycloakUser }}>
      {children}
    </KeycloakUserContext.Provider>
  );
}
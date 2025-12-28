'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

// Créer le contexte global
const GlobalContext = createContext();

// Hook personnalisé pour utiliser le contexte Globalement
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};

// Provider global
export default function GlobalProvider({ children }) {

  // Valeurs du contexte
  const contextValue = {
    // États

    // Données utilisateur Clerk

    // Actions
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

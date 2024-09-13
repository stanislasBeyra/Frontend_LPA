import React, { createContext, useState, useEffect } from 'react';
import UserModel from 'src/Models/UserModel'; // Assurez-vous que ce chemin est correct
import LoginController from 'src/controllers/LoginController'; // Assurez-vous que ce chemin est correct

// Créer un contexte
export const UserContext = createContext();

// Composant Provider qui enveloppe l'application
export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Récupérer les données utilisateur une seule fois au chargement de l'application
        const profile = await LoginController.getProfile();
        const user = new UserModel(profile.data.user);
        setUserInfo(user); // Stocker les informations utilisateur dans le state
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

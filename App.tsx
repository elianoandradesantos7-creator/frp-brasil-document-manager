
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/views/LoginScreen';
import MainLayout from './components/views/MainLayout';
import { User } from './types';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // TODO: In the next step, we will fetch the user's role from Firestore.
        // For now, we default to 'Colaborador'.
        const user: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          role: 'Colaborador', // Placeholder role
          avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`
        };
        // A simple role check for demonstration purposes
        if (user.email === 'admin@frpbrasil.com') {
          user.role = 'Admin Master';
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will handle setting currentUser to null
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Erro ao tentar sair. Por favor, tente novamente.");
    }
  }, []);
  
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <svg className="animate-spin h-10 w-10 text-frp-brasil" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    )
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  return <MainLayout user={currentUser} onLogout={handleLogout} />;
};

export default App;
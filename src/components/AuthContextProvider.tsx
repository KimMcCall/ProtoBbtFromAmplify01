    // AuthContext.js
    import { ReactNode } from 'react';
    import { getCurrentUser } from 'aws-amplify/auth';
    import { createContext, useContext, useState, useEffect } from 'react';
    import { toCanonicalEmail } from '../utils/utils';

    // Define the type for the ccontext's value
    interface AuthContextType {
      isAdmin: boolean;
      isOwner: boolean;
      userId: string;
      canonicalEmal: string;
    }

    // Create the context with a union type and initial null value
    const myContext = createContext<AuthContextType | null>(null);

    // Create a custom hook to handle the null check
    export const useMyContext = () => {
      const context = useContext(myContext);
      if (!context) {
        throw new Error('useMyContext must be used within a MyContextProvider');
      }
      return context;
    };

    // Create a provider component
    export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
        const [user, setUser] = useState<AuthContextType | null>(null);

        useEffect(() => {
            checkUser();
        }, []);

        async function checkUser() {
            try {
              const { username, userId } = await getCurrentUser();
              const canonical: string = toCanonicalEmail(username);
              const newContextInfo = {
                isAdmin: true, // Replace with actual logic
                isOwner: true, // Replace with actual logic
                userId: userId,
                canonicalEmal: canonical,
                };
                setUser(newContextInfo);
            } catch (error) {
                setUser(null); // No user signed in
            }
        }

        return (
            <myContext.Provider value={user}>
                {children}
            </myContext.Provider>
        );
    };

    export const EmptyAuthContextProvider = ({ children }: { children: ReactNode }) => {

        return (
                {children}
        );
    };

import { ReactNode, createContext, useEffect, useState } from "react";
import { fetchAuthSession } from 'aws-amplify/auth';

export interface AuthContextProps {
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    setIsAuthenticated: (state: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    isAuthenticating: false,
    setIsAuthenticated() { }
})

export function AuthContextProvider(props: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        try {
            const test = await fetchAuthSession();
            setIsAuthenticated(true);
        } catch (e) {
            if (e !== "No current user") {
                alert(e);
            }
        }

        setIsAuthenticating(false);
    }


    return <AuthContext.Provider value={{
        isAuthenticated,
        isAuthenticating,
        setIsAuthenticated(state) {
            setIsAuthenticated(state)
        },
    }}>
        {props.children}
    </AuthContext.Provider>
}


import { ReactNode, createContext, useState } from "react";


export interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (state: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    setIsAuthenticated() { }
})

export function AuthContextProvider(props: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    return <AuthContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated(state) {
            setIsAuthenticated(state)
        },
    }}>
        {props.children}
    </AuthContext.Provider>
}


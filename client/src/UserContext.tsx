import { createContext, useState, useEffect } from "react";
import { GetMe } from "./api";

export interface User {
    username: string;
    _id: string;
};

interface UserContextProviderProps {
    children: React.ReactNode;
};

interface UserContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext({} as UserContextValue);

function UserContextProvider({children}: UserContextProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        GetMe().then(user => {
            setUser(user);
        }).catch(e => setUser(null));
    }, [])

    return <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>
}

export default UserContextProvider;
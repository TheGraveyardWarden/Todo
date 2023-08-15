import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

interface AutheticateProps {
    element: React.ReactNode;
    beLoggedIn: boolean;
};

function Authenticate({element, beLoggedIn}: AutheticateProps) {
    const { user } = useContext(UserContext);
    const nav = useNavigate();
    useEffect(() => {
        if(beLoggedIn && !user) nav('/signup');
        else if(!beLoggedIn && user) nav('/');
        // eslint-disable-next-line
    }, [user])
    return <>
        {element}
    </>;
}

export default Authenticate;
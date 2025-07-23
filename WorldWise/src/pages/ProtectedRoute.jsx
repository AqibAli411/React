import { useEffect } from "react";
import { useAuth } from "../../Contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";


function ProtectedRoute({children}) {
    const {isAuth} = useAuth();
    const navigate = useNavigate();

    useEffect(
      function () {
        if (!isAuth) navigate("/");
      },
      [isAuth, navigate]
    );
    
    return children ;
}

export default ProtectedRoute

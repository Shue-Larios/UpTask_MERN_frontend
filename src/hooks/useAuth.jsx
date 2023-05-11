// hook para poder acceder a los datos del AuthProvider

import { useContext } from "react"
import AuthContext from "../context/AuthProvider"




export const useAuth = () => {
    
    // es para acceder a la informacion de un context
    return useContext(AuthContext) // para permitirnos acceder a los datos de algun context
}


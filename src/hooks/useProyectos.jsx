// hook para poder acceder a los datos del AuthProvider

import { useContext } from "react"
import ProyectosContext from "../context/ProyectosProvider"


export const useProyectos = () => {
    
    // es para acceder a la informacion de un context
    // hay que especificar que context
    return useContext(ProyectosContext) // para permitirnos acceder a los datos de algun context
}


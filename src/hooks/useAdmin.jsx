import { useAuth } from "./useAuth";
import { useProyectos } from "./useProyectos";

export const useAdmin = () => {
    // extraemos el proyecto y el usuario autenticado para comparar los id
    const { proyecto } = useProyectos();
    const { auth } = useAuth();


    // esto dice que si es un administrador
    return proyecto.creador === auth._id
}
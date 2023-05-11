import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clienteAxios } from "../config/clienteAxios";

// creamos el context
const AuthContext = createContext();

// provider es el que rodea toda la aplicacion
export const AuthProvider = ({ children }) => {

    // otra forma de redireccionar
    const navigate = useNavigate();

    // en auth guardo todo el perfil necesario del usuario
    const [auth, setAuth] = useState({})

    // state para hacer la espera para ver si esta lleno el state de auth de arriba
    const [cargando, setCargando] = useState(true)

    // va a comprobar si hay un token en el localStorage
    useEffect(() => {
        const autenticarUsuario = async () => {
            // getItem metodo para obtener algo del localStorage
            const token = localStorage.getItem('token')

            if (!token) {
                setCargando(false)
                return
            }

            // como el endpoint de obtener perfil requiere la autorizacion y el Bearer Token entoncs lo mandamos como configuracion
            // configuracion del Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }


            // autenticar al usuario via jWT
            try {
                // hacemos un llamado al cliente de axios
                // hacemos el envio al endpoint de obtener perfil solo ocupa q se envie el token pero se manda como configuracion esto en caso de peticion get
                const { data } = await clienteAxios('/usuarios/perfil', config)

                // llenamos este state del provider para siempre tener los datos aunq el navegador se actualice
                setAuth(data)

                // al recargar el navegador me lleva hacia esta direccion si lo quito se queda en la pagina donde recargo
                // navigate('/proyectos')
            } catch (error) {
                console.log(error);
                setAuth({})

            } finally {
                setCargando(false)
            }

        }

        autenticarUsuario(); // llamamos la funcion
    }, [])


    const cerrarSesionAuth = () => {
setAuth({})
    }

    return (
        <AuthContext.Provider
            // este provider siempre ocupa esto
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// exportamos el provider
// export {
//     AuthProvider
// }

export default AuthContext;
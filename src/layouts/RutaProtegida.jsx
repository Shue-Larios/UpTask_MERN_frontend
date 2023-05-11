// este archivo tiene la logica para evitar que el usuario visite proyectos sino esta autenticado

import { Outlet, Navigate } from "react-router-dom"
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth"



export const RutaProtegida = () => {

    const { auth, cargando } = useAuth();


    // como cargando esta true retorna esto si es false pasa 
    // cargando principal para que no se mire raro tantas pantallas de carga lo dejo vacio
    if (cargando) return ''


    
    return (
        <>
            {/* revisamos si esta o no autenticado por el auth llenado en el AuthContext */}
            {/* sino esta lo mandamos al login */}
            {auth._id
                // si esta autenticado va a mostrar el diseño del app
                ? (
                    <div className="bg-gray-100">
                        <Header />
                        <div className="md:flex md:min-h-screen">
                            <Sidebar />
                            <main className="flex-1 p-10">
                                {/* el Outlet es como decir la pagina especificada como el index en el app.jsx rutas privadas */}
                                <Outlet />
                            </main>
                        </div>
                    </div>

                )

                : <Navigate to="/" />}
        </>
    )
}

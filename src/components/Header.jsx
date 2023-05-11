import { Link } from "react-router-dom"
import { useProyectos } from "../hooks/useProyectos"
import { Busqueda } from "./Busqueda";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";


export const Header = () => {

    const { handleBuscador, cerrarSesionProyectos } = useProyectos();
    const { cerrarSesionAuth } = useAuth()


    const handleCerrarSesion = () => {
        Swal.fire({
            title: '¿Cerrar Sesion?',
            text: "Si deseas salir haz clic en Cerrar Sesion o en cancelar para continuar trabajando",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            // 3085d6
            confirmButtonText: 'Cerrar Sesion',
            cancelButtonText: 'Cancelar',
            reverseButtons: true, // cambia ubicacion de botones
        }).then((result) => {
            if (result.isConfirmed) {              
                    cerrarSesionProyectos(),
                    cerrarSesionAuth(),
                    // reseteamos/ limpiamos el localStorage
                    localStorage.removeItem('token')
            }
        })

    }

    return (
        <header className="px-4 py-5 bg-white border-b">

            <div className="md:flex md:justify-between">
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">
                    UpTask
                </h2>


                {/* este input podremos buscar por proyectos */}
                {/* <input
                    className="rounded-lg lg:w-96 block p-2 border"
                    type="search"
                    placeholder="Buscar Proyecto"
                /> */}

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <button
                        className="font-bold uppercase"
                        type="button"
                        onClick={handleBuscador}
                    >
                        Buscar Proyectos
                    </button>
                    <Link
                        title="Ver todos los proyectos"
                        to='/proyectos'
                        className="font-bold uppercase"

                    >
                        Proyectos
                    </Link>
                    {/* con flex hago que se pongan al lado utilizo gap para dar separacion entre elementos */}
                    <button className="flex items-center gap-2 text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold" title="Cerrar Sesion"
                        onClick={handleCerrarSesion}
                    >
                        Cerrar Sesion
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>


                    </button>
                    <Busqueda />
                </div>

            </div>

        </header>
    )
}

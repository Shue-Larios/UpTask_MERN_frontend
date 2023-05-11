// este vo a inyectar el contenido de los componentes hijos q definimos a este routing
import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
    
    return (
        <>
            {/* el main es el area principal */}
            {/* md:mt-20este es un query que pone mas marginTop a dispositivos grandes */}
            <main className='container mx-auto mt-5 md:mt-5   md:flex md:justify-center'>
            {/* container mx-auto mt-5 md:mt-20   md:flex md:justify-center */}
                {/* un width de 2 terceras partes de la pantalla pero en un tamaño mas grande (lg) va a tomar la mitad */}
                <div className='md:w-2/3 lg:w-2/5'>
                    <Outlet />
                </div>

            </main>
        </>
    )
}

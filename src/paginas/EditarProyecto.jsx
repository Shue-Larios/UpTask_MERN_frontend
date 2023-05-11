import { useEffect } from "react";
import {  useParams } from "react-router-dom";
import { FormularioProyecto } from "../components/FormularioProyecto";
import { useProyectos } from "../hooks/useProyectos"
import { SpinnerCircularSplit } from 'spinners-react';
 



export const EditarProyecto = () => {

  // para leer el parametro de la url
  const { id } = useParams();


  const { obtenerProyecto, proyecto, setProyecto, cargando, eliminarProyecto } = useProyectos();


  useEffect(() => {
    // asi obtengo el proyecto sin perder informacion al actualizar el navegador
    obtenerProyecto(id);
  }, [])

  const handleClick = async () => {
    if (confirm('¿Deseas eliminar este proyecto?')) {
      // mando el proyecto._id para tener el id verdadero no pongo el de params xk si lo modificaron al backend puede volver un error
      await eliminarProyecto(proyecto._id)
      
    }
  }

  // extraemos los campos a ocupar del state guardado en el context/provider
  const { nombre } = proyecto



   // para mostrar la palabra cargando mientras consulta la api
   if (cargando) return  (
    <div className='flex h-96 justify-center items-center'>
      <div>
        <	SpinnerCircularSplit size={80} color="rgba(2, 132, 199)" speed={100} />
        <h3 className='font-black'>Cargando...</h3>
      </div>
    </div>
  )



  return (
    <>




      <div className='flex justify-between items-center  '>
        <h1 className='font-black text-4xl'>
          Editar Proyecto: {nombre}
        </h1>
        {/* para poner icono y texto al lado */}
        <div className='flex item-center gap-2 text-gray-400 hover:text-black cursor-pointer'>
          {/* este es un icono de heroicons que copie la parte que dice JSX */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>


          <button className='uppercase font-bold'
            onClick={() => handleClick()}
          >
            Eliminar</button>

        </div>
      </div>

















      <div className="mt-10 flex justify-center">
        {/* mostramos el componenten del formulario */}
        <FormularioProyecto />
      </div>
    </>

  )
}

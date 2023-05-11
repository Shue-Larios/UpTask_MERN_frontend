import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'

import { useProyectos } from '../hooks/useProyectos';
import { SpinnerCircularSplit } from 'spinners-react';
import { ModalFormularioTarea } from '../components/ModalFormularioTarea';
import { Tarea } from '../components/Tarea';
import { ModalEliminarTarea } from '../components/ModalEliminarTarea';
import { Alerta } from '../components/Alerta';
import { Colaborador } from '../components/Colaborador';
import { ModalEliminarColaborador } from '../components/ModalEliminarColaborador';
import { useAdmin } from '../hooks/useAdmin';
import io from 'socket.io-client';

let socket; //inicializarla asi siempre

export const Proyecto = () => {

  const { id } = useParams();

  const admin = useAdmin();



  const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea } = useProyectos();

  // extraemos los campos a ocupar del state guardado en el context/provider
  const { nombre } = proyecto



  // useEffect para obtener el proyecto
  useEffect(() => {
    obtenerProyecto(id);
  }, [])

  // useEffect para conectarme al socket io
  // solo se ejecuta una ves para abrir ese cuarto
  useEffect(() => {
    // toma la url hacia donde nos vamos a conectar (usar siempre variables de entorno)
    socket = io(import.meta.env.VITE_BACKEND_URL);

    // crear un evento
    socket.emit('abrir proyecto', id)
  }, [])// en este caso solo se va a ejecutar una vez por eso lo pongo 

  // este otro se ejecuta todo el tiempo tambien funciona con sl socket io
  useEffect(() => {
    socket.on('tarea agregada', (tareaNueva) => {
      console.log(tareaNueva);
      //  con este if comparo que los id sean iguales CUIDADO CON COMPARAR LOS ID
      // para asi iterar en state q se va actualizar
      if (tareaNueva.proyecto === proyecto._id) {
        // paso la tarea nueva a una funcion de socket io en el proyectoProvider 
        submitTareasProyecto(tareaNueva);
      }
    })
    // paso 3 eliminar
    socket.on('tarea eliminada', (tareaEliminada) => {
      if (tareaEliminada.proyecto === proyecto._id) {
        // paso la tarea nueva a una funcion de socket io en el proyectoProvider 
        eliminarTareaProyecto(tareaEliminada);
      }
    })


    socket.on('tarea actualizada', (tareaActualizada) => {
     
      if (tareaActualizada.proyecto._id === proyecto._id) {
        // paso la tarea nueva a una funcion de socket io en el proyectoProvider 
        actualizarTareaProyecto(tareaActualizada);
      }
    })


    socket.on('nuevo estado', (tareaCompletada) => {
      if (tareaCompletada.proyecto._id === proyecto._id) {
        // paso la tarea nueva a una funcion de socket io en el proyectoProvider 
        cambiarEstadoTarea(tareaCompletada);
      }
    })
  },)

  const { msg } = alerta

  return (
    // para mostrar una alerta si no tiene permisos para ver el proyecto solo si el error es true

    // cuando esta en true pone el spinner sino muestra el resto
    cargando ? (
      <div className='flex h-96 justify-center items-center'>
        <div>
          <	SpinnerCircularSplit size={80} color="rgba(2, 132, 199)" speed={100} />
          <h3 className='font-black'>Cargando...</h3>
        </div>

      </div>
    )
      : (
        <>
          <div className='flex justify-between items-center'>
            <h1 className='font-black text-4xl'>
              {nombre}
            </h1>
            {/* aca admin hace una comparativa en un hook si es admin regresa true y muestra el botones sino no */}
            {admin && (
              // {/* para poner icono y texto al lado */}
              <div className='text-gray-400 hover:text-black cursor-pointer'>
                {/* este es un icono de heroicons que copie la parte que dice JSX */}
                <Link
                  className='uppercase font-bold flex gap-2'
                  to={`/proyectos/editar/${id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg> Editar
                </Link>

              </div>
            )}
          </div>
          {admin && (
            <button
              onClick={handleModalTarea}
              className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-2 flex gap-2 items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nueva Tarea
            </button>
          )}

          <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>


          <div className='bg-white shadow mt-10 rounded-lg'>
            {/* comprobar si hay tareas en el proyecto */}
            {proyecto.tareas?.length
              ?
              // para mapear datos y mostrarlos en un componente
              proyecto.tareas?.map(row => (
                <Tarea
                  // solo el el id de la linea
                  key={row._id}
                  // con row le paso la linea completa
                  tarea={row}
                />
              ))
              : <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
          </div>

          {admin && (
            <>
              <div className='flex justify-between items-center mt-10'>
                <p className='font-bold text-xl'>Colaboradores</p>
                <Link
                  className='flex gap-2 text-gray-400 uppercase font-bold hover:text-black cursor-pointer'
                  to={`/proyectos/nuevo-colaborador/${proyecto._id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Añadir
                </Link>
              </div>

              <div className='bg-white shadow mt-10 rounded-lg'>
                {/* comprobar si hay colaboradores en el proyecto*/}
                {proyecto.colaboradores?.length
                  ?
                  // para mapear datos de ese campo y mostrarlos en un componente
                  proyecto.colaboradores?.map(row => (
                    <Colaborador
                      // solo el el id de la linea
                      key={row._id}
                      // con row le paso la linea completa
                      colaborador={row}
                    />
                  ))
                  : <p className='text-center my-5 p-10'>No hay Colaboradores en este proyecto</p>}
              </div>

            </>
          )}


          <ModalFormularioTarea />
          <ModalEliminarTarea />
          <ModalEliminarColaborador />
        </>

      )
  )

}

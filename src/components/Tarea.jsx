import { formatearFecha } from "../helpers/formatearFecha"
import { useAdmin } from "../hooks/useAdmin";
import { useProyectos } from "../hooks/useProyectos";


export const Tarea = ({ tarea }) => {

    // esta es una funcion en al provider para editar la tarea se hace mas facil asi x abrir el modal y el resto
    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos();



    const { descripcion, nombre, prioridad, estado, fechaEntrega, _id } = tarea

    // para mostrar/ocultar cosas con el hook si no es el admin
    const admin = useAdmin();

    

    return (
        <div className="border-b p-5 flex justify-between items-center">

            <div className="flex flex-col items-start">
                <p className="mb-1 text-xl">{nombre} </p>
                <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion} </p>
                <p className="mb-1 text-xl">Prioridad: {prioridad} </p>
                <p className="mb-1  text-gray-600">{formatearFecha(fechaEntrega)} </p>
                {/* muestra quien la completo si el estado esta como true */}
                 {estado &&
                    <p 
                    className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white"
                    >Completada por: {tarea.completado.nombre}</p>
                }  
            </div>

            <div className="flex pl-2 flex-col lg:flex-row gap-1">
                {/* boton editar */}
                {/* para mostrar/ocultar */}
                {admin && (
                    <button className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" onClick={() => handleModalEditarTarea(tarea)}>Editar</button>
                )}

                {/* botones de completado */}
                {/* para mostrar colores de forma condicional */}

                <button className={`${estado ? 'bg-sky-600' : 'bg-gray-600'}  px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                    onClick={() => completarTarea(_id)}
                >{estado ? 'Completa' : 'Incompleta'} </button>


                {/* boton de eliminar */}
                {admin && (
                    <button className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                        onClick={() => handleModalEliminarTarea(tarea)}>
                        Eliminar
                    </button>
                )}
            </div>




        </div>
    )
}

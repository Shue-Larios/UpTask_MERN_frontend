import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { useProyectos } from "../hooks/useProyectos";
import { Alerta } from "./Alerta";


export const FormularioProyecto = () => {

    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [cliente, setCliente] = useState('');

    // extraemos la funcion desde el context
    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            // para agregar al provider esto
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }
        // aca pasamos los datos al provider
        // await espera que finalice correctamente la accion 
        await submitProyecto({ id, nombre, descripcion, fechaEntrega, cliente })

        setId(null);
        setNombre('');
        setDescripcion('');
        setFechaEntrega('');
        setCliente('');
    }

    // para que el formulario detecte si estamos creando o actualizando un proyecto
    const params = useParams()

    useEffect(() => {
        // agrego los datos que estan en el state del proyecto
        if (params.id) {
            setId(proyecto?._id);
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            // el ? comprueba si existe ese valor sino existe no marca error si existe va hacer lo que dice el codigo este ? se conoce como encadenamiento opcional (optional chaining)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]);
            setCliente(proyecto.cliente);
        }
    }, [proyecto])


 


    const { msg } = alerta

    return (
        <>

            <form onSubmit={handleSubmit}
                className="bg-white py-10 px-5 md:w1/2 rounded-lg shadow">

                {/* para mostrar la alerta con una funcion en el context */}
                {msg && <Alerta alerta={alerta} />}


                {/* div del nombre */}
                <div className="mb-5">
                    <label htmlFor="nombre" className="text-gray-700 uppercase font-bold text-sm">Nombre Proyecto</label>
                    <input
                        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        id="nombre"
                        placeholder="Nombre del Proyecto"
                        type="text"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                </div>

                {/* div de la descripcion */}
                <div className="mb-5">
                    <label htmlFor="descripcion" className="text-gray-700 uppercase font-bold text-sm">Descripcion Proyecto</label>
                    <textarea
                        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        id="descripcion"
                        placeholder="Descripcion del Proyecto"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                    />
                </div>

                {/* div de la fecha */}
                <div className="mb-5">
                    <label htmlFor="fecha-entrega" className="text-gray-700 uppercase font-bold text-sm">Fecha Entrega</label>
                    <input
                        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        id="fecha-entrega"
                        type="date"
                        value={fechaEntrega}
                        onChange={e => setFechaEntrega(e.target.value)}
                    />
                </div>

                {/* div del cliente */}
                <div className="mb-5">
                    <label htmlFor="cliente" className="text-gray-700 uppercase font-bold text-sm">Cliente </label>
                    <input
                        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        id="cliente"
                        placeholder="Nombre del Cliente"
                        type="text"
                        value={cliente}
                        onChange={e => setCliente(e.target.value)}
                    />
                </div>

                <input
                    className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
                    type="submit"

                    //   aca dice si hay un id pone el boton actualizar sino crear condicion de javascript

                    value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}

                />
            </form>
        </>
    )
}

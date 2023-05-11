import { createContext, useEffect, useState } from "react"
import { clienteAxios } from "../config/clienteAxios"
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import { useAuth } from "../hooks/useAuth";
 

let socket;

const ProyectosContext = createContext()


export const ProyectosProvider = ({ children }) => {

    const navigate = useNavigate()

    const { auth } = useAuth()

    // stos state son los que veo en el  provider del navegador (components) 
    const [proyectos, setProyectos] = useState([]); // para todos los proyectos es un arreglo
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({}); // para un solo proyecto este es un objeto
    // state de cargando para evitar mostrar el nombre del proyecto anterior cuando ves otro proyecto
    const [cargando, setCargando] = useState(false)
    // para abrir o cerrar el modal de crear tarea
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)

    // state para dentificar la tarea
    const [tarea, setTarea] = useState({})

    // no pueden ser el mismo state del otro modal xk son cosas diferentes
    // para abrir o cerrar el modal de eliminar tarea
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)

    // state para el colaborador encontrado cuando se agregan
    const [colaborador, setColaborador] = useState({})


    // state para abrir el modal y eliminar colaborador
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)

    // para el modal buscador de proyectos
    const [buscador, setBuscador] = useState(false)

    // para obtener todos los proyectos
    useEffect(() => {
        const obtenerProyectos = async (e) => {

            try {
                const token = localStorage.getItem('token')
                if (!token) return  // sino hay un token
                // creamos la configuracion para el Bearer Token
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos();
    }, [auth])  // le pongo el auth xk cuando ingresa no carga los proyecto entoncs asi cada que auth cambie se va a ejecutar el useeffect



    // useEffect que se encarga unicamente de la conexion a socket io
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, [])



    // creamos una funcion para compartir
    // asi agregamos la alerta al context
    const mostrarAlerta = (alerta) => {
        setAlerta(alerta)

        // reseteo el valor de la alerta dspues de 5seg.
        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }

    // esta funcion manda a llamar la funcion se crear o editar proyecto
    const submitProyecto = async (proyecto) => {
        if (proyecto.id) {
            await editarProyecto(proyecto);
        } else {
            await nuevoProyecto(proyecto);
        }
    }

    // funcion para crear un proyecto
    const nuevoProyecto = async (proyecto) => {
        //   agregamos el proyecto a nuestra api
        try {
            // requerimos el token qu esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }
            // orden en caso de un post
            // 1) url del endpoint de postman
            // 2) los datos que vamos a pasar
            // 3) la configuracion del token
            // esta data nos retorna todo lo que tiene la base en ese endpoint
            // despues de esta peticion ya se guarda en la base de datos
            const { data } = await clienteAxios.post('/proyectos', proyecto, config)

            // tomo una copia de proyectos y le agrego data de la consulta anterior esto para cuando agregue uno nuevo se actualice solo sin user el useEfeect
            setProyectos([...proyectos, data])

            //    creamos una alerta de creo el proyecto correctamente
            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            // mandamos a la pantalla proyectos dspues de tantos segundos de almacenar
            setTimeout(() => {
                setAlerta({}) // reinicio para que no se quede con datos este state
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error);
        }

    }

    // funcion para editar el proyecto
    const editarProyecto = async (proyecto) => {
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }

            // orden en caso de un post
            // 1) url del endpoint de postman
            // 2) los datos que vamos a pasar
            // 3) la configuracion del token
            // esta data nos retorna todo lo que tiene la base en ese endpoint
            // despues de esta peticion ya se guarda en la base de datos
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)


            //  Sincronizar el state 
            // si lo hago como se hace en nuevoProyecto me tira un error de id del actualizado 
            // ? data dice que si cumple agrege este sino cumple agrega lo de proyectostate  : proyectoState
            const proyectosActualizado = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            // agrego todo lo de la variable proyectoState al state de proyectos asi se actualizan todos
            setProyectos(proyectosActualizado)

            //    creamos una alerta de creo el proyecto correctamente
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })

            // mandamos a la pantalla proyectos dspues de tantos segundos de almacenar
            setTimeout(() => {
                setAlerta({}) // reinicio para que no se quede con datos este state
                navigate('/proyectos')
            }, 3000);


        } catch (error) {
            console.log(error);
        }
    }



    // funcion para obtener un solo proyecto que toma un id
    const obtenerProyecto = async (id) => {
        setCargando(true)
        // para tener un proyecto tiene que estar autenticado
        // como lo se? xk sta configurado asi en postman
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }

            // hago la peticion al endpoint y comparto la config xk esta ocupa el token
            const { data } = await clienteAxios(`/proyectos/${id}`, config)

            //    agrego la informacion del proyecto al state del context y poder tenerlo disponible
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                // esto para mostrar el msj que traigo desde el backend
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async (id) => {


        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            //  Sincronizar el state al momento de borrar
            // en el filter le digo que me traiga lo distinto a lo que borre
            const proyectosActualizado = proyectos.filter(proyectoState => proyectoState._id !== id)

            setProyectos(proyectosActualizado);



            //    creamos una alerta de creo el proyecto correctamente
            setAlerta({
                // esto para mostrar el msj que traigo desde el backend
                msg: data.msg,
                error: false
            })

            // mandamos a la pantalla proyectos dspues de tantos segundos de almacenar
            setTimeout(() => {
                setAlerta({}) // reinicio para que no se quede con datos este state
                navigate('/proyectos')
            }, 3000);


        } catch (error) {
            console.log(error);
        }
    }


    // creamos una funcion para cambiar el state de abrir modal
    const handleModalTarea = () => {
        // le decimos que siempre va hacer lo contrario ala funcion original
        setModalFormularioTarea(!modalFormularioTarea)

        // reinicio el state de tarea para que este vacio cuando se agrega como esto se dispara solamente cuando doy nueva tarea asi no se llena cuando actualizo y agrego nueva
        setTarea({})
    }


    // creamos una funcion para crear y actualizar la tarea 
    const submitTarea = async (tarea) => {
        //    si existe tarea id va a llamar la funcion de actualiar
        if (tarea?.id) {
            await editarTarea(tarea);
        } else {
            await crearTarea(tarea);
        }


    }

    const editarTarea = async (tarea) => {
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }
            // http://localhost:4000/api/tareas
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            // SE MOVIO PARA LAS FUNCIONES DE SOCKET IO SINO ACA SE DEJA
            // hacemos una copia de las tarea que hay y agregamos la tarea actualizada
            // const proyectoActualizado = { ...proyecto }
            // proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
            // // sobreescribimos la variable
            // setProyecto(proyectoActualizado)

            // como en este caso data si regresa el objeto actualizado x eso lo coloco aca y no otra cosa
            socket.emit('actualizar tarea', data)

            setAlerta({}) //reinicio la alerta 
            setModalFormularioTarea(false) //cierro el modal de las tareas  setAlerta({})

        } catch (error) {
            console.log(error);
        }
    }

    const crearTarea = async (tarea) => {
        // enviamos los datos hacia la api
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }
            // http://localhost:4000/api/tareas
            const { data } = await clienteAxios.post('/tareas', tarea, config)


            // //Agregar la tarea al state
            // // ESTA PARTE LA COMENTE ACA XK LA PONGO PARA Q LA MANEJE EL SOCKET IO SINO TRABAJO CN EL SE DEJA ACA
            // // obtenemos una copia del proyecto
            // const proyectoActualizado = { ...proyecto }
            // // hacemos una copia de las tarea que hay y agregamos la tarea nueva
            // proyectoActualizado.tareas = [...proyecto.tareas, data]
            // // sobreescribimos la variable
            // setProyecto(proyectoActualizado)


            setAlerta({}) //reinicio la alerta 
            setModalFormularioTarea(false) //cierro el modal de las tareas

            // SOCKET IO
            // pasamos al backend la tarea que agregamos
            socket.emit('nueva tarea', data)
        } catch (error) {
            console.log(error);
        }

    }


    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea); //agrego la tarea al state de tarea
        //abro el modal
        setModalFormularioTarea(true)
    }


    const handleModalEliminarTarea = (tarea) => {
        setTarea(tarea); //agrego la tarea al state de tarea
        //abro el modal
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        // aca no le pongo que recibe una tarea xk ya esta guardada en el state en la funcion de arriba
        // console.log(tarea);
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }
            // http://localhost:4000/api/tareas/63f7c1d06020f71baa824f6d
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            // coloco una alerta que viene del backend
            setAlerta({
                msg: data.msg,
                error: false
            })
            // SE MOVIO PARA LA APRTE DE SOCKET IO SINO SE DEJA ACA
            // // hacemos una copia de las tarea que hay y agregamos la tarea actualizada
            // const proyectoActualizado = { ...proyecto }
            // // esta es la parte que actualiza el state para mostrar el ya borrado
            // // con filter sacamos un elemento del arreglo
            // proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)

            // // sobreescribimos la variable
            // setProyecto(proyectoActualizado)

            // SOCKET IO
            // pasamos al backend la tarea que agregamos
            // paso 1 eliminar
            socket.emit('eliminar tarea', tarea)

            setModalEliminarTarea(false) //cierro el modal de las tareas  setAlerta({})
            setTarea({}) // pasa hacer vacio la tarea que selecciono
            // mandamos a la pantalla proyectos dspues de tantos segundos de almacenar
            setTimeout(() => {
                setAlerta({}) // reinicio para que no se quede con datos este state
            }, 1500);



        } catch (error) {
            console.log(error.response);
        }
    }

    const submitColaborador = async (email) => {
        setCargando(true)
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores`, { email }, config)

            setColaborador(data);
            setAlerta({})
        } catch (error) {
            // console.log(error.response.data.msg);
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }

    }


    // para agregar el colaborador al proyecto una ves encontrado
    const agregarColaborador = async (email) => {
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({});

            setTimeout(() => {
                setAlerta({}) // reinicio para que no se quede con datos este state

            }, 1500);

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setColaborador({});

        }
    }


    // para cambiar el estado del state de eliminar colaborador
    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador);
    }


    const eliminarColaborador = async () => {
        // aca no le pongo que recibe un colaborador xk ya esta guardada en el state en la funcion de arriba
        // console.log(colaborador);
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }
            // { id: colaborador._id } este dato cae al backend como si  fuera del req.doby
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)


            // // coloco una alerta que viene del backend
            setAlerta({
                msg: data.msg,
                error: false
            })


            // hacemos una copia de las proyecto 
            const proyectoActualizado = { ...proyecto }
            // esta es la parte que actualiza el state para mostrar el ya borrado
            // con filter sacamos un elemento del arreglo
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)

            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({}) // reinicio para que no se quede con datos este state

            }, 1500);
        } catch (error) {
            console.log(error.response);
        }
    }

    // para marcar una tarea como completa
    const completarTarea = async (id) => {
        try {
            // requerimos el token que esta guardado en el localstorage
            const token = localStorage.getItem('token')

            if (!token) return  // sino hay un token

            // creamos la configuracion para el Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    // importante es que en el checkAuth estamos revisando que sea por Bearer Token si fuera diferente igual se pone diferente aca
                    Authorization: `Bearer ${token}`
                }
            }
            // { id: colaborador._id } este dato cae al backend como si  fuera del req.doby
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            // COMO PASO A SOCKET IO SINO ACA SE DEJA
            //    actualizamos el state
            // const proyectoActualizado = { ...proyecto } //tomamos una copia
            // proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
            // setProyecto(proyectoActualizado);
            socket.emit('cambiar estado', data)

            setTarea({})
            setAlerta({})
        } catch (error) {
            console.log(error.response);
        }
    }

    // para el boton de buscar
    const handleBuscador = () => {
        // cambia el valor de lo que ya esta lo contrario
        setBuscador(!buscador)
    }

    // FUNCIONES PARA SOCKET IO
    // para agregar tareas
    const submitTareasProyecto = (tarea) => {
        //Agregar la tarea al state
        // obtenemos una copia del proyecto
        const proyectoActualizado = { ...proyecto }
        // hacemos una copia de las tarea que hay y agregamos la tarea nueva
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        // sobreescribimos la variable
        setProyecto(proyectoActualizado)
    }
    const eliminarTareaProyecto = (tarea) => {
        // hacemos una copia de las tarea que hay y agregamos la tarea actualizada
        const proyectoActualizado = { ...proyecto }
        // esta es la parte que actualiza el state para mostrar el ya borrado
        // con filter sacamos un elemento del arreglo
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)

        // sobreescribimos la variable
        setProyecto(proyectoActualizado)
    }
    const actualizarTareaProyecto = (tarea) => {
        //   hacemos una copia de las tarea que hay y agregamos la tarea actualizada
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        // sobreescribimos la variable
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = (tarea) => {
        const proyectoActualizado = { ...proyecto } //tomamos una copia
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado);
    }

    // para cerrar la sesion
    const cerrarSesionProyectos = () => {
        setProyectos([]) //vuelve hacer un arreglo vacio
        setProyecto({}) //vuelve hacer un objeto vacio
        setAlerta({})
    }
    return (
        <ProyectosContext.Provider
            // aca es donde hacemos disponibles todo disponible
            value={{
                // todos los proyectos
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                // hago disponible la informacion del proyecto solo
                proyecto,
                setProyecto,
                // para mostrar cuando este cargando
                cargando,
                eliminarProyecto,
                // para el modal
                modalFormularioTarea,
                handleModalTarea,
                // para las tareas
                submitTarea,
                handleModalEditarTarea,
                tarea,
                completarTarea,
                // para el modal de eliminar tarea
                modalEliminarTarea, // paso este para leerlo
                handleModalEliminarTarea, // paso este para actualizarlo
                eliminarTarea,
                // para los colaborador
                colaborador,
                setColaborador,
                submitColaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                // para el modal de buscar proyecto
                handleBuscador, // funcion 
                buscador, // el state
                // funciones de socket io
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                // cerrar la sesion
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}


export default ProyectosContext;
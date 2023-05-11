import { useEffect } from "react";
import { Alerta } from "../components/Alerta";
import { PreviewProyecto } from "../components/PreviewProyecto";
import { useProyectos } from "../hooks/useProyectos"
import io from 'socket.io-client'

// Socket.io
let socket; //variable q inicia vacia se va a llenar segun se ejecute el codigo

export const Proyectos = () => {
  const { proyectos, alerta } = useProyectos() // como es funcion la llamamos asi


  // INICIO DE CONFIGURACION (PROBAR SI FUNCIONA) DE SOCKET IO CLIENTE
  // para que el socket.io inice al cargar este componente (se pone en el componente que vaya a usar)
  // useEffect(() => {
    // toma la url hacia donde nos vamos a conectar (usar siempre variables de entorno)
    // socket = io(import.meta.env.VITE_BACKEND_URL);
    // EMIT lo que hace es emitir un evento hacia el socket io (backend) idenfiticado por un string
    // dentro de '' se le pone un nombre al evento el segundo campos son datos que puedo mandar al socket io
    // socket.emit('prueba', proyectos)
    // // asi recibimos datos desde socket io dentro del (data) 
    // socket.ON es que es lo que voy hacer cuando el evento ocurra
    // socket.on('respuesta', (data) => {
    //   console.log('desde el cliente de socket io', data);
    // })  
    //},) // este useEffect que tiene el socker io siempre dejarlo sin dependencias o sea [] para q siempre escuche los cambios
    // FIN DE CONFIGURACION (PROBAR SI FUNCIONA) DE SOCKET IO CLIENTE





    const { msg } = alerta
    return (
      <>
        <h1 className="text-4xl font-bold">Proyectos</h1>

        {msg && <Alerta alerta={alerta} />}

        <div className="bg-white shadow mt-10 rounded-lg">
          {proyectos.length
            // vamos a iteras sobre los proyectos
            // en este caso utilizamos () en ves de {}
            ? proyectos.map(proyecto => (
              // aca usamos un nuevo componente y pasamos cosas por props
              <PreviewProyecto
                key={proyecto._id}
                proyecto={proyecto} />
            ))
            : <p className="text-center text-gray-600 uppercase p-5">No hay proyectos aún</p>
          }
        </div>
      </>
    )
  }

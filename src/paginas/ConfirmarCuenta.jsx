import { useEffect, useState } from "react"

import { useParams, Link } from 'react-router-dom'

import { Alerta } from "../components/Alerta"
import { clienteAxios } from "../config/clienteAxios"



export const ConfirmarCuenta = () => {

  const [alerta, setAlerta] = useState({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)


  // identificar el token
  const { id } = useParams()


  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
         
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios(url)
        
        setAlerta({
          msg: data.msg,
          error: false
        })

        setCuentaConfirmada(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    // // mandamos a llamar la funcion creada
    confirmarCuenta();
  }, [])




  const { msg } = alerta


  return (
    <>
      {/* capitalize pone la primera letra mayuscula */}
      <h1 className="text-sky-600 font-black text-5xl capitalize">Confirma tu cuenta y comienza a crear tus {''}
        {/*  {''} //esto es un espacio en blanco */}
        <span className="text-slate-700">proyectos</span>
      </h1>

      <div className="mt-20 ms:mt-10 shadow-lg px-5 py-10 rounded-lg bg-white">
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada && (
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm hover:text-blue-700'
            to="/"
          >Inicia Sesion
          </Link>
        )}
      </div>


    </>
  )
}

import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Alerta } from "../components/Alerta"
 
import { clienteAxios } from "../config/clienteAxios"


export const NuevoPassword = () => {

  // lo tengo almacenado como token en el app.jsx en el endpoint de olvide-password/:token
  const { token } = useParams()
  const [alerta, setAlerta] = useState({})
  const [password, setPassword] = useState('')
  const [passwordModificado, setPasswordModificado] = useState(false)

  const [tokenValido, setTokenValido] = useState(false)


  useEffect(() => {
    const comprobarToken = async () => {
      try {
        // los endpoint que tienen axios si son los de postman
        const url = `/usuarios/olvide-password/${token}`
        await clienteAxios(url)

        setTokenValido(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    // // mandamos a llamar la funcion creada
    comprobarToken();
  }, [])

  // esta es la funcion cuando ya estoy mandando el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // que la contraseña sea mayor a 6 caracteres
    if (password.length < 6) {
      setAlerta({
        msg: 'El Password debe ser minimo de 6 caracteres',
        error: true
      })
      return
    }

    try {
      // si todo esta bien mandamo la peticion a la url de postman
      const url = `/usuarios/olvide-password/${token}`
      // despues de la como mando los datos que necesita postman
      const { data } = await clienteAxios.post(url, { password })
      setAlerta({
        msg: data.msg,
        error: false
      })
      setPasswordModificado(true)
      setPassword('')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }


  // extraemos el msj de la alerta
  const { msg } = alerta

  return (

    <>
      {/* capitalize pone la primera letra mayuscula */}
      <h1 className="text-sky-600 font-black text-5xl capitalize">Reestablece tu password y no pierdas acceso a tus {''}
        {/*  {''} //esto es un espacio en blanco */}
        <span className="text-slate-700">proyectos</span>
      </h1>

      {/* mostrar la alerta si el token es invalido */}
      {msg && <Alerta alerta={alerta} />}

 {/* para mostrar el enlace de iniciar sesion */}
 {passwordModificado && (
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm hover:text-blue-700'
          to="/"
        >Inicia Sesion
        </Link>
      )}

      {/* si el token es true retorna todo el formulario */}
      {tokenValido && (
        <form onSubmit={handleSubmit}
          className="my-10 bg-white shadow rounded-lg p-10">


          {/* div del password */}
          <div className="my-5 ">
            <label className="uppercase text-gray-600 block text-xl font-bold"
              // htmlFor determina el id del elemento asi al dar clic al label pone el focus en el input
              htmlFor="password"
            >Nuevo Password</label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu Nuevo Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Guardas Nuevo Password"
            className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded
  hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}

     


    </>
  )
}

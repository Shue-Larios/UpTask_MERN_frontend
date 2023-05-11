import { useState } from "react"
import { Link } from "react-router-dom"
import { Alerta } from "../components/Alerta"
import { clienteAxios } from "../config/clienteAxios"


export const OlvidePassword = () => {

  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({})


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (email === '' || email.length < 6) {
      setAlerta({
        msg: 'El email es obligatorio',
        error: true
      })
      return
    }

    try {
      // despues de la coma van los datos que necesito enviar
      // TODO: mover hacia un cliente Axios
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })

      setAlerta({
        // data es el que stoy extrayendo en la linea de arriba
        msg: data.msg,
        error: false
      })
      setEmail('')

    } catch (error) {
      // console.log(error.response.data.msg); // probar si traigo un error desde el backend
      setAlerta({
        // para ver el error que traigo desde el backend
        msg: error.response.data.msg,
        error: true
      })
    }



  }

  const { msg } = alerta

  return (
    <>
      {/* capitalize pone la primera letra mayuscula */}
      <h1 className="text-sky-600 font-black text-5xl capitalize">Recupera tu acceso y no pierdas tus {''}
        {/*  {''} //esto es un espacio en blanco */}
        <span className="text-slate-700">proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}


      <form onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10">



        {/* div del email */}
        <div className="my-5 ">
          <label className="uppercase text-gray-600 block text-xl font-bold"
            // htmlFor determina el id del elemento asi al dar clic al label pone el focus en el input
            htmlFor="email"
          >Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>


        <input
          type="submit"
          value="Enviar Instrucciones"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded
          hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm hover:text-blue-700'
          to="/"
        >¿Ya tienes una cuenta? <br /> Inicia Sesion
        </Link>
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm hover:text-blue-700'
          to="/registrar"
        >¿No tienes una cuenta?  <br /> Registrate
        </Link>
      </nav>

    </>
  )
}

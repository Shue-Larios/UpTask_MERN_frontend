import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Alerta } from "../components/Alerta"
import { clienteAxios } from "../config/clienteAxios"


export const Registrar = () => {



  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [alerta, setAlerta] = useState({})


  const handleSubmit = async (e) => {
    e.preventDefault() // prevenir la accion por default

    // validar que los campos no vengan vacios
    // el [] dentro del if es convertir una variable string hacia un arreglo
    // .includes('') dice que si uno de los arreglos viene vacio
    if ([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        // type: 'Error', para poner como un tipo de error si uso sweetalert2
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return // para que no se siga ejecutando el codigo
    }

    // si las contraseñas son diferentes
    if (password !== repetirPassword) {
      setAlerta({
        msg: 'Los Password no son iguales',
        error: true
      })
      return // para que no se siga ejecutando el codigo
    }

    // si las contraseñas es menor de 6 caracteres
    if (password.length < 6) {
      setAlerta({
        msg: 'El Password es muy corto, agrega minimo 6 caracteres',
        error: true
      })
      return // para que no se siga ejecutando el codigo
    }

    // si todo esta bien la alarta vuelve hacer vacia
    setAlerta({})

    // crear el usuario en la API
    try {
      // despues de la url del api van los datos q enviamos
      //  aplicamos distroccion y data en esta parte es acceso directo a mi informacion
      //  asi utilizamos las variables de entorno con VITE import.meta.env.(nombre de la variable de entorno)
      // cliente de axios es un metodo que tiene la base de la url
      const { data } = await clienteAxios.post(`/usuarios`, { nombre, email, password })
      // console.log(data.msg);
      setAlerta({
        msg: data.msg,
        error: false
      })

      // reiniciamos el formulario
      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')
    } catch (error) {
      // error.response para acceder con axios a los errores mandados desde el backend ejm res.status(400).json({ msg: error.message })
      // console.log(error.response.data.msg);
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }


  const { msg } = alerta

  // para hacer que siempre me muestre la pantalla desde arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [alerta])
  return (
    <>
      {/* capitalize pone la primera letra mayuscula */}
      <h1 className="text-sky-600 font-black text-5xl capitalize">Crea tu cuenta y administra tus {''}
        {/*  {''} //esto es un espacio en blanco */}
        <span className="text-slate-700">proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10">

        {/* div del nombre */}
        <div className="my-5 ">
          <label className="uppercase text-gray-600 block text-xl font-bold"
            // htmlFor determina el id del elemento asi al dar clic al label pone el focus en el input
            htmlFor="nombre"
          >Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu Nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

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

        {/* div del password */}
        <div className="my-5 ">
          <label className="uppercase text-gray-600 block text-xl font-bold"
            // htmlFor determina el id del elemento asi al dar clic al label pone el focus en el input
            htmlFor="password"
          >Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* div del repetir password */}
        <div className="my-5 ">
          <label className="uppercase text-gray-600 block text-xl font-bold"
            // htmlFor determina el id del elemento asi al dar clic al label pone el focus en el input
            htmlFor="password2"
          >Repetir Password</label>
          <input
            id="password2"
            type="password"
            placeholder="Repitir tu Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded
            hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm hover:text-blue-700'
          to="/"
        >¿Ya tienes una cuenta? Inicia Sesion
        </Link>
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm hover:text-blue-700'
          to="/olvide-password"
        >Olvide Mi Password
        </Link>
      </nav>

    </>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alerta } from '../components/Alerta'
import { clienteAxios } from '../config/clienteAxios'
import { useAuth } from '../hooks/useAuth'

export const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alerta, setAlerta] = useState({})

    const { setAuth } = useAuth(); // como es una funcion la llamamos con ()

    const navigate = useNavigate();

    const hanldeSubmit = async (e) => {
        e.preventDefault()

        // para evitar que los campos esten vacios
        if ([email, password].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        // si todo esto esta bien vamos a consultar nuestra api para autenticar al usuario
        try {
            // siempre que haga consultar a axios o backend poner el async/await
            // data para tener el resultado de la consulta
            const { data } = await clienteAxios.post('/usuarios/login', { email, password })

            setAlerta({})

            // almacenar el token en el localStorage
            // el primero es el nombre y segundo va el dato que guardo
            localStorage.setItem('token', data.token)

            // si todo esta bien pasamos/llenamos la informacion al state del AuthProvider
            setAuth(data)

            // redireccionamos al usuario a la pagina principal
            navigate('/proyectos')
        } catch (error) {
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
    }, [])
    return (
        <>
            {/* capitalize pone la primera letra mayuscula */}
            <h1 className="text-sky-600 font-black text-5xl capitalize">Inicia sesion y administra tus {''}
                {/*  {''} //esto es un espacio en blanco */}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}

            <form onSubmit={hanldeSubmit}
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

                <input
                    type="submit"
                    value="Iniciar Sesion"
                    className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded
                    hover:cursor-pointer hover:bg-sky-800 transition-colors"
                />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    className='block text-center my-5 text-slate-500 uppercase text-sm hover:text-blue-700'
                    to="/registrar"
                >¿No tienes una cuenta?  <br /> Registrate
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

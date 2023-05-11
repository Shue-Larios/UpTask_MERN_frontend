import { useState } from "react"
import { useProyectos } from "../hooks/useProyectos"
import { Alerta } from "./Alerta"


export const FormularioColaborador = () => {

  const { mostrarAlerta, alerta, submitColaborador } = useProyectos()

  const [email, setEmail] = useState('')


  const handleSubmit = e => {
    e.preventDefault();

    // comprobamos su el email sta vacio
    if (email === '') {
      mostrarAlerta({
        msg: 'El Email es Obligatorio',
        error: true
      })
      return
    }

    submitColaborador(email)
  }


  const { msg } = alerta

  return (
    <form
      onSubmit={handleSubmit}
      action=""
      className="bg-white py-10 px-5 w-full md:w-1/2 rounded shadow"
    >
      {/* si hay un mensaje muestra la alerta */}
      {msg && <Alerta alerta={alerta} />}
      <div className="mg-5">
        {/* input del nombre del proyecto */}
        <div className='mb-5'>
          <label className='text-gray-700 uppercase font-bold text-sm' htmlFor="email">Email Colaborador</label>
          <input className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md' type="email" id='email' placeholder='Email del usuario'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <input type="submit"
        className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-lg text-sm' value='Buscar Colaborador' />
    </form>
  )
}




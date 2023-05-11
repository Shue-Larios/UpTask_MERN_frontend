import { useEffect } from "react"
import { FormularioColaborador } from "../components/FormularioColaborador"
import { useProyectos } from "../hooks/useProyectos";
import { useParams } from "react-router-dom";
import { SpinnerCircularSplit } from 'spinners-react';

export const NuevoColaborador = () => {

  const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador } = useProyectos()

  const { id } = useParams()



  // sirve para cuando le voy actualzar a la pagina no pierda los datos
  useEffect(() => {
    obtenerProyecto(id)
  }, []);

  // para mostrar la palabra cargando mientras consulta la api
  if (cargando) return (
    <div className='flex h-96 justify-center items-center'>
      <div>
        <	SpinnerCircularSplit size={80} color="rgba(2, 132, 199)" speed={100} />
        <h3 className='font-black'>Cargando...</h3>
      </div>
    </div>
  )

  return (
    <>



      <h1 className="text-4xl font-black">Añadir Colaborador(a) al Proyecto: {proyecto.nombre}</h1>


      <div className="mt-10 flex justify-center">
        <FormularioColaborador />


      </div>

      {/* compruebo si esta cargando y cuando pase a false muestra el div */}
      {/* dentro de los '' puedo poner cargando pero como puse un spinner lo dejo en blanco se mira mejor */}
      {cargando ? 'Cargando'
        : colaborador?._id && (
          <div className="flex justify-center mt-10">
            <div className="bg-white py-10 px-5 md:w-1/2 rounded shadow w-full">
              <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>

              <div className="flex flex-col gap-3  md:flex-row justify-between items-center">
                <div>
                  <p> {colaborador.nombre} </p>
                  <p className='text-sm text-gray-500'>
                  {colaborador.email}
                  </p>
                </div>

                <button
                type="button"
                className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm hover:bg-black"
                onClick={() => agregarColaborador({
                  email: colaborador.email
                })}
                >Agregar al Proyecto</button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

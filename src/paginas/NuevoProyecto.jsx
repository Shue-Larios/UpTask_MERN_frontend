import { FormularioProyecto } from "../components/FormularioProyecto"

export const NuevoProyecto = () => {
    return (
        <>
            <h1 className="text-4xl font-bold">Crear Proyecto</h1>

            <div className="mt-10 flex justify-center">
             {/* mostramos el componenten del formulario */}
             <FormularioProyecto />
            </div>

        </>
    )
}

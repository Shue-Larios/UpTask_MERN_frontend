import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProyectosProvider } from "./context/ProyectosProvider";
import { AuthLayout } from "./layouts/AuthLayout";
import { RutaProtegida } from "./layouts/RutaProtegida";
import { ConfirmarCuenta } from "./paginas/ConfirmarCuenta";
import { EditarProyecto } from "./paginas/EditarProyecto";
import { Login } from "./paginas/Login";
import { NuevoPassword } from "./paginas/NuevoPassword";
import { NuevoProyecto } from "./paginas/NuevoProyecto";
import { OlvidePassword } from "./paginas/OlvidePassword";
import { Proyecto } from "./paginas/Proyecto";
import { Proyectos } from "./paginas/Proyectos";
import { Registrar } from "./paginas/Registrar";
import { NuevoColaborador } from "./paginas/NuevoColaborador";

function App() {


  return (
    <BrowserRouter >
      {/* cubrimos toda mi app con el provider para tener todo disponible en la app */}
      <AuthProvider>
        <ProyectosProvider>


          <Routes>
            {/* path es hacia donde va la ruta */}
            {/* este route agrupa a todas las rutas publicas */}
            <Route path="/" element={<AuthLayout />} >
              {/* index le dice que es el que va a cargar cuando sea este path / */}
              <Route index element={<Login />} />
              {/* como en el path de arriba tiene el / aca no se pone */}
              <Route path="registrar" element={<Registrar />} />
              <Route path="olvide-password" element={<OlvidePassword />} />
              {/* el token es dinamico */}
              <Route path="olvide-password/:token" element={<NuevoPassword />} />

              <Route path="confirmar/:id" element={<ConfirmarCuenta />} />
            </Route>

            {/* este route agrupa a todas las rutas privadas */}
            <Route path="/proyectos" element={<RutaProtegida />} >
              {/* index le dice que es el que va a cargar cuando sea este path /proyectos */}
              <Route index element={<Proyectos />} />

              <Route path="crear-proyecto" element={<NuevoProyecto />} />

              <Route path="nuevo-colaborador/:id" element={<NuevoColaborador />} />


              {/* para visualizar el proyecto */}
              <Route path=":id" element={<Proyecto />} />

              {/* ruta dinamica para editar cada proyecto */}
              <Route path="editar/:id" element={<EditarProyecto />} />

            </Route>



          </Routes>
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import axios from 'axios'

// create es un metodo que va a crear este cliente de axios
export const clienteAxios = axios.create({
    // esta dice que es la url base 
    // esta es la que va hacia el backend las q tengo en postman
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
})
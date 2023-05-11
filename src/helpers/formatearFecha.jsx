export const formatearFecha = (fecha) => {
    // new date toma la fecha q mandamoss
    // fecha.split('T')[0].split('-') hacemos todo eso para arreglar el formato de la fecha
    const nuevaFecha = new Date(fecha.split('T')[0].split('-'))

    // definimos las opciones de como se vera la hora
    const opciones = {
        weekday: 'long', // para que aparexca el nombre completo del dia
        year: 'numeric', // para q aparezca el año
        month: 'long',
        day: 'numeric'
    }

    return nuevaFecha.toLocaleDateString('es-ES', opciones)
}
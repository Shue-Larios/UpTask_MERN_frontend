// import Swal from "sweetalert2"

export const Alerta = ({ alerta }) => {
    return (
        // esta forma es xsi quiero usar sweetalert2
        // ? la parte del true
        // <div className={`${alerta.error ? Swal.fire(
        //     `${alerta.type}`,
        //     `${alerta.msg}`,
        //     'error'
        // ) : 'from-sky-400 to-sky-400'} bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`}>
        // </div>


        <div className={`${alerta.error ? 'from-red-400 to-red-600'
            : 'from-sky-400 to-sky-400'} bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`}>
            {alerta.msg}
        </div>
    )
}

import React, {useState} from 'react'
import { db } from '../firebaseconfig';
import moment from 'moment';

const BusquedaxFecha = () => {

    const [values , setValues] = useState({
        fechaIni: moment(new Date()).format("YYYY-MM-DD"),
        fechaFin: moment(new Date()).format("YYYY-MM-DD")
    })

    const [detalle, setDetalle] = useState([]);

    const [error, setError] = useState('')

    const [luz, setLuz] = useState('')
    const [agua, setAgua] = useState('')

    const buscarxFecha = (e) => {
        e.preventDefault();

        if (!values.fechaIni){
            setError("Selecciona una Fecha Inicial")
            setDetalle([])
            setLuz('')
            return;
        }else if (!values.fechaFin){
            setError("Selecciona una Fecha Fin")
            setDetalle([])
            setLuz('')
            return;
        }else{
            db.collection("detalleInquilino").where("fecha", ">=", values.fechaIni).where("fecha", "<=",values.fechaFin)
            .get()
            .then((querySnapshot) => {
                const docs = []
                var strTotalLuz = 0;
                var strTotalAgua = 0;
                querySnapshot.forEach(doc =>{
                    docs.push({...doc.data(), id:doc.id})
                    strTotalLuz = strTotalLuz + Number(doc.data().montoxkilowats)
                    strTotalAgua = strTotalAgua + Number(doc.data().agua)
                });
                setLuz(strTotalLuz)
                setAgua(strTotalAgua)
                setDetalle(docs);
                setError('')
            })
            .catch((error) => {
                console.log(error)
                setError("Hubo un error con la busqueda")
            })
        }

    }

    const handleChangeInput = (e) => {
        const {name, value} = e.target
        setValues({...values, [name]: value})
    }

    const getNombre = (paramDni) => {
        var nombre = paramDni;
        if (paramDni === '10018841'){
            nombre = "Honorato";
        }else if (paramDni === '11111111'){
            nombre = "Thalia";
        }else if (paramDni === '10101010'){
            nombre = "Katty";
        }else if (paramDni ==='48102737'){
            nombre = "Dany";
        }else if (paramDni === '55555555'){
            nombre = "Max";
        }else if (paramDni === '33334444'){
            nombre = "Jaime Depa";
        }else if (paramDni === '44444444'){
            nombre = "Jaime Taller";
        }
        return nombre
    }

    return (
        <div className='container  p-3'>
            <div className="row">
                <form onSubmit={buscarxFecha} className='card card-body'>
                <h2>Selecciona el rango Fecha</h2>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="fechaIni">Fecha Inicial</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                type="date"
                                name="fechaIni"
                                id="fechaIni"
                                value={values.fechaIni} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fechaFin">Fecha Fin</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                type="date"
                                name="fechaFin"
                                id="fechaFin"
                                value={values.fechaFin} />
                        </div>
                        <button className='btn btn-primary btn-block mt-3'>
                            Buscar
                        </button>

                    </div>
                    <div>
                        {
                            error !== '' ?
                            (
                                <div className='alert alert-danger mt-3'>{error}</div>
                            )
                            :
                            (
                                <div></div>
                            )
                        }
                    </div>
                </form>
            </div>
            
            {
            detalle.length > 0 ?
                    (
                        luz !== '' ?
                        (
                            <div className='alert alert-success'>
                                <div className='alert-link custom-total'>
                                    Monto de Total de la Luz consumida en el Mes {
                                    } : S/{luz}
                                </div>
                            </div>
                        )
                        :
                        (
                            <div></div>
                        )
                    )
                    :
                    (
                        <div></div>
                    )
            }

            {
            detalle.length > 0 ?
                    (
                        agua !== '' ?
                        (
                            <div className='alert alert-success'>
                                <div className='alert-link custom-total'>
                                    Monto de Total del Agua consumida en el Mes : S/{agua}
                                </div>
                            </div>
                        )
                        :
                        (
                            <div></div>
                        )
                    )
                    :
                    (
                        <div></div>
                    )
            }

            <div className="">
                {
                    detalle.length > 0 ?
                    (
                        detalle.map(us => (
                            <div className='card' key={us.id}>
                                <div className='p-1'>
                                    <div className={us.active? 'alert alert-success' : 'alert alert-primary'}>
                                        <div className='alert-link'><span className=''>Usuario: </span>  {getNombre(us.dni)}</div>
                                        <div className='alert-link'><span className=''>Fecha : </span>  {us.fecha}</div>
                                        <div className='alert-link'><span>Kilowats Registrado : </span>  {us.kilowats}</div>
                                        <div className='alert-link'><span>Kilowats calculado : </span>  {us.mesxkilowats}</div>
                                        <div className='alert-link'>Monto de la Luz : S/{us.montoxkilowats} </div>
                                        <div className='alert-link'>Monto del Agua : S/{us.agua} </div>
                                        {us.deuda !== '' ?
                                            (
                                                <div className='alert-link'>Monto de Deuda : S/{us.deuda} </div>
                                            )
                                            :
                                            (
                                                <div></div>
                                            )
                                        }
                                        {us.comentario !== '' ?
                                            (
                                                <div className='custom-comentario'>{us.comentario} </div>
                                            )
                                            :
                                            (
                                                <div></div>
                                            )
                                        }
                                        <div className="custom-control custom-checkbox my-1 mr-sm-2">
                                            <input 
                                                defaultChecked={us.pagado ? true : false}
                                                disabled
                                                type="checkbox" 
                                                className="custom-control-input" 
                                                id={'check_'+us.id} 
                                                value=""/>
                                            <label className="custom-control-label alert-link" htmlFor={'check_'+us.id}>
                                                Pagado
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                    :
                    (
                        <div>No se encontró coincidencias</div>
                    )
                }
            </div>

        </div>
    )
}

export default BusquedaxFecha

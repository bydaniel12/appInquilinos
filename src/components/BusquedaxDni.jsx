import React, {useState} from 'react'
import { db } from '../firebaseconfig';

const BusquedaxDni = () => {

    const [values , setValues] = useState({
        dni : ''
    })

    const [detalle, setDetalle] = useState([]);

    const [error, setError] = useState('')

    const buscarxDni = (e) => {
        e.preventDefault();

        if (!values.dni){
            setError("Ingresa tu DNI")
            return;
        }else{
            db.collection("detalleInquilino").where("dni", "==", values.dni).orderBy("kilowats","desc")
            //db.collection("nuevoInquilinos").doc(values.dni).collection('detalle')
            .get()
            .then((querySnapshot) => {
                const docs = []
                querySnapshot.forEach(doc =>{
                    docs.push({...doc.data(), id:doc.id})
                });
                setDetalle(docs);
                setError('')
            })
            .catch((error) => {
                console.log(error)
                setError("Hubo un problema con la busqueda")
            })
        }
    }

    const handleChangeInput = (e) => {
        const {name, value} = e.target
        setValues({...values, [name]: value})
    }

    return (
        <div className='container  p-3'>
            <div className="row">
                <form onSubmit={buscarxDni} className='card card-body'>
                <h2>Busqueda por DNI</h2>
                    <div className="form-group">
                        <input 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='Ingresa DNI'
                            type="text" 
                            name="dni"
                            id="dni"
                            maxLength="8"
                            value={values.dni} />
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

            <div className="card mt-4">
            <h2>Listado de recibos</h2>
                {
                    detalle.length > 0 ?
                    (
                        detalle.map(us => (
                            <div className='' key={us.id}>
                                <div className='p-1'>
                                    <div className={us.active? 'alert alert-success' : 'alert alert-primary'}>
                                        <div className='alert-link'><span className=''>Fecha : </span>  {us.ano} - {us.mes} - {us.dia}</div>
                                        <div className='alert-link'><span>Kilowats Registrado : </span>  {us.kilowats}</div>
                                        <div className='alert-link'><span>Kilowats x Mes : </span>  {us.mesxkilowats}</div>
                                        <div className='alert-link'><span>Monto de la Luz : </span>  S/{us.montoxkilowats}</div>
                                        <div className='alert-link'><span>Monto del agua : </span>  S/{us.agua}</div>
                                        <div className="custom-control custom-checkbox my-1 mr-sm-2">
                                            <input 
                                                defaultChecked={us.pagado ? true : false}
                                                type="checkbox" 
                                                className="custom-control-input" 
                                                disabled
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

export default BusquedaxDni

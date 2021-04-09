import React, {useState} from 'react'
import { db } from '../firebaseconfig';

const BusquedaxFecha = () => {

    const [values , setValues] = useState({
        ano: '',
        mes: ''
    })

    const [detalle, setDetalle] = useState([]);

    const [error, setError] = useState('')

    const [luz, setLuz] = useState('')
    const [agua, setAgua] = useState('')

    const buscarxFecha = (e) => {
        e.preventDefault();

        if (!values.ano){
            setError("Selecciona el año")
            setDetalle([])
            setLuz('')
            return;
        }else if (!values.mes){
            setError("Selecciona el mes")
            setDetalle([])
            setLuz('')
            return;
        }else{
            db.collection("detalleInquilino").where("ano", "==", values.ano).where("mes", "==", values.mes)
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

    return (
        <div className='container  p-3'>
            <div className="row">
                <form onSubmit={buscarxFecha} className='card card-body'>
                <h2>Busqueda por fecha</h2>
                    <div className="form-group">
                        <select 
                            onChange={handleChangeInput}
                            className='form-control mt-3'
                            name="ano" id="ano">
                            <option value="">Elegi el año</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                        </select>

                        <select 
                            onChange={handleChangeInput}
                            className='form-control mt-3'
                            name="mes" id="mes">
                            <option value="">Elegi el mes</option>
                            <option value="01" name="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11" name="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
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
                                        <div className='alert-link'><span className=''>Dni : </span>  {us.dni}</div>
                                        <div className='alert-link'><span className=''>Fecha : </span>  {us.ano} - {us.mes} - {us.dia}</div>
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

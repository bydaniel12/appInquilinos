import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebaseconfig';
import {toast} from 'react-toastify';
import moment from 'moment';

const Detalle = () => {
    const { dni, nombre, monto } = useParams();

    const initValues = {
        dni: dni,
        active: true,
        fecha: moment(new Date()).format("YYYY-MM-DD"),
        kilowats: '',
        mesxkilowats: '',
        montoxkilowats: '',
        agua: '',
        internet: '',
        deuda: '0',
        comentario: '',
        pagado: false
    }

    const [values, setValues] = useState(initValues)

    const [error, setError] = useState('')

    const [detalle, setDetalle] = useState([])

    const [currentId, setCurrentId] = useState('')

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
    }

    const registrarDetalle = async (e) => {
        e.preventDefault()
        if (!values.kilowats) {
            setError("Ingresa los kilowats")
            return;
        } else if (!values.mesxkilowats) {
            setError("Ingresa los kilowats calculados")
            return;
        } else if (!values.montoxkilowats) {
            setError("ingresa el monto de la Luz")
            return;
        } else if (!values.agua) {
            setError("ingresa el monto del Agua")
            return;
        } else if (Number(values.agua) < 0) {
            setError("Ingresa un valor númerico en el campo agua")
            return;
        } else if (!values.fecha) {
            setError("ingresa la fecha del recibo")
            return;
        } else {
            console.log(values)
            if (currentId === '') {
                detalle.forEach(doc => {
                    if (doc.active) {
                        db.collection('detalleInquilino').doc(doc.id).update({
                            active: false
                        }).catch(error => {
                            console.log("Error al actualizar : " + error)
                        })
                    }
                })
                await db.collection('detalleInquilino').doc().set(values);
                setValues({ ...initValues });
                toast.success("Boleta creada!");
            } else {
                await db.collection('detalleInquilino').doc(currentId).update(values)
                document.getElementById('kilowats').readOnly = false;
                document.getElementById('mesxkilowats').readOnly = false;
                document.getElementById('montoxkilowats').readOnly = false;
                setCurrentId('');
                toast.success("Boleta actualizada!");
            }
            setError('')
        }
    }

    const getDataUserById = (id) => {
        //const doc = await db.collection('detalleInquilino').doc(id).get();
        //setValues({...doc.data()})
        var docRef = db.collection("detalleInquilino").doc(id);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setValues({ ...doc.data() })
                document.getElementById("agua").focus();
                document.getElementById('kilowats').readOnly = true;
                document.getElementById('mesxkilowats').readOnly = true;
                document.getElementById('montoxkilowats').readOnly = true;
                document.getElementById("fecha").value = doc.data().fecha;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    useEffect(() => {

        if (currentId === '') {
            setValues({ ...initValues });
        } else {
            getDataUserById(currentId);
        }

        const getDetallexDni = async () => {
            db.collection('detalleInquilino').where("dni", "==", dni).orderBy("kilowats", "desc").onSnapshot(querySnapshot => {
                const docs = [];
                querySnapshot.forEach(doc => {
                    docs.push({ ...doc.data(), id: doc.id })
                })
                setDetalle(docs)
            })
        }
        getDetallexDni();
    }, [dni, currentId])


    const calcularKilowats = () => {
        if (values.kilowats && Number(values.kilowats)) {
            if (detalle.length === 0) {
                setValues({ ...values, mesxkilowats: '0', montoxkilowats: '0' })
            } else if (detalle.length > 0) {
                detalle.forEach(doc => {
                    if (doc.active) {
                        const calcKilowats = Number(values.kilowats) - doc.kilowats;
                        var montoTotal = 0;
                        if (doc.dni === '33333333'){
                            //Katty
                            montoTotal = Number.parseFloat(calcKilowats * 0.9).toFixed(0);
                        }else if (doc.dni === '33334444' || doc.dni === '44444444' || doc.dni === '22222222'){
                            //Jaime casa
                            //JaimeTaller
                            //Daniela
                            montoTotal = Number.parseFloat(calcKilowats * 0.85).toFixed(0);
                        }else{
                            montoTotal = Number.parseFloat(calcKilowats * 0.80).toFixed(0);
                        }
                        setValues({ ...values, mesxkilowats: calcKilowats.toString(), montoxkilowats: montoTotal.toString() })
                    }
                })
            }
            setError('')
        } else {
            setError("Ingresa un valor numerico en el campo kilowats")
        }
    }

    const checkPay = (idBoleta, paramFecha) => {
        const isCheckPay = document.getElementById("check_" + idBoleta).checked;
        const fecha = new Date(paramFecha);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (window.confirm('Estas seguro de actualizar el pago con Fecha : ' + fecha.toLocaleDateString("es-ES", options) + ' ?')){
            if (isCheckPay) {
                console.log("pago OK!")
                db.collection('detalleInquilino').doc(idBoleta).update({
                    pagado: true
                }).catch(error => {
                    console.log("Error al cambiar estado a pagado : " + error)
                })
            } else {
                console.log("Desactivamos el pago")
                db.collection('detalleInquilino').doc(idBoleta).update({
                    pagado: false
                }).catch(error => {
                    console.log("Error al cambiar estado a pagado : " + error)
                })
            }
        }else{
            if (isCheckPay) {
                document.getElementById("check_" + idBoleta).checked=false;
            }else{
                document.getElementById("check_" + idBoleta).checked=true;
            }
        }
    }

    const formatDate = (paramFecha) =>{
        return moment(paramFecha).format("DD MMMM YYYY");
    }

    return (
        <div className='container  p-3'>
            <h1>Detalle de {nombre}</h1>
            <div className="">

                <form onSubmit={registrarDetalle}>
                    <div className="card card-body">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="dni">DNI</label>
                                <input type="text" className="form-control" id="dni" name="dni" value={dni} placeholder="Ingresa DNI" readOnly />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="kilowats">Kilowats</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="kilowats" 
                                    name="kilowats" 
                                    value={values.kilowats} 
                                    placeholder="Ingresa los kilowats" 
                                    onChange={handleChangeInput} />
                            </div>

                            <input
                                className='btn btn-primary col-md-12 mb-3'
                                onClick={calcularKilowats}
                                type="button"
                                disabled={currentId !== '' ? true : false}
                                value='Calcular' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mesxkilowats">Kilowats calculado</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                placeholder='Kilowats calculado'
                                type="text"
                                name="mesxkilowats"
                                id="mesxkilowats"
                                readOnly
                                value={values.mesxkilowats} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="montoxkilowats">Luz</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                placeholder='Monto calculado de la Luz'
                                type="text"
                                name="montoxkilowats"
                                id="montoxkilowats"
                                readOnly
                                value={values.montoxkilowats} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="agua">Agua</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                placeholder='Ingresa el monto del Agua'
                                type="text"
                                name="agua"
                                id="agua"
                                value={values.agua} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="internet">Internet</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                placeholder='Ingresa el monto del Internet'
                                type="text"
                                name="internet"
                                id="internet"
                                value={values.internet} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="internet">Deuda</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                placeholder='Ingresa el monto de la Deuda'
                                type="text"
                                name="deuda"
                                id="deuda"
                                value={values.deuda} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comentario">Comentario</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                placeholder='Ingresa algún Comentario'
                                type="text"
                                name="comentario"
                                id="comnetario"
                                value={values.comentario} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fecha">Fecha</label>
                            <input
                                className='form-control'
                                onChange={handleChangeInput}
                                type="date"
                                name="fecha"
                                id="fecha"
                                value={values.fecha} />
                        </div>
                        <button className='btn btn-primary btn-block mt-3'>
                            {currentId === '' ? 'Registrar Boleta' : 'Actualizar Boleta'}
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

            <div className="">
                {
                    detalle.map(detail => (
                        <div className='' key={detail.id}>
                            <div className='p-1'>
                                <div className={detail.active ? 'card bg-custom bg-light mb-3' : 'card bg-light mb-3'}>
                                    <div className='card-header alert-link p2 head-bg-custom'>
                                        {nombre}  :  {formatDate(detail.fecha)}
                                        <div className="custom-control custom-checkbox my-1 mr-sm-2">
                                            <input
                                                defaultChecked={detail.pagado ? true : false}
                                                onClick={() => checkPay(detail.id, detail.fecha)}
                                                type="checkbox"
                                                className="custom-control-input"
                                                id={'check_' + detail.id}
                                                value="" />
                                            <label className="custom-control-label alert-link" htmlFor={'check_' + detail.id}>
                                                Pagado
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="card-body">
                                    <div className='alert-link'>Monto Mensual : S/{monto}</div>
                                    <div className='custom-kilowats'>Kilowats : {detail.kilowats}</div>
                                    <div className='custom-kilowats'>Calculo kw : {detail.mesxkilowats}</div>
                                    <div className='alert-link'>Monto de la Luz : S/{detail.montoxkilowats} </div>
                                    <div className='alert-link'>Monto del Agua : S/{detail.agua} </div>
                                    {Number(detail.internet) > 0 && detail.internet !== '' ?
                                        (
                                            <div className='alert-link'>Monto de Internet : S/{detail.internet} </div>
                                        )
                                        :
                                        (
                                            <div></div>
                                        )
                                    }
                                    {detail.deuda !== '' && Number(detail.deuda) ?
                                        (
                                            <div className='alert-link'>Monto de Deuda : S/{detail.deuda} </div>
                                        )
                                        :
                                        (
                                            <div></div>
                                        )
                                    }
                                    {detail.comentario !== '' ?
                                        (
                                            <div className='custom-comentario'>{detail.comentario} </div>
                                        )
                                        :
                                        (
                                            <div></div>
                                        )
                                    }
                                    <div className='alert-link custom-total'>
                                        Monto de Total a pagar :
                                        S/
                                            {Number(monto) +
                                            Number(detail.montoxkilowats) +
                                            Number(detail.agua) +
                                            Number(detail.internet) +
                                            (detail.deuda !== '' ? Number(detail.deuda) : Number(0))}
                                    </div>
                                    </div>
                                    <button
                                        className='btn btn-primary mr-2 mt-1 m-3'
                                        onClick={() => setCurrentId(detail.id)}>Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Detalle

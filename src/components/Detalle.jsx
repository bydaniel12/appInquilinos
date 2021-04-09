import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebaseconfig'

const Detalle = () => {
    const {dni, nombre, monto} = useParams();

    const initValues = {
        dni : dni,
        active : true,
        ano : '',
        mes : '',
        dia : '',
        kilowats : '',
        mesxkilowats : '',
        montoxkilowats : '',
        agua : '',
        internet: '',
        deuda : '',
        comentario: '',
        pagado : false
    }

    const [values , setValues] = useState(initValues)

    const [error, setError] = useState('')

    const [detalle, setDetalle] = useState([])

    const [currentId, setCurrentId] = useState('')

    const handleChangeInput = (e) => {
        const {name, value} = e.target
        setValues({...values, [name]: value})
    }

    const registrarDetalle = async (e) => {
        e.preventDefault()
        if (!values.kilowats){
            setError("Ingresa los kilowats")
            return;
        }else if (!values.mesxkilowats){
            setError("Ingresa los kilowats calculados")
            return;
        }else if (!values.montoxkilowats){
            setError("ingresa el monto de la Luz")
            return;
        }else if (!values.agua){
            setError("ingresa el monto del Agua")
            return;
        }
        else if (!values.ano){
            setError("Selecciona el año")
            return;
        }
        else if (!values.mes){
            setError("Selecciona el mes")
            return;
        }
        else if (!values.dia){
            setError("Selecciona el día")
            return;
        }else{
            console.log(values)
            if (currentId === ''){
                detalle.forEach(doc => {
                    if (doc.active){
                        db.collection('detalleInquilino').doc(doc.id).update({
                            active : false    
                        }).catch(error =>{
                            console.log("Error al actualizar : " + error)
                        })
                    }
                })
                await db.collection('detalleInquilino').doc().set(values)
                setValues({...initValues})
            }else{
                await db.collection('detalleInquilino').doc(currentId).update(values)
                document.getElementById('kilowats').readOnly = false;
                document.getElementById('mesxkilowats').readOnly = false;
                document.getElementById('montoxkilowats').readOnly = false;
                setCurrentId('')
            }
            document.getElementById("ano").value = "";
            document.getElementById("mes").value = "";
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
                setValues({...doc.data()})
                document.getElementById("agua").focus();
                document.getElementById('kilowats').readOnly = true;
                document.getElementById('mesxkilowats').readOnly = true;
                document.getElementById('montoxkilowats').readOnly = true;
                document.getElementById("ano").value = doc.data().ano;
                document.getElementById("mes").value = doc.data().mes;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    useEffect(() => {

        if(currentId === ''){
            setValues({...initValues});
        }else{
            getDataUserById(currentId);
        }

        const getDetallexDni = async () => {
                db.collection('detalleInquilino').where("dni", "==", dni).orderBy("kilowats", "desc").onSnapshot( querySnapshot =>{
                    const docs = [];
                    querySnapshot.forEach(doc => {
                        docs.push({...doc.data(), id:doc.id})
                    })
                    setDetalle(docs)
            })
        }
        getDetallexDni();
    }, [dni , currentId])


    const calcularKilowats = () => {
        if (values.kilowats){
            if (detalle.length === 0){
                setValues({...values, mesxkilowats: '0' ,montoxkilowats: '0'})
            }else if (detalle.length > 0){
                detalle.forEach(doc => {
                    if (doc.active){
                        const calcKilowats = Number(values.kilowats) - doc.kilowats;
                        const montoTotal = Number.parseFloat(calcKilowats * 0.77).toFixed(0);
                        setValues({...values, mesxkilowats: calcKilowats.toString() ,montoxkilowats: montoTotal.toString()})
                    }
                })
            }
            setError('')
        }else{
            setError("Ingresa un valor en el campo kilowats")
        }
    }

    const checkPay = (e) => {
        const strId = e.target.id;
        const isChecked = document.getElementById(strId).checked;
        const id = strId.split("_")[1];
        if (isChecked){
            console.log("pagamos...")
            db.collection('detalleInquilino').doc(id).update({
                pagado : true    
            }).catch(error =>{
                console.log("Error al cambiar estado a pagado : " + error)
            })
        }else{
            console.log("Desactivamos el pago")
            db.collection('detalleInquilino').doc(id).update({
                pagado : false    
            }).catch(error =>{
                console.log("Error al cambiar estado a pagado : " + error)
            })
        }
    }
    

    return (
        <div className='container  p-3'>
        <h1>Detalle de {nombre}</h1>
        <div className="row">
            <form onSubmit={registrarDetalle} className='card card-body'>
                <div className="form-group">
                    <input 
                        className='form-control mt-3'
                        placeholder='Ingresa DNI'
                        type="text" 
                        name="dni"
                        value={dni}
                        id="dni"
                        readOnly />
                    <input 
                        className='form-control mt-3'
                        onChange={handleChangeInput}
                        placeholder='Ingresa los kilowats'
                        type="number" 
                        name="kilowats"
                        id="kilowats"
                        value={values.kilowats} />
                    <input 
                        className='btn btn-primary mt-3'
                        onClick={calcularKilowats}
                        type="button"
                        value='Calcular' />
                    <input 
                        className='form-control mt-3'
                        onChange={handleChangeInput}
                        placeholder='Kilowats calculado'
                        type="text" 
                        name="mesxkilowats"
                        id="mesxkilowats"
                        value={values.mesxkilowats} />
                    <input 
                        className='form-control mt-3'
                        onChange={handleChangeInput}
                        placeholder='Monto calculado de la Luz'
                        type="text" 
                        name="montoxkilowats"
                        id="montoxkilowats"
                        value={values.montoxkilowats} />
                    <input 
                        className='form-control mt-3'
                        onChange={handleChangeInput}
                        placeholder='Ingresa el monto del Agua'
                        type="text" 
                        name="agua"
                        id="agua"
                        value={values.agua} />
                    <input 
                        className='form-control mt-3'
                        onChange={handleChangeInput}
                        placeholder='Ingresa el monto del Internet'
                        type="text" 
                        name="internet"
                        id="internet"
                        value={values.internet} />
                    <input 
                        className='form-control mt-3'
                        onChange={handleChangeInput}
                        placeholder='Ingresa el monto de la Deuda'
                        type="text" 
                        name="deuda"
                        id="deuda"
                        value={values.deuda} />
                    <input 
                        className='form-control mt-3'
                        onChange={handleChangeInput}
                        placeholder='Ingresa algún Comentario'
                        type="text" 
                        name="comentario"
                        id="comnetario"
                        value={values.comentario} />
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
                        <option value="01">Enero</option>
                        <option value="02">Febrero</option>
                        <option value="03">Marzo</option>
                        <option value="04">Abril</option>
                        <option value="05">Mayo</option>
                        <option value="06">Junio</option>
                        <option value="07">Julio</option>
                        <option value="08">Agosto</option>
                        <option value="09">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                    <input 
                        className='form-control mt-3'
                        onChange={handleChangeInput}
                        placeholder='Ingresa el día'
                        type="text" 
                        name="dia"
                        maxLength="2"
                        value={values.dia} />
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
                    <div className='card' key={detail.id}>
                        <div className='p-1'>
                            <div className={detail.active? 'alert alert-success' : 'alert alert-primary'}>
                                <h4 className='alert-link'>{nombre}  -  {detail.dia}-{detail.mes}-{detail.ano}</h4>
                                <div className="custom-control custom-checkbox my-1 mr-sm-2">
                                    <input 
                                        defaultChecked={detail.pagado ? true : false}
                                        onClick={checkPay}
                                        type="checkbox" 
                                        className="custom-control-input" 
                                        id={'check_'+detail.id} 
                                        value=""/>
                                    <label className="custom-control-label alert-link" htmlFor={'check_'+detail.id}>
                                        Pagado
                                    </label>
                                </div>

                                <div className='alert-link'>Monto Mensual : S/{monto}</div>
                                <div className='custom-kilowats'>Kilowats : {detail.kilowats}</div>
                                <div className='custom-kilowats'>Calculo kw : {detail.mesxkilowats}</div>
                                <div className='alert-link'>Monto de la Luz : S/{detail.montoxkilowats} </div>
                                <div className='alert-link'>Monto del Agua : S/{detail.agua} </div>
                                <div className='alert-link'>Monto de Internet : S/{detail.internet} </div>
                                {detail.deuda !== '' ?
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
                                    (detail.deuda !=='' ? Number(detail.deuda) : Number(0))}
                                </div>
                                <button 
                                        className='btn btn-primary mr-2 mt-1'
                                        onClick={()=> setCurrentId(detail.id)}>Editar</button>
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

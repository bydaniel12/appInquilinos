import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { db } from '../firebaseconfig'

const Inicio = () => {

    
    const initValues = {
        dni : '',
        nombre : '',
        apellido : '',
        monto : '',
        garantia : '',
        fechaIngreso : ''
    }

    const [values , setValues] = useState(initValues)

    const [currentId, setCurrentId] = useState('')

    const [user, setUser] = useState([]);

    const [error, setError] = useState('')

    const getUsers = async () => {
         db.collection('inquilinos').onSnapshot( querySnapshot =>{
                const docs = [];
                querySnapshot.forEach(doc => {
                    docs.push({...doc.data()})
                })
                setUser(docs)
        })
        
    }

    useEffect(() => {
        const getDataUserById = async (id) => {
            const doc = await db.collection('inquilinos').doc(id).get();
            document.getElementById("dni").focus();
            setValues({...doc.data()})
        }

        if(currentId === ''){
            setValues({...initValues});
        }else{
            getDataUserById(currentId);
        }

        getUsers();
    }, [currentId])

    const registrarUser = async (e) => {
        e.preventDefault()
        try {
            if (!values.dni){
                setError("Ingresa el DNI")
                return;
            }else if (!values.nombre){
                setError("Ingresa nombre")
                return;
            }else if (!values.apellido){
                setError("ingresa apellido")
                return;
            }
            else if (!values.monto){
                setError("Ingresa el monto de la mensualidad")
                return;
            }
            else if (!values.garantia){
                setError("Ingresa la garantia")
                return;
            }
            else if (!values.fechaIngreso){
                setError("Ingresa la fecha de ingreso")
                return;
            }else{
                setError('')
                if (currentId === ''){
                    await db.collection('inquilinos').doc(values.dni).set(values)
                    setValues({...initValues})
                }else{
                    await db.collection('inquilinos').doc(values.dni).update(values)
                    setCurrentId('')
                }
            }
        } catch (error) {
            console.error(error)
            setError(error)
        }
    }

    const onDeleteUser =  async (id) => {
        if (window.confirm('Estas seguro de Eliminar al Usuario con DNI ' + id + ' ?')){
            //Busca por Id y elimina las boletas del usuario
           await  db.collection("detalleInquilino").where("dni", "==", id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(doc =>{
                    db.collection("detalleInquilino").doc(doc.id).delete().then(() => {
                        console.log("Document detalleInquilino successfully deleted!");
                    }).catch((error) => {
                        console.error("Error removing document inquilinos: ", error);
                    });
                });
            })
            .catch((error) => {
                console.log(error)
                console.error("Hubo un problema con obtener los Id de los detalles")
            })

            //Elimina colleccion usuario
            await db.collection('inquilinos').doc(id).delete();
/*             await db.collection("inquilinos").doc(id).delete().then(() => {
                console.log("Document inquilinos successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document inquilinos: ", error);
            });  */
        }
    }
    

    const handleChangeInput = (e) => {
        const {name, value} = e.target
        setValues({...values, [name]: value})
    }
    

    return (
        <div className='container  p-3'>
            <h1>Inquilinos</h1>
            <div className="row">
                <form onSubmit={registrarUser} className='card card-body'>
                    <div className="form-group">
                        <input 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='Ingresa DNI'
                            type="text" 
                            name="dni"
                            maxLength="8"
                            id='dni'
                            value={values.dni} />
                        <input 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='Ingresa nombre'
                            type="text" 
                            name="nombre"
                            maxLength="50"
                            id='nombre'
                            value={values.nombre} />
                        <input 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='Ingresa apellido'
                            type="text" 
                            name="apellido" 
                            id='apellido'
                            maxLength="50"
                            value={values.apellido}/>
                        <input 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='Ingresa monto de la mensualidad'
                            type="number" 
                            name="monto"
                            id='monto'
                            maxLength="4"
                            value={values.monto} />
                        <input 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='Ingresa garantia'
                            type="number" 
                            name="garantia"
                            id="garantia"
                            maxLength="4"
                            value={values.garantia} />
                        <input 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='fecha de ingreso'
                            type="date" 
                            name="fechaIngreso"
                            id="fechaIngreso"
                            value={values.fechaIngreso} />
                        <button className='btn btn-primary btn-block mt-3'>
                            {currentId === '' ? 'Agregar Inquilino' : 'Actualizar'}
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

            <div className="mt-2">
                {
                    user.map(us => (
                        <div className='card mb-1' key={us.dni}>
                            <div className='card-body'>
                                <div className='d-block'>
                                    <h4 className=''>{us.nombre} {us.apellido} - {us.dni}</h4>
                                    <div className=''>{us.fechaIngreso}</div>
                                    <div className=''> Monto mensual : S/{us.monto}</div>
                                    <div className=''>Garantia : S/{us.garantia}</div>
                                    <button 
                                        className='btn btn-primary mr-2 mt-1'
                                        onClick={()=> setCurrentId(us.dni)}>Editar</button>
                                    <button 
                                        onClick={()=> onDeleteUser(us.dni)}
                                        className='btn btn-danger mr-2 mt-1'>Eliminar</button>
                                    <Link 
                                        className='btn btn-dark mr-2 mt-1' 
                                        to={`/Detalle/${us.dni}/${us.nombre}/${us.monto}`}>Boletas</Link>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Inicio

import React, {useState, useEffect} from 'react'
import { db } from '../firebaseconfig';
import {toast} from 'react-toastify';

const RegistroTorneo = () => {

    const initValues = {
        nick : '',
        raza: ''
    }

    const [values , setValues] = useState(initValues)

    const [user, setUser] = useState([]);

    const [error, setError] = useState('');

    const getUsers = async () => {
         db.collection('torneo').onSnapshot( querySnapshot =>{
                const docs = [];
                querySnapshot.forEach(doc => {
                    docs.push({...doc.data()})
                })
                setUser(docs)
        })
        
    }

    useEffect(() => {
        setValues({...initValues});
        getUsers();
    }, [])

    const registrar = (e) => {
        e.preventDefault()
        try {
            console.info(values.nick);
            if (!values.nick){
                setError("Ingresa el nick del personaje")
                return;
            }else if (!document.querySelector('input[name="raza"]:checked')){
                setError("Seleccione una raza")
                return;
            }else{
                db.collection('torneo').doc().set(values);
                toast.success("Personaje registrado correctamente!!");
                setValues({ ...initValues });
            }
        } catch (error) {
            toast.error("Error al registrar personaje :(");
            setError(error)
        }
    }

    const handleChangeInput = (e) => {
        const {name, value} = e.target
        setValues({...values, [name]: value})
    }

    return (

        
        <div className='container  p-3'>
            <div className="row">
                <form onSubmit={registrar} className='card card-body'>
                <h2>Registro para el torneo Mu elendhir!!!</h2>
                    <div className="form-group">
                        <div className='radio-tag'>
                            <input type="radio" id="raza1" name="raza" value="bk" onChange={handleChangeInput} disabled />
                            <label htmlFor="raza1" className='torneo-label'>Bk</label>
                        </div>
                        
                        <div className='radio-tag'>
                            <input type="radio" id="raza2" name="raza" value="mago" onChange={handleChangeInput} disabled/>
                            <label htmlFor="raza2" className='torneo-label'>Mago</label>
                        </div>

                        <div className='radio-tag'>
                            <input type="radio" id="raza3" name="raza" value="dl" onChange={handleChangeInput}/>
                            <label htmlFor="raza3" className='torneo-label'>DL</label>
                        </div>

                        <div className='radio-tag'>
                            <input type="radio" id="raza4" name="raza" value="mg" onChange={handleChangeInput}/>
                            <label htmlFor="raza4" className='torneo-label'>Mg</label>
                        </div>

                        <div className='radio-tag'>
                            <input type="radio" id="raza5" name="raza" value="rf" onChange={handleChangeInput}/>
                            <label htmlFor="raza5" className='torneo-label'>RF</label>
                        </div>

                        <div className='radio-tag'>
                            <input type="radio" id="raza6" name="raza" value="elfa" onChange={handleChangeInput} disabled/>
                            <label htmlFor="raza6" className='torneo-label'>Elfa</label>
                        </div>

                        <div className='radio-tag'>
                            <input type="radio" id="raza7" name="raza" value="summoner" onChange={handleChangeInput} disabled/>
                            <label htmlFor="raza7" className='torneo-label'>Summoner</label>
                        </div>

                        <input 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='Ingresa Nick de personaje'
                            type="text" 
                            name="nick"
                            id="nick"
                            maxLength="500"
                            value={values.nick} />
                        <button className='btn btn-primary btn-block mt-3'>
                            Registrar personaje
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

            
            <div className="mt-2 card mb-1">
                <div className='bc-blue'>Lista de BK</div>
                {
                    user.map(us => (
                        <div className='' key={us.nick}>
                            <div className='d-block'>
                            {
                                us.raza === 'bk' ?
                                (
                                    <div className='mt-1'>{us.nick}</div>
                                )
                                :
                                (
                                    <div></div>
                                )
                            } 
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="mt-2 card mb-1">
                <div className='bc-blue'>Lista de Mago</div>
                {
                    user.map(us => (
                        <div className='' key={us.nick}>
                            <div className='d-block'>
                            {
                                us.raza === 'mago' ?
                                (
                                    <div className='mt-1'>{us.nick}</div>
                                )
                                :
                                (
                                    <div></div>
                                )
                            } 
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="mt-2 card mb-1">
                <div className='bc-blue'>Lista de RF</div>
                {
                    user.map(us => (
                        <div className='' key={us.nick}>
                            <div className='d-block'>
                            {
                                us.raza === 'rf' ?
                                (
                                    <div className='mt-1'>{us.nick}</div>
                                )
                                :
                                (
                                    <div></div>
                                )
                            } 
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="mt-2 card mb-1">
                <div className='bc-blue'>Lista de MG</div>
                {
                    user.map(us => (
                        <div className='' key={us.nick}>
                            <div className='d-block'>
                            {
                                us.raza === 'mg' ?
                                (
                                    <div className='mt-1'>{us.nick}</div>
                                )
                                :
                                (
                                    <div></div>
                                )
                            } 
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="mt-2 card mb-1">
                <div className='bc-blue'>Lista de DL</div>
                {
                    user.map(us => (
                        <div className='' key={us.nick}>
                            <div className='d-block'>
                            {
                                us.raza === 'dl' ?
                                (
                                    <div className='mt-1'>{us.nick}</div>
                                )
                                :
                                (
                                    <div></div>
                                )
                            } 
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="mt-2 card mb-1">
                <div className='bc-blue'>Lista de Elfa</div>
                {
                    user.map(us => (
                        <div className='' key={us.nick}>
                            <div className='d-block'>
                            {
                                us.raza === 'elfa' ?
                                (
                                    <div className='mt-1'>{us.nick}</div>
                                )
                                :
                                (
                                    <div></div>
                                )
                            } 
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="mt-2 card mb-1">
                <div className='bc-blue'>Lista de Summoner</div>
                {
                    user.map(us => (
                        <div className='' key={us.nick}>
                            <div className='d-block'>
                            {
                                us.raza === 'summoner' ?
                                (
                                    <div className='mt-1'>{us.nick}</div>
                                )
                                :
                                (
                                    <div></div>
                                )
                            } 
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default RegistroTorneo;
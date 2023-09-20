import React, {useState} from 'react';
import {toast} from 'react-toastify';

const TorneoBatalla = () => {

    const initValues = {
        nick : ''
    }



    const [values , setValues] = useState(initValues)

    const [detalle, setDetalle] = useState([]);

    const [error, setError] = useState('')

    const buscarBatalla = (e) => {
        e.preventDefault()
        try {
            if (!values.nick){
                setError("Ingresa Mas de un nick por comas ','")
                return;
            }else{
                var cadenaPrincipal = document.getElementById("nick").value;
                var arrayDeCadenas = cadenaPrincipal.split(",");
                if (arrayDeCadenas.length > 1){
                    var indice1 = Math.floor(Math.random() * arrayDeCadenas.length);
                    const luchador1 = arrayDeCadenas[indice1];
                    arrayDeCadenas.splice(indice1, 1);
                    var indice2 = Math.floor(Math.random() * arrayDeCadenas.length);
                    const luchador2 = arrayDeCadenas[indice2];
                    arrayDeCadenas.splice(indice2, 1);
                    console.info(luchador1,luchador2);
                    document.getElementById("nick").value = arrayDeCadenas.toString();
                    var text = luchador1 + "   VS   " + luchador2;

                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                        pending: 'Buscando rivales...',
                        success: text+'🤯',
                        error: 'Ocurrio un error'
                        }
                    )
                }else{
                    var text2 = "El usuario " + arrayDeCadenas.toString() + " no tiene rival.";
                    toast.error(text2);
                }
            }
        } catch (error) {
            console.error(error)
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
                <form onSubmit={buscarBatalla} className='card card-body'>
                <h2>Registro de Personajes</h2>
                    <div className="form-group">
                        <textarea 
                            className='form-control mt-3'
                            onChange={handleChangeInput}
                            placeholder='Ingresa Nick de personaje con comas'
                            type="text" 
                            name="nick"
                            id="nick"
                            maxLength="500"
                            value={values.nick} />
                        <button className='btn btn-primary btn-block mt-3'>
                            Buscar Batalla
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

        </div>
    )
}

export default TorneoBatalla;
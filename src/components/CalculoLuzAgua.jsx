
import React, {useState, useEffect} from 'react';
import { db } from '../firebaseconfig';
import moment from 'moment';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const CalculoLuzAgua = () => {

    const [detalle, setDetalle] = useState([]);
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    //const [body, setBody] = useState({});

    const formatDate = (paramFecha) =>{
        return moment(paramFecha).format("DD MMMM YYYY");
    }

    const getUsers = async () => {
        db.collection('inquilinos').onSnapshot( querySnapshot =>{
               const docs = [];
               querySnapshot.forEach(doc => {
                   db.collection('detalleInquilino').where("dni", "==", doc.data().dni).orderBy("kilowats", "desc").onSnapshot(querySnapshot2 => {
                        const docs2 = [];
                        querySnapshot2.forEach(doc2 => {
                            if (doc2.data().active) {
                                docs.push({...doc2.data(), nombre: doc.data().nombre});
                            }
                        });
                        setDetalle(docs2);
                    });
                    setData(docs);
               })
       })
   };

    useEffect(() => {
        getUsers();
    }, []);

    const handleChangeInput = (e) => {
        setError('');
        /*
        setBody({
            ...body,
            [e.target.id] : e.target.value
        })
        */
    }

    const calcularKilowats = (e) => {
        var kilowats="";
        var kilowatsTotal = "";
        var montoTotalLuz = "";
        const puntos = document.getElementById("puntos").value;
        var error = false;
        setError('');
        data.forEach(doc =>{
            const kilowatsOld = document.getElementById("kilowatsOld_"+doc.dni).value;
            const kilowatsNew = document.getElementById("kilowatsNew_"+doc.dni).value;
            if ( Number(kilowatsNew) > 0.0 ) {
                if ( Number(kilowatsNew) > Number(kilowatsOld) ){
                    kilowats = Number(kilowatsNew) - Number(kilowatsOld);
                    kilowatsTotal = Number(kilowatsTotal) + Number(kilowats);
                }else{
                    setError("Debe ingresar una cantidad mayor de kilowats para el usuario " + doc.nombre);
                    error = true;
                }
            }else{
                setError("Debe ingresar kilowats mayor a 0 para el usuario " + doc.nombre);
                error = true;
            }
        });

        if (kilowatsTotal !== "" && !error){
            if (Number(puntos) > 0 && Number(kilowatsTotal) > 0.0 ){
                montoTotalLuz = Number.parseFloat(kilowatsTotal) * Number.parseFloat(puntos);
                alert("El monto total de la luz es : " + montoTotalLuz.toFixed(0));
            }else{
                setError("Ocurrio un error en el calculo");
                return;
            }
        } 
    }

    return (
        <div className='container p-3'>
            <h1>Listado Inquilinos</h1>

            <Box component="form" noValidate autoComplete="off"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '15ch' },
                }}
                >
                
                {
                    data.map(us => (
                        <div key={us.dni}>
                            <TextField
                                id={"kilowatsOld_" + us.dni}
                                name={"kilowatsOld_" + us.dni}
                                label={"Kilowats -  " + us.nombre + " - " + formatDate(us.fecha)}
                                defaultValue={us.kilowats}
                                InputProps={{
                                    readOnly: true,
                                    }}
                                disabled
                            />
                            <TextField
                                id={"kilowatsNew_" + us.dni}
                                name={"kilowatsNew_" + us.dni}
                                label={"Kw " + us.nombre}
                                defaultValue = ""
                                type="number"
                                onChange={handleChangeInput}
                            />
                        </div>
                    ))
                }
                     <TextField
                        id="puntos"
                        name="puntos"
                        label="puntos"
                        defaultValue="0.85"
                        type="number"
                    />
                
                {
                    error !== '' ? 
                    (
                        <div className='alert alert-danger mt-3'>{error}</div>
                    ) 
                    :
                    (
                        <span></span>
                    )
                }

                <input
                    className='btn btn-primary col-md-12 mb-3'
                    onClick={calcularKilowats}
                    type="button"
                    value='Calcular' />
                
            </Box>
        </div>

    )
}

export default CalculoLuzAgua

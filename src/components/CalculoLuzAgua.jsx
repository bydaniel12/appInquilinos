
import React, {useState, useEffect} from 'react';
import { db } from '../firebaseconfig';
import {toast} from 'react-toastify';
import moment from 'moment';

const CalculoLuzAgua = () => {

    const [detalle, setDetalle] = useState([]);
    const [data, setData] = useState([]);

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

    const calcularKilowats = () => {
        var kilowats="";
        var kilowatsTotal = "";
        var montoTotalLuz = "";
        const puntos = document.getElementById("puntos").value;
        console.log(detalle);
        var error = false;
        data.forEach(doc =>{
            const kilowatsOld = document.getElementById("kilowatsOld_"+doc.dni).value;
            const kilowatsNew = document.getElementById("kilowatsNew_"+doc.dni).value;
            if (Number(kilowatsOld) > 0.0 && Number(kilowatsNew) > 0.0 ) {
                kilowats = Number(kilowatsNew) - Number(kilowatsOld);
                if (Number(kilowats) > 0.0){
                    kilowatsTotal = Number(kilowatsTotal) + Number(kilowats);
                    console.log(kilowatsTotal);
                }else{
                    toast.error("Los kilowats ingresados para el ususario " + doc.nombre + " debe ser mayor!!");
                    error = true;
                }
            }else{
                toast.error("Ingresa los kilowats mayor a 0 para el usuario " + doc.nombre);
                error = true;
            }
        });

        if (kilowatsTotal !== "" && error){
            if (Number(puntos) > 0 && Number(kilowatsTotal) > 0.0 ){
                montoTotalLuz = Number.parseFloat(kilowatsTotal) * Number.parseFloat(puntos);
                alert("El monto total de la luz es : " + montoTotalLuz.toFixed(0));
            }else{
                toast.error("Puntos incorrectos");
                return;
            }
        } 
    }

    return (
        <div className='container  p-3'>
            <h1>Listado Inquilinos</h1>
            <div className="mt-2">
                {
                    data.map(us => (
                        <div className='card mb-1' key={us.dni}>
                            <div className='card-body'>
                                <div className='d-block'>
                                    <h4 className=''>{us.nombre}</h4>
                                    <div className="form-group">
                                        <label htmlFor={"kilowatsOld_" + us.dni}>Kilowats - {formatDate(us.fecha)}</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id={"kilowatsOld_" + us.dni}
                                            name={"kilowatsOld_" + us.dni}
                                            defaultValue={us.kilowats}
                                            readOnly
                                            placeholder="Ingresa los kilowats" 
                                             />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={"kilowatsNew_" + us.dni}>Kilowats Nuevo</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id={"kilowatsNew_" + us.dni}
                                            name={"kilowatsNew_" + us.dni}
                                            defaultValue=""
                                            placeholder="Ingresa los kilowats" 
                                             />
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="form-group">
                <label htmlFor="puntos">Puntos</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="puntos"
                    name="puntos"
                    defaultValue="0.85"
                    placeholder="Puntos" 
                        />
            </div>
            <input
                className='btn btn-primary col-md-12 mb-3'
                onClick={calcularKilowats}
                type="button"
                value='Calcular' />
        </div>
    )
}

export default CalculoLuzAgua

import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {auth} from '../firebaseconfig'

const Menu = () => {

    const [user, setUser] = useState('')
    const historial = useHistory()

    useEffect(() => {
        auth.onAuthStateChanged( user => {
            if (user){
                setUser(user.email)
            }
        })
    }, [])

    const CerrarSesion = () => {
        auth.signOut()
        setUser(null)
        historial.push('/login')
    }
    

    return (
        <div>
            <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
                <ul className='navbar-nav mr-auto'>
                    <li>
                        {
                            user ?
                            (
                                <Link className='nav-link' to='/inicio'>Inicio</Link>
                            )
                            :
                            (
                                <span></span>
                            )
                        }
                    </li>
                    <li>
                        {
                            !user ?
                            (
                                <Link className='nav-link' to='/login'>Login</Link>
                            )
                            :
                            (
                                <span></span>
                            )
                        }
                    </li>
                    <li>
                         <Link className='nav-link' to='/BusquedaxDni'>Busca tu Recibo</Link>
                    </li>
                    <li>
                        {
                            user ?
                            (
                                <Link className='nav-link' to='/BusquedaxFecha'>Busqueda de recibos por mes</Link>
                            )
                            :
                            (
                                <span></span>
                            )
                        }
                         
                    </li>
                    <li>
                        {
                            user ?
                            (
                                <Link className='nav-link' to='/CalculoLuzAgua'>Calcular luz y agua previo</Link>
                            )
                            :
                            (
                                <span></span>
                            )
                        }
                         
                    </li>
                </ul>

                {
                    user ?
                    (
                        <button onClick={CerrarSesion} className='btn btn-danger'> Cerrar sesión</button>
                    )
                    :
                    (
                        <span></span>
                    )
                }

            </nav>
        </div>
    )
}

export default Menu

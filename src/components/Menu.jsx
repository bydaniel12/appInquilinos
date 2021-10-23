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
            <nav className='navbar navbar-dark bg-dark navBarCustom navbar-expand-lg'>
                <div className="container-fluid">
                    <ul className='nav navbar-nav'>
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
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            {
                                user ?
                                (
                                    <Link className='nav-link' onClick={CerrarSesion}>Cerrar sesión</Link>
                                )
                                :
                                (
                                    <span></span>
                                )
                            }
                        </li>
                    </ul>
                </div>
 

            </nav>
        </div>
    )
}

export default Menu

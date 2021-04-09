import React, {useState} from 'react'
import {auth} from '../firebaseconfig'
import {useHistory} from 'react-router-dom'

const Login = () => {

    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [msgError, setMsgError] = useState('')
    const historial = useHistory()

    const RegistrarUsuario = (e) => {
        e.preventDefault()
        auth.createUserWithEmailAndPassword(user,pass)
            .then( r => 
                    {
                        setMsgError('')
                        historial.push('/')
                    }
                )
            .catch(error => {
                if (error.code === 'auth/invalid-email'){
                    setMsgError('Formato del Email incorrecto')
                }
                if (error.code === 'auth/weak-password'){
                    setMsgError('El Password debe tener 6 caracteres o mas')
                }
            })
    }

    const LoginUser = () => {
        auth.signInWithEmailAndPassword(user,pass)
            .then ( r => {
                setMsgError('')
                historial.push('/')
            })
            .catch(error => {
                console.log(error)
                if (error.code === 'auth/wrong-password'){
                    setMsgError('La contraseña es incorrecta')
                }
                if (error.code === 'auth/user-not-found'){
                    setMsgError('El usuario no existe')
                }
            })    
    }
    
    

    return (
        <div className='wrapper mt-5 p5'>
            <div className='col'></div>
            <div className='col'>
                <form onSubmit={RegistrarUsuario} className='form-group'>
                    <h2>Inicia Sesión</h2>
                    <input
                        onChange={(e) => {setUser(e.target.value)}}
                        className='form-control mt-4'
                        placeholder='Introduce el usuario'
                        type='email'
                    />
                     <input
                        onChange={(e) => {setPass(e.target.value)}}
                        className='form-control mt-4'
                        placeholder='Introduce la contraseña'
                        type='password'
                    />
                    {/* <input
                        className='btn btn-dark btn-block mt-4'
                        value='Registrar usuario'
                        type='submit'
                    /> */}
                </form>
                <input
                        onClick={LoginUser}
                        className='btn btn-success btn-block mt-4'
                        value='Inicia sesión'
                        type='submit'
                    />

                {
                    msgError !== '' ? 
                    (
                        <div className='alert alert-danger mt-3'>{msgError}</div>
                    ) 
                    :
                    (
                        <span></span>
                    )
                }
            </div>
            <div className='col'></div>
        </div>
    )
}

export default Login

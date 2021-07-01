import './App.css';
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom'
import Inicio from './components/Inicio';
import Login from './components/Login';
import Menu from './components/Menu';
import BusquedaxDni from './components/BusquedaxDni';
import BusquedaxFecha from './components/BusquedaxFecha';
import Detalle from './components/Detalle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
          <Menu></Menu>
          <Switch>
            <Route exact path='/' component={Login}>
            </Route>
            <Route path='/inicio' component={Inicio}></Route>
            <Route path='/login' component={Login}></Route>
            <Route path='/BusquedaxDni' component={BusquedaxDni}></Route>
            <Route path='/BusquedaxFecha' component={BusquedaxFecha}></Route>
            <Route path='/Detalle/:dni/:nombre/:monto' >
              <Detalle />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;

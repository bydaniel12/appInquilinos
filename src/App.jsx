import './App.css';
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom';
import Inicio from './components/Inicio';
import Login from './components/Login';
import Menu from './components/Menu';
import BusquedaxDni from './components/BusquedaxDni';
import TorneoBatalla from './components/TorneoBatalla';
import BusquedaxFecha from './components/BusquedaxFecha';
import Detalle from './components/Detalle';
import CalculoLuzAgua from './components/CalculoLuzAgua';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'moment/locale/es';

function App() {
  return (
    <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={7000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          />
      <Router>
          <Menu></Menu>
          <Switch>
            <Route exact path='/' component={Login}>
            </Route>
            <Route path='/inicio' component={Inicio}></Route>
            <Route path='/login' component={Login}></Route>
            <Route path='/BusquedaxDni' component={BusquedaxDni}></Route>
            <Route path='/TorneoBatalla' component={TorneoBatalla}></Route>
            <Route path='/BusquedaxFecha' component={BusquedaxFecha}></Route>
            <Route path='/CalculoLuzAgua' component={CalculoLuzAgua}></Route>
            <Route path='/Detalle/:dni/:nombre/:monto' >
              <Detalle />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;

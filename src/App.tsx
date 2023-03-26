import 'normalize.css';
import './assets/styles/index.css';
import 'primereact/resources/themes/soho-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ApiRoute } from './constants';
import { NotFound } from './pages/NotFound';
import { useUserContext } from './context/UserContext';
import { Mail } from './pages/Mail';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar';

function App() {
  const { user } = useUserContext();
  return (
    <div className='p-component surface-ground text-color flex flex-column min-h-screen'>
      {user && <Navbar />}
      <main className='flex flex-column flex-grow-1'>
        <Routes>
          <Route path={ApiRoute.DEFAULT} element={!user ? <Navigate to={ApiRoute.LOGIN} /> : <Navigate to={ApiRoute.MAIL} />} />
          <Route path={ApiRoute.LOGIN} element={!user ? <Login /> : <Navigate to={ApiRoute.DEFAULT} />} />
          <Route path={ApiRoute.MAIL} element={user ? <Mail /> : <Navigate to={ApiRoute.DEFAULT} />} />
          <Route path={ApiRoute.NOT_FOUND} element={<NotFound />}/>
          <Route path='*' element={<Navigate to={ApiRoute.NOT_FOUND} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

// import { SignIn } from './SignIn';
import { Home } from './pages/Home';
import {Routes, Route, Link} from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { Peliculas } from './pages/Movies';
import { TvShows } from './pages/TvShows';
import { SignUp } from './pages/SignUp';
function App() {

  return (
    <div className="">
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/' element={<SignIn/>}/>
        <Route path='/movies' element={<Peliculas/>}/>
        <Route path='/tvshows' element={<TvShows/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </div>
  )
}

export default App

import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import About from './Pages/About';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Createlisting from './Pages/Createlisting';
import Updatelisting from './Pages/Updatelisting';
import Listing from './Pages/Listing';
import Search from './Pages/Search';
export default function App() {
  return (
   <BrowserRouter>
   <Header/>
        <Routes>
          <Route path='/'element={<Home/>}></Route>
          <Route path='/sign-in'element={<SignIn/>}></Route>
          <Route path='/sign-up'element={<SignUp/>}></Route>
          <Route path='/about'element={<About/>}></Route>
          <Route path = '/search' element={<Search/>}></Route>
          <Route path='/listing/:listingId'element={<Listing/>}></Route>
          <Route element={<PrivateRoute/>}>
             <Route path='/Profile'element={<Profile/>}/>
             <Route path='/create-listing'element={<Createlisting/>}/>
             <Route path='/update-listing/:listingId'element={<Updatelisting/>}/>
          </Route>
        </Routes>
   </BrowserRouter>
  )
}

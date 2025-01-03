import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/slices/Userslice'
import {useNavigate} from 'react-router-dom'


const OAuth= () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handlegoogleClick= async()=>{
    try{
      const Provider= new GoogleAuthProvider()
      const auth =getAuth(app)

      const result= await signInWithPopup(auth,Provider)
      const res= await fetch('/api/auth/google',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({name:result.user.displayName, email:result.user.email,photo:result.user.photoURL})
      })
      const data = await res.json()
      dispatch(signInSuccess(data));
      navigate('/');
    }
    catch(error){
      console.log('could not sign in with google',error)
    }
  }
  return (
    <button onClick={handlegoogleClick }type='button' className='bg-red-700 text-white p-3 rounded-lg hover:opacity-80'>continue with google</button>
  )
}

export default OAuth
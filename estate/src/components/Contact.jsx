import React from 'react'
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

export default function Contact({listing}) {
    const[landlord,setLandlord]=useState(null);
    const[message,setMessage]=useState('');
    const changeHandler=(e)=>{
        setMessage(e.target.value);
    }
    useEffect(()=>{
        const fetchLandlord=async()=>{
        try {
            const res=await fetch(`/api/user/${listing.userRef}`);
            const data=await res.json();
            setLandlord(data); 
        } catch (error) {
           console.log(error);
        }
        }
        fetchLandlord();

    },[listing.userRef])
        
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
           <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
           <textarea 
            name='message'
            placeholder='Type your message here...'
             id='message'
             rows='2' 
             value={message} 
             onChange={changeHandler}>
             className='w-full p-2 border border-gray-300 rounded-md'
             placeholder='Type your message here...'
            
             </textarea>

             <Link 
               to={`mailto:${landlord.email}?subject=Inquiry about ${listing.name} &body=${message}`} className='bg-blue-500 text-white text-center p-2 rounded-md'>Send Message
             </Link>

        </div>

      )
      }


    </>
  )
}

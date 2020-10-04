import React from 'react';
import WelcomeCard from '../components/welcomeCard';
import Navbar from '../components/navbar';

export default function Login(){ 
    return(
        <div>
            <Navbar/>
            <WelcomeCard/>
        </div>
    );
}
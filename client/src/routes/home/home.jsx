import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';
import './home.css'

const Home=()=>{

    const[typingStatus, setTypingStatus]= useState("bot");

    return(
        <div className="home">
            <img src='/orbital.png' className='orbital' alt='' />
            <div className="left">
                <h1>Ash AI</h1>
                <h2>Your friendly multilingual AI assistant that can talk</h2>
                <h3>An AI assistant that can understand 10 different Indian languages and can even talk back to you!</h3>
                <Link to='/dashboard'>Get Started</Link>
            </div>
            <div className="right">
                <div className="imgContainer">
                    <div className="bgContainer">
                        <div className="bg">

                        </div>
                    </div>
                    <img src='/bot.png' alt='' className='mascot'/>
                    <div className="chat">
                        <img src={typingStatus == "bot" ? "/bot.png" : "/human1.png"} alt='' />         
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                'Bot: How can I help you today?',
                                2000,()=>{
                                    setTypingStatus("human1");
                                }, 
                                'User: Can you understand me?',
                                2000,()=>{
                                    setTypingStatus("bot");
                                },
                                'Bot: Of course I can',
                                2000,()=>{
                                    setTypingStatus("human1");
                                },
                                'User: Great! You are the best',
                                2000,()=>{
                                    setTypingStatus("bot");
                                }
                            ]}
                            wrapper="span"
                            speed={60}
                            style={{ fontSize: '1.3em', display: 'inline-block' }}
                            omitDeletionAnimation={true}
                            repeat={Infinity}
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src='/logo.png' alt='' />
                <div className="links">
                    <Link to="/">Terms of Service</Link>
                    <span> | </span>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}

export default Home;
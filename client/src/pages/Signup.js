import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const createUser = async () => {
        try {
          const response = await axios.post('http://localhost:3000/signup', { username, password });
          console.log('user created successfully:', response.data);
          setTimeout(() => {
            navigate("/safe");
          }, 10)
        } catch (error) {
          console.log('user creation failed:', error);
        }
      }


    return(
        <div>
            <h1>Signup</h1>
            <div>
            <input className="signup" type="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username"></input>
            <input className="signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"></input>
            <button onClick={createUser}>Signup</button>
            </div>
        </div>
    )
}

export default Signup;
import React from "react";
import { useState } from "react";
import axios from "axios";
import ErrorPopup from "../components/Errorpopup";

function Home () {
    const [vaultname, setVaultname ] = useState('');
    const [error, setError] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    const createVault = async () => {
        try {
          if (!vaultname){
            setError('Please fill in all fields')
            setShowErrorPopup(true);
            return;
          }
          const response = await axios.post('http://localhost:3001/create-vault', { vaultname });

          const sessionToken = response.data.token;
          sessionStorage.setItem('sessionToken', sessionToken);
          console.log('vault created successful:', response.data);
        } catch (error) {
          console.log('vault creation failed:', error);
          setError('vault creation failed');
          setShowErrorPopup(true);
        }
      }


    return(
        <div>
            <div className="title-container">
            <h1 className="title">
                Welcome
            </h1>
            </div>
            <div className="add-vault-container">
                <h2>
                    Create a new Vault
                </h2>
                <input placeholder="Enter Name..." value={vaultname} onChange={(e) => setVaultname(e.target.value)}></input>
                <button onClick={createVault}></button>
            </div>
            <div className="vault">

            </div>

        </div>
    )
}

export default Home;
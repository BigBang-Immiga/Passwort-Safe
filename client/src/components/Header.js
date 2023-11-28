import React from "react";
import { Link } from "react-router-dom";

function Header () {
    const handleLogout = () => {
        sessionStorage.removeItem("jwtToken");
        console.log("Successfully loged out")
    }

    return(
        <div className="header">
            <Link to='/login' onClick={handleLogout}><p>Logout</p></Link>
        </div>
    )
}

export default Header;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Vault.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function Vault() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({
    username: "",
    password: "",
    website: "",
    remarks: "",
  });
  const [hoveredPasswordId, setHoveredPasswordId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    } else {
      getData();
    }
  }, [navigate]);

  const getData = () => {
    axios
      .get("http://localhost:3001/get-vault", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwtToken"),
        },
      })
      .then((response) => setPasswords(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getData();
  }, []);

  const addPassword = () => {
    const token = sessionStorage.getItem("jwtToken");

    axios
      .post("http://localhost:3001/post-vault", newPassword, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNewPassword({
          username: "",
          password: "",
          website: "",
          remarks: "",
        });
        getData();
      })
      .catch((error) => console.error(error));
  };

  const handleMouseEnter = (passwordId) => {
    setHoveredPasswordId(passwordId);
  };

  const handleMouseLeave = () => {
    setHoveredPasswordId(null);
  };

  return (
    <div>
      <Header />
      <div className="title">
        <h1>Password Safe</h1>
      </div>
      <div className="input">
        {/* ... (existing code) */}
        <button onClick={addPassword}>Add</button>
      </div>
      <div className="secret">
        <div className="table-container">
          <table className="secret-table">
            <thead>
              <tr className="title-row">
                <th>Username</th>
                <th>Password</th>
                <th>Website</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((password) => (
                <tr
                  key={password.id}
                  onMouseEnter={() => handleMouseEnter(password.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td>{password.username}</td>
                  <td>
                    {hoveredPasswordId === password.id
                      ? password.password
                      : '*'.repeat(password.password.length)}
                  </td>
                  <td>{password.website}</td>
                  <td>{password.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Vault;

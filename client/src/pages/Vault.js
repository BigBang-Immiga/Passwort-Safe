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
  });

  const [editMode, setEditMode] = useState(false);
  const [editedPasswordId, setEditedPasswordId] = useState(null);
  

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

  const editInput = (id) => {
    const passwordToEdit = passwords.find((password) => password.id === id);
    if (passwordToEdit) {
      
      setNewPassword({
        username: passwordToEdit.username,
        password: passwordToEdit.password,
        website: passwordToEdit.website,
        remarks: passwordToEdit.remarks,
      });
      setEditMode(true);
      setEditedPasswordId(id);
    }
  };

  const deleteInput = (id) => {
    const token = sessionStorage.getItem("jwtToken");

    axios
      .delete(`http://localhost:3001/delete-input/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        getData();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Header />
      <div className="title">
        <h1>Password Safe</h1>
      </div>
      <div className="input">
        <input
          className="username"
          type="text"
          placeholder="Username"
          value={newPassword.username}
          onChange={(e) =>
            setNewPassword({ ...newPassword, username: e.target.value })
          }
        />
        <input
          className="password"
          type="password"
          placeholder="Password"
          value={newPassword.password}
          onChange={(e) =>
            setNewPassword({ ...newPassword, password: e.target.value })
          }
        />
        <input
          className="website"
          type="text"
          placeholder="Website"
          value={newPassword.website}
          onChange={(e) =>
            setNewPassword({ ...newPassword, website: e.target.value })
          }
        />
        <input
          className="remarks"
          type="text"
          placeholder="Remarks"
          value={newPassword.remarks}
          onChange={(e) =>
            setNewPassword({ ...newPassword, remarks: e.target.value })
          }
        />
        <button onClick={addPassword}>{editMode ? "Save" : "Add"}</button>
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
                <th>Edit & Delete</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((password) => (
                <tr key={password.id}>
                  <td>{password.username}</td>
                  <td>{'*'.repeat(password.password.length)}</td>
                  <td>{password.website}</td>
                  <td>{password.remarks}</td>
                  <td className="btn-column">
                  <button onClick={() => editInput(password.id)}>Edit</button>
                  <button onClick={() => deleteInput(password.id)}>Delete</button>
                  </td>
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

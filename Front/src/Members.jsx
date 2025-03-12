import React from "react";
import Sidebar from "./Components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from "react-toastify";
import { NavLink, useNavigate } from 'react-router-dom';

const Members = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) {
      console.log("No owner ID found in localStorage");
      return;
    }
    axios
      .get(`http://localhost:5000/Members?ownerId=${ownerId}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching members:", err);
      });
  }, []);
  const navigate = useNavigate();
  const handleUpdate = (id) => {
    navigate("/editmember", { state: { id } });
  };

  const handleDelete = (_id) => {
    axios
      .delete(`http://localhost:5000/DeleteMembers/${_id}`)
      .then((res) => {
        setData(data.filter((item) => item._id !== _id));
        toast.success("Member Deleted Successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("ownerId");
    localStorage.removeItem("gymname");
    toast.success("Logged out successfully"); 
    navigate("/Login");
  };

  return (
    <>
      <Sidebar />
      <div className="main">
        <header>
          <div className="header-left">
            <h1>Members</h1>
            <NavLink to="/addmember" id="addbtn" style={{ textDecoration: 'none' }} >
              <button type="button" className="btn btn-info">Add Member<ion-icon name="person-add" ></ion-icon></button>
            </NavLink>
          </div>
          <NavLink to='/Login' id="logout"onClick={handleLogout}>
            <span><LogoutIcon /> Logout</span>
          </NavLink>
        </header>


        <hr id="hrdash" />

        <div className="members-container">
          {data.length === 0 ? (
            <p>No members found</p>
          ) : (
            data.map((item) => (
              <div className="member-card" key={item._id}>
                <h3>{item.name}</h3>
                <p><strong>Plan:</strong> {item.plan}</p>

                <p><strong>Joining Date:</strong> {item.joinDate}</p>
                <p><strong>Next Due Date:</strong> {item.nextDueDate}</p>
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleUpdate(item._id)}>Update</button>
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
export default Members;

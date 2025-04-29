import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import EditPlanModal from './editplanmodal';
import AddPlanModal from './Addplanmodal';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: '', price: '', duration: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('https://gymdesk.onrender.com/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleAddPlan = (newPlan) => {
    setPlans([...plans, newPlan]);
  };

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setUpdatedData({ ...plan });
  };


  const handleUpdate = async (updatedPlan) => {
    try {
      await axios.patch(`https://gymdesk.onrender.com/plans/${editingPlan._id}`, updatedPlan);
      setPlans(plans.map((plan) => (plan._id === editingPlan._id ? updatedPlan : plan)));
      setEditingPlan(null);
      toast.success('Plan updated successfully');
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };
  const handleDelete = (_id) => {
    const ownerId = localStorage.getItem("ownerId"); // Get ownerId from local storage

    if (!ownerId) {
      toast.error("Unauthorized: Please login first");
      return;
    }
    axios.delete(`https://gymdesk.onrender.com/delete/plans/${_id}`, {
      data: { ownerId } })
      .then((res) => {
        setPlans(plans.filter((plan) => plan._id !== _id));
        toast.success("Plan Deleted Successfully!");
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
            <h1>Membership Plans</h1>
            <span id='addplan'>
              <button type="button" className="btn btn-info" onClick={() => setShowAddModal(true)}>Add Plan<ion-icon name="add-outline"></ion-icon></button>
            </span>
          </div>
          <NavLink to='/Login' id='logout' onClick={handleLogout}><span ><LogoutIcon /> Logout</span></NavLink>
        </header>
        <hr id="hrdash" />

        <div className="plans-container">
          {plans.length === 0 ? (
            <p>Add New Plans</p>
          ) : (
            plans.map((plan) => (
              <div className="plan-card" key={plan._id}>
                <h3>{plan.name}</h3>
                <p><strong>Price:</strong> ₹{plan.price}</p>
                <p><strong>Duration:</strong> {plan.duration}</p>
                <button className="edit-btn" onClick={() => handleEditClick(plan)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(plan._id)}>Delete</button>
              </div>
            ))
            )}
        </div>

        {editingPlan && (
          <EditPlanModal
            show={editingPlan !== null}
            handleClose={() => setEditingPlan(null)}
            plan={editingPlan}
            handleUpdate={handleUpdate}
          />
        )}
        <AddPlanModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          handleAdd={handleAddPlan}
        />
      </div>
    </>
  );
}

export default MembershipPlans;

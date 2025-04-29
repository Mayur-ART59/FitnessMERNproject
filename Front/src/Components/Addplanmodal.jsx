import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';
import axios from 'axios';

function AddPlanModal({ show, handleClose, handleAdd }) {
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    duration: "1 Month"
  });
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
  };

  // Handle form submission
  const handleSave = () => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) {
      toast.error("Please login to add a plan.");
      handleClose();
      return;
    }
    if (!newPlan.name || newPlan.price <= 0) {
      setError("Please enter a valid plan name and price.");
      toast.error("Please enter a valid plan name and price.");
      return;
    }

    setError("");

    // Send request to backend to create new plan
    axios.post("https://gymdesk.onrender.com/addplans", {
      ...newPlan, 
      ownerId,   
  })
      .then(() => {
        toast.success("Plan added successfully!");
        handleAdd(newPlan);
        setNewPlan({ name: "", price: "", duration: "1 Month" });
        handleClose();
      })
      .catch((err) => {
        console.error("Error adding plan:", err);
        toast.error("Failed to add plan.");
      });
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" aria-hidden={!show}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Membership Plan</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Plan Name</label>
            <input
              type="text"
              name="name"
              value={newPlan.name}
              onChange={handleChange}
              className="form-control"
              required
              autoComplete='off'
            />

            <label className="form-label mt-3">Price</label>
            <input
              type="number"
              name="price"
              value={newPlan.price}
              onChange={(e) => handleChange({ target: { name: "price", value: parseFloat(e.target.value) } })}
              className="form-control"
              required
            />

            <label className="form-label mt-3">Duration</label>
            <select
              name="duration"
              value={newPlan.duration}
              onChange={handleChange}
              className="form-control"
            >
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="9 Months">9 Months</option>
              <option value="1 Year">1 Year</option>
            </select>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Add Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPlanModal;

import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';

function EditPlanModal({ show, handleClose, plan, handleUpdate }) {
  const [updatedPlan, setUpdatedPlan] = useState({ ...plan });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPlan({ ...updatedPlan, [name]: value });
  };

  const handleSave = () => {

    if (!updatedPlan.name || updatedPlan.price <= 0) {
      setError("Please enter a valid plan name and price.");
      toast.error('Please enter Valid plan name and price')
      return;
    }

    setError("");
    handleUpdate(updatedPlan);
    handleClose();
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} id="editPlanModal" tabIndex="-1" aria-labelledby="editPlanLabel" aria-hidden={!show}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editPlanLabel">Edit Membership Plan</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Plan Name</label>
            <input
              type="text"
              name="name"
              value={updatedPlan.name}
              onChange={handleChange}
              className="form-control"
              required
            />

            <label className="form-label mt-3">Price</label>
            <input
              type="number"
              name="price"
              value={updatedPlan.price}
              onChange={(e) => setUpdatedPlan({ ...updatedPlan, price: parseFloat(e.target.value) || '' })}

              className="form-control"
              required
            />

            <label className="form-label mt-3">Duration</label>
            <select
              name="duration"
              value={updatedPlan.duration}
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
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPlanModal;

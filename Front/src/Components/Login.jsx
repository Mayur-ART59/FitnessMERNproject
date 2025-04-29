import React from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://gymdesk.onrender.com/SignIn', form)
      .then((res) => {
        console.log(res.data);
        const { username,ownerId,gymname } = res.data;
       
        localStorage.setItem('username', username);
        localStorage.setItem('ownerId', ownerId);
        localStorage.setItem( 'gymname',gymname);
        toast.success("Logged In Successfully!",{position: "top-right" });
        navigate('/DashBoard', { state: { message: "Login Successfull", username ,gymname  } });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Wrong Credentials', {
          position: "top-center"
        })
      })
  }

  return (
    <>
      <div className="headd"><h2>Welcome To Gym Management System</h2></div>
      <section className="auth-container">
        <div className="form-box">
          <div className="form-value">
            <form onSubmit={handleSubmit}>
              <h2>Sign In</h2>


              <div className="inputbox">
                <ion-icon name="mail-outline" />
                <input type="email" name='email' value={form.email} autoComplete='off' onChange={handleForm} required />
                <label>Email</label>
              </div>


              <div className="inputbox">
                <input type={showPassword ? "text" : "password"} name='password' value={form.password} onChange={handleForm} required />
                <label>Password</label>
                <ion-icon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
                />

              </div>

              <div className="forget">

                <label>
                  <a href="#">Forgot password?</a>
                </label>
              </div>
              <button className="buttonsign" type='submit'>Sign In</button>
              <div className="register">
                <p>Don't have an account ? <NavLink to="/Signup">Sign Up</NavLink></p>
              </div>
            </form>
          </div>
        </div>
      </section>

    </>
  )
}

export default Login;
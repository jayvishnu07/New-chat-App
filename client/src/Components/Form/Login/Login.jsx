import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EntireChatState } from '../../../ContextAPI/chatContext';
import './Login.css';



const Login = () => {
  const { setUser, user } = EntireChatState()
  const [showPassword, setShowPassword] = useState(false);
  const [mail_id, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()


  const signIn = e => {
    e.preventDefault();
    if (!mail_id || !password) {
      toast.warn('🦄 Please fill out all fields', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    axios.post('http://localhost:8080/user/auth/login/', { mail_id, password })
      .then((result) => {
        toast.success('🦄 Login Successful!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        const stringified = JSON.stringify(result.data)
        const stringifiedToken = JSON.stringify(result.data.token)
        localStorage.setItem('userInfo', stringified)
        localStorage.setItem('userToken', stringifiedToken)
        setUser(result.data)
        navigate('/chats')
      })
      .catch((error) => { //Take care of error prop
        toast.error(error?.response?.data, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(error.message);
        console.log(error.config);
        return;

      })
  }


  return (
    <div className="login-container">
      <span className='login-main-title' >Sign-In</span>
      <div className="login-form-input-div">
        <label htmlFor="mail_id">Email-ID</label>
        <input onChange={(e) => setEmail(e.target.value)} className='login-form-input' name='mail_id' type="text" placeholder='Mail-ID' />
        <label htmlFor="password">Password</label>
        <span className="password-input-wrapper password-input-div  ">
          <input onChange={(e) => setPassword(e.target.value)} className='login-form-input' name='password' type={showPassword ? 'text' : 'password'} placeholder='Password' />
          <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"} onClick={() => { setShowPassword((prev) => !prev) }} id="togglePassword"></i>
        </span>

      </div>
      <button className="login-submit-btn" onClick={signIn}>Sign-In</button>
    </div>
  )
}

export default Login
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScaleLoader from "react-spinners/ScaleLoader";
import { toast } from 'react-toastify';
import './Register.css';



const Register = () => {
  const initialState = {
    name: '',
    mail_id: '',
    password: '',
    confirmPassword: '',
  }
  const [data, setData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profilePic, setProfilePic] = useState();
  const [loading, setLoading] = useState(false)
  const [picLoading, setPicLoading] = useState(false)

  const navigate = useNavigate()

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }
  const profilePicHandler = (pic) => {
    setLoading(true);
    setPicLoading(true)

    if (pic === undefined) {
      toast.warn('🦄 Please Select a Image.', {
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
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "Chat-Application");
      data.append("cloud_name", "djn1saw5y");
      fetch("https://api.cloudinary.com/v1_1/djn1saw5y/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfilePic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast.warn('🦄 it is not a Image.', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setPicLoading(false);
      return;
    }
    console.log(profilePic);
  }

  const signUp = e => {
    e.preventDefault();
    const { name, mail_id, password, confirmPassword } = data;
    if (!name || !mail_id || !password) {
      toast.warn('🦄 Please fill out all the fields.', {
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

    if (password !== confirmPassword) {
      toast.warn('🦄 Password is missmatching', {
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


    axios.post('http://localhost:8080/user/auth/register/', { name, mail_id, password, profilePic })
      .then((result) => {
        toast.success('🦄 Registration Successful!', {
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
        navigate('/chats')
      })
      .catch((error) => { //Take care of error prop
        toast.error('🦄 Something went wrong while registration!', {
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
      })

  }

  return (
    <div className="register-container">
      <span className='register-main-title' >Sign-Up</span>
      <div className="register-form-input-div">
        <label htmlFor="name">Name</label>
        <input onChange={onChangeHandler} className='register-form-input' name='name' type="text" placeholder='Name' />
        <label htmlFor="mail_id">Mail-ID</label>
        <input onChange={onChangeHandler} className='register-form-input' name='mail_id' type="text" placeholder='Mail-ID' />
        <label htmlFor="password">Password</label>
        <span className="password-input-wrapper password-input-div">
          <input onChange={onChangeHandler} className='register-form-input' name='password' type={showPassword ? 'text' : 'password'} placeholder='Password' />
          <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"} onClick={() => { setShowPassword((prev) => !prev) }} id="togglePassword"></i>
        </span>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <span className="password-input-wrapper password-input-div">
          <input onChange={onChangeHandler} className='register-form-input' name='confirmPassword' type={showConfirmPassword ? 'text' : 'password'} placeholder='ConfirmPassword' />
          <i className={showConfirmPassword ? "fa fa-eye" : "fa fa-eye-slash"} onClick={() => { setShowConfirmPassword((prev) => !prev) }} id="togglePassword"></i>
        </span>
        <label htmlFor="profilePic" id='uploading-animaation' >Upload Profile {picLoading && <ScaleLoader height={10} />} </label>
        <input onChange={(e) => profilePicHandler(e.target.files[0])} className='register-form-input-file' name='profilePic' type="file" />
      </div>

      <button className="register-submit-btn" onClick={signUp}>Sign-Up</button>
    </div>
  )
}

export default Register
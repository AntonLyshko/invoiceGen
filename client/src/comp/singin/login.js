import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/auth";

const LogIn = ({ login }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = async e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className='login-container'>
      
      
      <form className="login-form" onSubmit={e => onSubmit(e)}>
      <img className='login-logo' src='https://www.devotiondresses.com/images/logoRedesign.f5d6bb.svg' />
      <div className='api-title'>Proform manager</div>
        <div className='login-title'>Log-In</div>
      <div className='login-input-container'>
      <input
            type="text"
            className='input login-input'
            placeholder="Name"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
          <input
            type="password"
            className='input login-input'
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
          />
        <input type="submit" className="input btn btn-login" value="Login" />
      </div>
      </form>
    </div>
  );
};

LogIn.prototype = {
  login: PropTypes.func.isRequired
};

export default connect(null, {
  login
})(LogIn);

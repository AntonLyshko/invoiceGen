import React, {Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import logo from './logo.svg'
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import logoutIcon from './logout.svg'

const Auth = ({ auth: { isAuthenticated, user}, logout }) => {
  const authPanel = () => {
    console.log(user);
      if (isAuthenticated) {
        return (
          <div className="auth-panel">
            <div className='logo'>
              <img src={logo} />
            </div>
            
            <div className="logout" onClick={() => logout()}>
            <img src={logoutIcon} />
            </div>
            <div className="user">
            <Fragment>
				{!user ? (
					<Fragment>
            admin
					</Fragment>
				) : (
					<Fragment>
						{user.login}
					</Fragment>
				)}
			</Fragment>
            </div>
            <Redirect to="/invoice" />
          </div>
        );
      } else {
        return (
          <div>
            <Redirect to="/login" />
          </div>
        );
      }
  
  };

  return <div>{authPanel()}</div>;
};
Auth.prototype = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  logout
})(Auth);

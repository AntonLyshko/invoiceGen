import React, { useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";
import LogIn from "./comp/singin/login";
import "./style.css";
import { Provider } from "react-redux";
import store from "./store";
import Alert from "./comp/alert";
import setAuthToken from "./utills/setAuthToken";
import loadUser from "./actions/auth";
import Auth from "./comp/profile/auth";
import PrivateRoute from "./routing/privateRoute";
import Invoice from "./comp/invoice/invoice";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <div>
        <Auth />
        <br />
        <Alert />
        <br />
        <section>
          <Switch>
            <Route path="/login" component={LogIn} />
            <PrivateRoute path="/" component={Invoice} />
          </Switch>
        </section>
      </div>
    </Provider>
  );
};

export default App;

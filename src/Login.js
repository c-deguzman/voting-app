import React from 'react';

export default class Login extends React.Component {
  render() {
    return (
      <div>
        <h1 className="centre">Login Portal</h1>
        <form action="/login" method="post">
          <div className="centre">
          <label><b>Username: </b></label>
          <input type="text" placeholder="Enter Username" name="user" required />
          </div>
          
          <div className="centre">
          <label><b>Password: </b></label>
          <input type="password" placeholder="Enter Password" name="pass" required />
          </div>
          
          <div className="centre">
            <button id="login_button" type="submit" className="btn btn-info">Login</button>
          </div>
        </form>
      </div>
    );
  }
}

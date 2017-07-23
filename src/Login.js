import React from 'react';

export default class Login extends React.Component {

    constructor(props){
      super(props);

      this.render = this.render.bind(this);
      
      if (this.props.basic_props){
        this.state = {
          auth: this.props.basic_props.auth
        }
      } else if (this.props.auth){
        this.state = {
          auth: this.props.auth
        }
      } else {
        this.state = {
          auth: false
        }
      }
      
    }


    render() {

      return (
        <div>
        {this.state.auth ? 
            <h2> Logged In </h2> :
            <h2> Logged Out </h2> }
      
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


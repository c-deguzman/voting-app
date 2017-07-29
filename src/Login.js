import React from 'react';
import Alert from './Alert';

export default class Login extends React.Component {

    constructor(props){
      super(props);

      this.render = this.render.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
          result: "n/a",
          error: "",
          error_show: true
        }
    }

    handleSubmit(event){

      event.preventDefault();

      var user = event.target.user.value;
      var pass = event.target.pass.value;
    
      var send_data = {user: user, pass: pass};

      var request_login = $.ajax({
        type: "POST",
        url: "/login",
        contentType: 'application/json',
        data: JSON.stringify(send_data),
      });
      
      request_login.done((data_login) => {

        if (data_login.result == "error"){
          this.setState({
            error_show: true,
            result: "error",
            error: data_login.message
          });
        } else if (data_login.result == "success"){
          window.location.assign("/home");
        }
      });
    }

    render() {
      
      return (
        
        <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <h4 className="navbar-text">
                 Voting App Gamma
              </h4>
            </div>

            <ul className="nav navbar-nav">
              <li><a href="/home">Home</a></li>
            </ul>

            <p className="navbar-text">Not signed in</p>
            
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/register"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
              <li className="active"><a href="#"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul> 
          </div>
        </nav>

        <h1 className="centre">Login Portal</h1>
        
        <div className="centre">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="user">Username:</label>
              <div className="col-sm-12">
                <input type="text" className="form-control" id="user" name="user" placeholder="Enter username" required/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="pwd">Password:</label>
              <div className="col-sm-12"> 
                <input type="password" className="form-control" id="pwd" name="pass" placeholder="Enter password" required />
              </div>
            </div>

            <div className="form-group"> 
              <div className="col-sm-12">
                <button type="submit" className="btn btn-default">Login</button>
              </div>
            </div>
          </form>
        </div>

        <Alert show={this.state.error_show} changeShow={() => this.setState({error_show: false})} result={this.state.result} error={this.state.error} success={"Login successful! Redirecting now."} /> :

      </div>
    );
  }
}


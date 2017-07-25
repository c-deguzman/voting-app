import React from 'react';
var $ = require("jquery");

export default class Register extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.handle_submit = this.handle_submit.bind(this);
    
    this.state = {
      status: "Not Sent"
    }
  }
  
  handle_submit(event) {
    
    event.preventDefault();
    
    var user = event.target.user.value;
    var pass = event.target.pass.value;
    
    var send_data = {user: user, pass: pass};
    
    var request = $.ajax({
      type: "POST",
      url: "/register",
      contentType: 'application/json',
      data: JSON.stringify(send_data),
    });
    
    request.done((data) => {
        
        if (data.result == "error"){
          this.setState({
            status: data.result,
            error: data.error
          });
        } else {
          this.setState({
            status: data.result,
          });
        }
      });
  }
  
  render() {
    return (
      <div>
        <h1 className="centre">Register</h1>
        <form onSubmit={this.handle_submit}>
          <div className="centre">
          <label><b>Email Acc:</b></label>
          <input type="text" placeholder="Enter email (OPTIONAL)" name="email" />
          </div>
          <div className="centre">
          <label><b>Username: </b></label>
          <input type="text" placeholder="Enter Username" name="user" required  pattern="^[a-z0-9_-]{3,15}$"/>
          </div>
          
          <div className="centre">
          <label><b>Password: </b></label>
          <input type="password" placeholder="Enter Password" name="pass" required />
          </div>
          
          <div className="centre">
            <button id="login_button" type="submit" className="btn btn-info">Register</button>
          </div>
        </form>
        <div  id="email_notice">
            <p className="centre"> * Currently email is not used for anything. </p>
            <p className="centre"> Username must be 3 - 15 characters. Only lowercase alphanumeric, hyphens, and dashes are allowed.</p>
        </div>
        
        <div id="status_msg">
          <a className="centre" href="/login/">Login</a>
          {
            this.state.status == "Not Sent" ?
            <div /> :
            this.state.status == "error" ?
              <h4 className="centre"  id="fail">{this.state.error}</h4> :
              <h4 className="centre"  id="pass">Account Created!</h4>
          }
        </div>
      </div>
    );
  }
}
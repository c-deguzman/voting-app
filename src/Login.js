import React from 'react';

export default class Login extends React.Component {

    constructor(props){
      super(props);

      this.render = this.render.bind(this);
      this.error_check = this.error_check.bind(this);
      
      if (this.props.hasOwnProperty('basic_props')){
        this.state = {
          error: this.props.basic_props.error
        }
      } else if (this.props.hasOwnProperty('auth')){
        this.state = {
          error: this.props.error
        }
      } 
    }
  
    
    error_check(){
      if (this.state.error.length > 0){
        return this.state.error[0];
      }
      return false;
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
              <li className="active"><a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul> 
          </div>
        </nav>

        <h1 className="centre">Login Portal</h1>
        
        <div className="centre">
          <form className="form-horizontal" action="/login" method="post">
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
        
        <div className="centre">
          { 
            this.error_check() ?
            <h4 className="error_msg"> {this.error_check()}</h4> :
            <div></div>
          }
        </div>
      </div>
    );
  }
}


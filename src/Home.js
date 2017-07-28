import React from 'react';
import $ from 'jquery';

export default class HomePage extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    
    this.state = {
      poll: [],
      user: " ",
      auth: false
    }
  }
  
  
  componentDidMount() {
    var request_poll = $.ajax({
      type: "POST",
      url: "/get_polls",
      contentType: 'application/json'
    });
    
    request_poll.done((data_poll) => {
      
      var request_user = $.ajax({
        type: "POST",
        url: "/get_user",
        contentType: 'application/json'
      });
      
      request_user.done((data_user) => {
        
        var auth_state;
        
        if (data_user === false){
          auth_state = false;
        } else {
          auth_state = true;
        }
        
        this.setState({
          poll: data_poll,
          user: data_user,
          auth: auth_state
        });
      });
    });
  }
  
  handleRedirect(event, target){
    window.location.assign("/poll?id=" + target);
  }
  
  
 
  render() {
    return (
      <div >

        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <h4 className="navbar-text">
                 Voting App Gamma
              </h4>
            </div>

            <ul className="nav navbar-nav">
              <li className="active"><a href="/home">Home</a></li>
            </ul>

            {
              this.state.auth ?
              <ul className="nav navbar-nav">
                <li><a href="/create_poll">Create Poll</a></li>
                <li><a href="#">My Polls</a></li>
              </ul> :
              <div />
            }

            {
              this.state.auth ? 
              <p className="navbar-text"> Signed in as {this.state.user} </p> :
              <p className="navbar-text">Not signed in</p>
            }

            {
              this.state.auth === false ?
              <ul className="nav navbar-nav navbar-right">
                <li><a href="/register"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                <li><a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
              </ul> :
              <ul className="nav navbar-nav navbar-right">
                <li><a href="/logout"><span className="glyphicon glyphicon-log-out"></span> Logout </a></li>
              </ul> 
            }
          </div>
        </nav>

        
        <h3> Latest Polls </h3> 
        <div className="centre">
          <ul className="list-group" id="results">
          {
            this.state.poll.map((item,i) => 
                <li key={i} className="list-group-item" onClick={(e) => this.handleRedirect(e, this.state.poll[i]._id)}> 
                  <span className="badge">{this.state.poll[i].total_votes}</span>
                  <p><b>{this.state.poll[i].title}</b> Posted by {this.state.poll[i].poster}</p> 

                </li>)  
          }
          </ul>
        </div>
        
      </div>
    );
  }
}
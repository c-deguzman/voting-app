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
        {this.state.auth ? 
        <div id="logout_button">
        <a href="/logout"><button className="btn btn-danger">Logout</button></a>
        </div> :
        <div id="logout_button">
        <a href="/register"><button className="btn btn-success">Register!</button></a>
        </div>
        }
          
        {this.state.auth ? 
          <h4 id="welcome">Welcome {this.state.user}</h4> : 
          <h4 id="welcome">Welcome Guest!</h4>
        }

        <div>
        <h3> Latest Polls </h3>
          
        { 
          this.state.auth ?
          <div className="btn-group" role="group">
              <a href = "/create_poll">
              <button className="btn btn-info" >Create Poll <span className="glyphicon glyphicon-wrench" /></button> 
              </a>
              <button className="btn btn-info" >My Polls <span className="glyphicon glyphicon-filter" /></button>
          </div>:
          <button className="btn btn-info" onClick={(e) => window.location.assign("/login")}>Sign in to Create Polls <span className="glyphicon glyphicon-wrench"/></button> 
        }
          
          
        {
          this.state.poll.map((item,i) => 
              <div key={i} className="result" onClick={(e) => this.handleRedirect(e, this.state.poll[i]._id)}> 
                <b>{this.state.poll[i].title}</b>
                <div className="gap"/>
                <p> Posted by {this.state.poll[i].poster}</p>
              </div>)  
        }
        </div>
      </div>
    );
  }
}
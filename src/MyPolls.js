import React from 'react';
import $ from 'jquery';

export default class MyPolls extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.delete_poll = this.delete_poll.bind(this);
    
    this.state = {
      poll: [],
      user: " ",
      auth: false
    }
  }
  
  
  componentDidMount() {
    var request_poll = $.ajax({
      type: "POST",
      url: "/get_my_polls",
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
          poll: data_poll.my_polls,
          user: data_user,
          auth: auth_state,
          contribtution: data_poll.my_contr,
          delete_mode: false,
          show_delete_warning: false,
          status: "n/a",
          error: "" 
        });
      });
    });
  }
  
  handleRedirect(event, target){
    window.location.assign("/poll?id=" + target);
  }

  delete_poll(event, target){

    var request_poll_delete = $.ajax({
      type: "POST",
      url: "/delete",
      contentType: 'application/json',
      data: JSON.stringify({id: target})
    });

    request_poll_delete.done((data) => {
      if (data.result == "error"){
        this.setState({
          status: error,
          error: data.error
        });
      } else {
        
        var request_poll = $.ajax({
            type: "POST",
            url: "/get_my_polls",
            contentType: 'application/json'
          });
          
          request_poll.done((data_poll) => {
              this.setState({
                poll: data_poll.my_polls,
                contribtution: data_poll.my_contr,
                delete_mode: this.state.delete_mode,
                show_delete_warning: this.state.show_delete_warning,
                status: "success",
                error: "" 
              });
            });
        }
    });
  }
  
  
 
  render() {

    if (this.state.auth == false){
      return (<div >
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
              <li><a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul> 
          </div>
        </nav>
        <p> Please sign up or sign in to view the polls you've made. </p>
      </div>);
    }

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
              <li><a href="/home">Home</a></li>
            </ul>

            <ul className="nav navbar-nav">
              <li><a href="/create_poll">Create Poll</a></li>
              <li className="active"><a href="#">My Polls</a></li>
            </ul> 

            <p className="navbar-text"> Signed in as {this.state.user} </p> :

            <ul className="nav navbar-nav navbar-right">
              <li><a href="/logout"><span className="glyphicon glyphicon-log-out"></span> Logout </a></li>
            </ul> 
            
          </div>
        </nav>

        
        <h3> Your Latest Polls <span className="badge" id="badge_contr">{this.state.contribtution}</span> </h3> 

        <button className={"btn " + (this.state.delete_mode ? "btn-danger" : "btn-default")} onClick={() => this.setState({delete_mode: !this.state.delete_mode, show_delete_warning: true})}>
        <span className="glyphicon glyphicon-alert"></span>  &nbsp;
         Delete Mode 
        </button>

        { 
          this.state.delete_mode && this.state.show_delete_warning ?
            <div className="alert alert-warning fade-in">
              <span className="close" data-dismiss="alert" onClick={() => this.setState({show_delete_warning: false})}>&times;</span>
              <strong>Warning!</strong> Polls will be permanently deleted.
            </div> :
            null
        }

        

        <div className="centre">
          <ul className="list-group" id="results">
          {
            this.state.poll.map((item,i) => 
                <li key={i} className="list-group-item"> 
                   {
                    this.state.delete_mode ? 
                      <span className="close" data-dismiss="alert" onClick={(e) => this.delete_poll(e, this.state.poll[i]._id)}> &nbsp; &times;</span> :
                      null
                    }
                    <span className="badge">{this.state.poll[i].total_votes}</span>
                  <div onClick={(e) => this.handleRedirect(e, this.state.poll[i]._id)}>
                    <p><b>{this.state.poll[i].title}</b> Posted by {this.state.poll[i].poster}</p> 
                  </div>

                </li>)  
          }
          </ul>
        </div>
        
      </div>
    );
  }
}
import React from 'react';
import $ from 'jquery';

export default class HomePage extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    //this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    
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
        
        this.setState({
          poll: data_poll,
          user: data_user,
          auth: false
        });
      });
    });
  }
  
 
  render() {
    return (
      <div >
        <h4>Welcome {this.state.user}</h4>
        
        <div id="logout_button">
        <a href="/logout"><button className="btn btn-danger">Logout</button></a>
        </div>
      
        <div>
        <h3> Latest Polls </h3>
        {
          this.state.poll.map((item,i) => 
              <div key={i} className="result"> 
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


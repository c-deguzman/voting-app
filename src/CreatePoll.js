import React from 'react';
import $ from 'jquery';

class CustomPoll extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.titleChange = this.titleChange.bind(this);
    this.addOption = this.addOption.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.optionJSX = this.optionJSX.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    
    this.state = {
      title: "",
      options: [""],
      status: "not submitted",
      error: ""
    }
  }
  
  optionChange(event, ind){
    // TODO - change to immutability helper w/ React
    var copy = this.state.options;
    copy[ind] = event.target.value;
    
    this.setState({
      options: copy
    })
  }
  
  addOption(){
    console.log(this.state.options);
    this.setState({
      options: this.state.options.concat([""])
    });
  }
  
  optionJSX(ind){
    var inp_text = this.state.options[ind];
    var option_id = "option" + ind;
    
    return (
      <div key={option_id} className="form-group container"> 
                <label className="control-label col-sm-2" htmlFor={option_id}>Option {ind + 1}:</label>
                <div className="col-sm-8">
                  <input type="text" className="form-control" id={option_id} name={option_id} placeholder="Option" value={inp_text} onChange={(e) => this.optionChange(e,ind)} pattern="^.{1,30}$" required/>
                </div>
                <div className="col-sm-2">
                  {ind == 0 ?
                    this.state.options.length < 10 ?
                    <button type="button" className="btn btn-default" onClick={this.addOption}><i className="fa fa-plus"></i></button> :
                    <button type="button" className="btn btn-default" onClick={this.addOption} disabled><i className="fa fa-plus"></i></button> :
                    <button type="button" className="btn btn-default" onClick={() => this.removeOption(ind)}><i className="fa fa-minus"></i></button>
                  }
                    
                </div>
              </div>
    );
  }
  
  removeOption(ind){
    this.setState({
      options: this.state.options.filter((_, i) => i !== ind)
    });
  }
  
  titleChange(event){
    this.setState({
      title: event.target.value
    });
  }

  handleRedirect(id){
    window.location.assign("/poll?id=" + id);
  }
  
 handleSubmit(event) {
    
    event.preventDefault();
    
    var send_data = {
      title : this.state.title,
      options: this.state.options
    };
    
    var request = $.ajax({
      type: "POST",
      url: "/make_poll",
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
            status: data.result
          });

          this.handleRedirect(data.redirect);
        }
      });
  } 

  
  render() {
    return (
      <div>
        <div className="container">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group container">
                <label htmlFor="title" className="control-label col-sm-2"> Title </label>
                <div className="col-sm-8">
                  <input id="title" type="text" className="form-control" placeholder="Poll Title" onChange={this.titleChange} required/>
                </div>
              </div>
            
              {this.state.options.map((item, i) =>  this.optionJSX(i))}
              
              <div className="form-group"> 
                <div className="col-sm-10">
                  <button type="submit" className="btn btn-default">Submit Poll</button>
                </div>
              </div>
            </form>
        </div>
        <p className="centre"> Please limit options to a maximum of 30 characters. </p>

          
      {
        this.state.status != "not submitted" ? 
          this.state.status == "error" ?
            <h4 id="error_msg" className="centre">{this.state.error}</h4> :
            <h4 id="pass_msg" className="centre">Poll successfully created. Please wait to be redirected.</h4> :
          <div />
      }
            
      </div>);
  }
}

export default class CreatePoll extends React.Component {
  constructor(props){
    super(props);
    
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    
    this.state = {
      user: "",
      auth: false
    }
  }
  
  
  componentDidMount() {
 
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
          user: data_user,
          auth: auth_state
        });
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
        <p> Please sign up or sign in to create polls. </p>
      </div>)
    } else {
    
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
              <li className="active"><a href="/create_poll">Create Poll</a></li>
              <li><a href="#">My Polls</a></li>
            </ul> :


            <p className="navbar-text"> Signed in as {this.state.user} </p>


            <ul className="nav navbar-nav navbar-right">
              <li><a href="/logout"><span className="glyphicon glyphicon-log-out"></span> Logout </a></li>
            </ul> 
            
          </div>
        </nav>

        <div>
        <h3 className="centre"> Create Your Own Poll! </h3>
          
        <CustomPoll />
         
        </div>
      </div>
    );
    }
  }
}

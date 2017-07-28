import React from 'react';
import { Chart } from 'react-google-charts';
import $ from 'jquery';
 
export default class ChartDisplay extends React.Component {
  constructor(props){
    super(props);
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.vote = this.vote.bind(this);
    
    this.state = {
      status: "n/a",
      auth: false,
      vote_status: "n/a"
    }
  }
  
  componentDidMount(){
    var id = (window.location.search).replace("?id=", "");

    var send_data = {
      id: id
    };
    
    
    
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
        
        var request = $.ajax({
          type: "POST",
          url: "/poll",
          contentType: 'application/json',
          data: JSON.stringify(send_data),
        });
        
        request.done((data) => {
            
            if (data.result == "error"){
              this.setState({
                status: data.result,
                error: data.error,
                user: data_user,
                auth: auth_state
              });
            } else {
              this.setState({
                status: data.result,
                poster: data.poster,
                chart_data: data.chart_data,
                title: data.title,
                user: data_user,
                auth: auth_state
              });
            }
          });
      });
    
  }

  vote(option){

    var id = (window.location.search).replace("?id=", "");

    var send_data = {
      id: id,
      option: option
    };

    var request = $.ajax({
      type: "POST",
      url: "/vote",
      contentType: 'application/json',
      data: JSON.stringify(send_data),
    });
        
    request.done((data) => {
      if (data.result == "error"){
        this.setState({
          vote_status: data.result,
          vote_error: data.error
        });
      } else {
        this.setState({
          vote_status: data.result,
          chart_data: data.chart_data
        })
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

      <div id="chart">
      
        {this.state.status == "success" ?
            <Chart
              chartType="PieChart"
              data={this.state.chart_data}
              options={{title: this.state.title,
                        sliceVisibilityThreshold:0}}
              graph_id="PieChart"
              width="100%"
              height="400px"
              legend_toggle
            /> 
          :
        this.state.status == "error" ?
          <h4 id="error_msg">{this.state.error}</h4> :
        <h4>Loading...</h4>  }
      </div>

      <div className="centre">
      {
        this.state.vote_status == "error" ?
        <h4 id="error_msg">{this.state.vote_error}</h4> :
        this.state.vote_status == "success" ?
        <h4 id="pass_msg">Your vote has been successfully recorded.</h4> :
        <div />
      }
      </div>


      <div id="voting_options" className="container">
        <div className="col-md-12"> 

        {
          this.state.status != "success" ?
          <div /> :
          <div>
            <h4> Voting Options </h4>
            {this.state.chart_data.map((item, i) => {

              if (i == 0){
                return <div key={i} />
              }

              return <div key={i}>
                      <label htmlFor={i} className="control-label col-md-1" >{item[1]}</label>
                      <button onClick={() => this.vote(i - 1)}  className="btn btn-default col-md-5" id={i}>{item[0]}</button>
                    </div>
              })
          }
          </div>
        }

        </div>
      </div>

    </div>
    );
  }
}
import React from 'react';
import { Chart } from 'react-google-charts';
import $ from 'jquery';
 
export default class ChartDisplay extends React.Component {
  constructor(props){
    super(props);
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    
    this.state = {
      status: "n/a",
      auth: false
    }
  }
  
  componentDidMount(){
    var id = (window.location.pathname).replace("/poll?id=", "");
    
    var send_data = {
      id: id
    };
    
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
            error: data.error
          });
        } else {
          this.setState({
            status: data.result,
            poster: data.poster,
            chart_data: data.chart_data,
            title: data.title
          });
        }
      });
    
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
    return (
      <div className={'my-pretty-chart-container'}>
      
      {
        this.state.auth ? 
        <div id="logout_button">
        <a href="/logout"><button className="btn btn-danger">Logout</button></a>
        </div> :
        <div id="logout_button">
        <a href="/register"><button className="btn btn-success">Register!</button></a>
        </div>
      }
      
      {this.state.status == "success" ?
        <Chart
          chartType="PieChart"
          data={this.state.chart_data}
          options={{}}
          graph_id="PieChart"
          width="100%"
          height="500px"
          legend_toggle
        /> :
      this.state.status == "error" ?
        <h4 id="error_msg">Poll not found.</h4> :
      <h4>Loading...</h4>  }
      </div>
    );
  }
}
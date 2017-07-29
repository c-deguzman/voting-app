import React from 'react';
import $ from 'jquery';

export default class Alert extends React.Component {
  constructor (props){
    super(props);

    this.render = this.render.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

    this.state = {
      alert_visible: (this.props.result == "error" || this.props.result == "success"),
      error: this.props.error,
      success: this.props.success,
      result: this.props.result,
      show: this.props.show
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ alert_visible: (nextProps.result == "error" || nextProps.result == "success"),
                    error: nextProps.error,
                    success: nextProps.success,
                    result: nextProps.result,
                    show: nextProps.show
                  });  
  }

  hideAlert(){
    this.props.changeShow();
    this.setState({
      alert_visible: false
    })
  }


  render(){
    return (
    <div>
    { 
      this.state.alert_visible & this.state.show ?
        this.state.result == "error" ?
        <div className="alert alert-danger fade-in">
          <span className="close" data-dismiss="alert" onClick={this.hideAlert}>&times;</span>
          <strong>Error!</strong> {this.state.error}
        </div> :
        <div className="alert alert-success fade in">
          <span className="close" data-dismiss="alert" onClick={this.hideAlert}>&times;</span>
          <strong>Success!</strong> {this.state.success}
        </div> :
      null
    }
    </div>
    );
  }
}
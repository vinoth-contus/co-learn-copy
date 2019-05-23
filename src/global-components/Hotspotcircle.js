import React, { Component } from 'react';
import hotsportcircle from '../assets/images/hotsport-circle.png'

class Hotspotcircle extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    clickme = (selectedArea) => {
        this.props.clickedArea(selectedArea)
    }
  render() {
    return (
      <div className="hotspot-circle">
        <img alt="Hotspot" src={hotsportcircle} useMap="#image-map" />
        <span className="option-1">{this.props.options[0].value}</span>
        <span className="option-2">{this.props.options[1].value}</span>
        <span className="option-3">{this.props.options[2].value}</span>
        <span className="option-4">{this.props.options[3].value}</span>
       
        <map name="image-map">
            <area onClick={() => this.clickme(this.props.options[0])} target="" alt={this.props.options[0].value} title={this.props.options[0].value} href="#" coords="167,49,35" shape="circle"/>
            <area onClick={() => this.clickme(this.props.options[1])} target="" alt={this.props.options[1].value} title={this.props.options[1].value} href="#" coords="281,166,34" shape="circle"/>
            <area onClick={() => this.clickme(this.props.options[2])} target="" alt={this.props.options[2].value} title={this.props.options[2].value} href="#" coords="167,281,32" shape="circle"/>
            <area onClick={() => this.clickme(this.props.options[3])} target="" alt={this.props.options[3].value} title={this.props.options[3].value} href="#" coords="47,166,36" shape="circle"/>
        </map>      
      </div>
    );
  }
}

export default Hotspotcircle;

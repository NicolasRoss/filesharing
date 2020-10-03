import React from 'react';
import Navbar from '../components/navbar';
import DocCardContainer from '../components/docCardContainer';


export default class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            user_id: -1
        }
    }

    componentDidMount(){
        // this.data.props.map((item) => console.log(item));
        if(this.props.location.state !== undefined && this.props.location.state.user_id !== undefined){
            console.log("yolo:" + this.props.location.state.user_id)
            this.setState({ user_id: this.props.user_id})
        }
    }

    render(){
        
        if(this.state.user_id !== -1){
            return(
                <div>
                    <Navbar/>
                    <DocCardContainer user_id={this.state.user_id}/>
                </div>

            )
        }else{
            return(
                <div>need to be logged in. (passing user_id to this component)</div>
            )
        }
    }
}
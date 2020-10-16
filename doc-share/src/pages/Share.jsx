import React from 'react';
import WelcomeCard from '../components/welcomeCard';
import Navbar from '../components/navbar';
import { withRouter } from 'react-router-dom'
import { API } from '../components/api';
import queryString from 'query-string';
 
class Share extends React.Component{ 

    constructor(props){
        super(props);
        this.buttonClick = this.buttonClick.bind(this);
        this.state = {
            link_id: '',
            name: 'download'
        }
    }
    buttonClick(){
        //do stuff here
        console.log(this.state)
        if(this.state.link_id !== undefined && this.state.link_id !== ''){
            let url = API + "/link?link_id=" + this.state.link_id;
            fetch(url, {
                method: 'GET',
                mode: 'cors'
            })

            .then(res =>{
                console.log(res.status);
                console.log(res.text)
                console.log(this.state.name);
                if(res.status === 200){
                    res.blob().then(blob =>{
                        console.log(blob.name)
                        const url = window.URL.createObjectURL(new Blob([blob]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', this.state.name);
            
                        document.body.appendChild(link);
                        link.click();
            
                        link.parentNode.removeChild(link);
                        // this.setState({ action: '' })
                    })     
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        
    }


    componentDidMount(){
        let params = queryString.parse(this.props.location.search);
        if(params.link_id !== undefined){
            this.setState({link_id: params.link_id})
        }
    }
    render(){
        if(this.state.link_id !== undefined){
            return( <button onClick={this.buttonClick}>click me for file</button> ) 
        }else{
            return(
                <div>
                    link is dead.
                </div>
            );
        }
    }
}

export default withRouter(Share);
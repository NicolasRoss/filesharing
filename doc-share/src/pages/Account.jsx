import React from 'react';
import WelcomeCard from '../components/welcomeCard';
import Navbar from '../components/navbar';
import { withRouter } from 'react-router-dom'
import { API } from '../components/api';
import Cookies from "js-cookie";
import "../css/account.css";
import { Container, Row, Col} from 'react-bootstrap';
 
class Share extends React.Component{ 

    constructor(props){
        super(props);
        this.logoutButton = this.logoutButton.bind(this);
        this.state = {
            user_id: '',
            name: ''
        }
    }

    componentDidMount(){
        if(Cookies.get("user_id") !== undefined && Cookies.get("name") !== undefined){
            this.setState({user_id: Cookies.get("user_id")})
            this.setState({name: Cookies.get("name")})
        }

    }

    logoutButton(){
        Cookies.remove("user_id");
        Cookies.remove("name");
        this.props.history.push({
            pathname: '/'
            
        });
    }


    render(){
        return(
            <div>
                <Navbar/>
                <Container className="accountContainer">
                <Row>
                    <Col xs={12}>

                        <div className="accountHeader">
                            Account
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <div>
                            <div className="accountSubHeader">
                                Name
                            </div>
                            
                        </div>
                    </Col>
                    <Col xs={6}>
                        <button className="accountButton floatRight">Change</button>
                    </Col>
                    
                </Row>
                <Row>
                    <Col xs={6}>
                        <div>
                            <div className="accountSubHeader">
                                Password
                            </div>
                            
                        </div>
                    </Col>
                    <Col xs={6}>
                        <button className="accountButton floatRight">Change</button>
                    </Col>
                    
                </Row>
                
                <Row xs={12}>
                    <button className="accountButton logoutButton" onClick={this.logoutButton}>
                        Log out
                    </button>
                </Row>
            </Container>
        </div>
        )


    }

}


export default withRouter(Share);
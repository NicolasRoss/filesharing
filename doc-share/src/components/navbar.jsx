import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Cookies from "js-cookie";
import '../css/navbar.css';
import { withRouter } from 'react-router-dom';

//this should be a func
class Navbar extends React.Component{

    constructor(props){
        super();
        this.toHome = this.toHome.bind(this);
        this.toLogin = this.toLogin.bind(this);
        this.toSignUp = this.toSignUp.bind(this);

        
        this.state= {
            user_id: -1
        }
    }


    componentDidMount(){
        console.log("rendering nav")
        if(Cookies.get("user_id") !== undefined){
            this.setState({user_id: Cookies.get("user_id")})
        }
    }
    toHome(){
        console.log("toHome");
        Cookies.remove("user_id");
        if(this.props.rerenderHome !== undefined){
            this.props.rerenderHome();
        }else{
            Cookies.remove("user_id");
            this.props.history.push("/");
        }
        
    }

    toLogin(e){
        console.log("toLogin")
        console.log(e);
        if(this.props !== undefined && this.props.rerenderHome !== undefined){
            this.props.rerenderHome();
        }else{
            Cookies.remove("user_id");
            this.props.history.push("/Login");
        }
    }

    toSignUp(){
        if(this.props !== undefined && this.props.rerenderHome !== undefined){
            this.props.rerenderHome();
        }else{
            Cookies.remove("user_id");
            this.props.history.push({
                pathname: '/Login',
                state: {containerToggle: false}
            });
        }
    }

    render(){

        const notLoggedIn = (
            <Container fluid>
                <Row>
                    <Col xs = {12}>
                        <ul>
                            <a onClick={this.toHome}><li className="nav-item logo">Doc</li></a>
                            <a onClick={this.toSignUp}><li className="nav-item right">Sign up</li></a>
                            <a onClick={this.toLogin}><li className="nav-item right">Log in</li></a>
                            
                        </ul>
                    </Col>
                </Row>
            </Container>
        );

        const loggedIn = (
            <Container fluid>
            <Row>
                <Col xs = {12}>
                    <ul>
                        <a onClick={this.toHome}><li className="nav-item logo">Doc</li></a>
                        <a href="#"><li className="nav-item right"><img className="img" src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png"></img></li></a>
                        <a href="#"><li className="nav-item right">Hello, {this.state.user_id}</li></a>
                        
                    </ul>
                </Col>
            </Row>
        </Container>
        );

        if(this.state.user_id !== -1){
            return(loggedIn);
        }else{
            return(notLoggedIn);
        }

        
    }
}

export default withRouter(Navbar);
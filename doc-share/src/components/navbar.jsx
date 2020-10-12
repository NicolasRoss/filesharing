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
            user_id: -1,
            name: ""
        }
    }


    componentDidMount(){
        if(Cookies.get("user_id") !== undefined){
            this.setState({user_id: Cookies.get("user_id")})
        }
        if(Cookies.get("name") !== undefined){
            this.setState({name: Cookies.get("name")})
        }
    }

    toHome(){
        Cookies.remove("user_id");
        if(this.props.rerenderHome !== undefined){
            this.setState({user_id: -1})
            this.props.rerenderHome();
        }else{
            Cookies.remove("user_id");
            this.props.history.push("/");
        }
        
    }

    toLogin(){
        if(this.props !== undefined && this.props.rerenderHome !== undefined){
            this.setState({user_id: '-1'})
            this.props.rerenderHome();
        }else{
            Cookies.remove("user_id");
            this.props.history.push({
                pathname: '/Login',
                state: {containerToggle: true}
            });
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
        // console.log("name:" + this.state.name)
        const notLoggedIn = (
            <Container fluid>
                <Row>
                    <Col xs = {12}>
                        <ul>
                            <a href="/" onClick={this.toHome}><li className="nav-item logo">Doc</li></a>
                            <a href="/Login" onClick={this.toSignUp}><li className="nav-item right">Sign up</li></a>
                            <a href="/Login" onClick={this.toLogin}><li className="nav-item right">Log in</li></a>
                            
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
                        <a href="/" onClick={this.toHome}><li className="nav-item logo">Doc</li></a>
                        <a href="/"><li className="nav-item right"><i className="fas fa-user"></i></li></a>
                        <a href="/"><li className="nav-item right">Hello, {this.state.name}</li></a>
                        
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
import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/welcomeCard.css';
import Cookies from "js-cookie";
import { withRouter } from 'react-router-dom';

class welcomeCard extends React.Component{
    constructor(props){
        super(props);
        this.toggleContainer = this.toggleContainer.bind(this);
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
            containerToggle: true
        };
    }

    emailChangeHandler = (event) => {
        this.setState({username: event.target.value})
    }
    passwordChangeHandler = (event) => {
        this.setState({password: event.target.value})
    }

    toggleContainer(){
        console.log("toggle pressed")
        this.setState({containerToggle: !this.state.containerToggle});
        console.log(this.state.containerToggle)
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log("submit button pressed")
        console.log(this.state.username)
        console.log(this.state.password)
        var url = "http://localhost:5000/users?email=user@gmail.com&pass=testing123"
        fetch(url, {
            method: 'GET',
            mode:'cors',
            
        })
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                if(result !== undefined && result["user_id"] !== undefined){
                    console.log("check success");
                    //go to welcome page here
                    console.log("result is:"+result["user_id"] )
                    if(result["user_id"] !== "-1"){
                        console.log("somehow passed the check")
                        Cookies.set("user_id", result["user_id"], {expires: 7})
                        this.props.history.push({
                            pathname: '/'
                            // state: {user_id: result["user_id"]}
                        });
                    }
                }
                
            }
        )

    }

    componentDidMount(){
        console.log("welcome did mount")
        
        if(this.props.location !== undefined && this.props.location.state !== undefined && this.props.location.state.containerToggle !== undefined){
            // console.log("props:"+ this.props.location.state.containerToggle)
            this.setState({containerToggle: this.props.location.state.containerToggle})
            this.props.location.state.containerToggle = undefined;
            // console.log("props:" + this.props.location.state.containerToggle);
        }
    }


    render(){
        
        const LoginPage = (
            <Container>
                <Row>
                    <Col className="signInContainer" xs={{span: 12, offset:0}}>
                        <div>
                            <div className="signInHeader">Login</div>
                            
                            <form autoComplete="off" onSubmit={this.handleSubmit}>
                                
                                <label className="signInSubHeader">
                                    <div className="tab">Email</div>
                                    <input className="input-form" type="text" name="email" onChange={this.emailChangeHandler}/>
                                </label>
                                <label className="signInSubHeader">
                                    <div className="tab">Password</div>
                                    <input className="input-form" type="password" name="password" onChange={this.passwordChangeHandler}/>
                                </label>
                                <button type="submit" className="submit-form">Submit</button>
                            </form>
                            
                            <div className="signUpLinkContainer"><a  style={{"pointerEvents": "all", "cursor": "pointer"}} className="signUpLink" onClick={this.toggleContainer}>Don't have an account? Sign up</a></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        )

        const SignUpPage = (
            <Container>
                <Row>
                    <Col className="signInContainer" xs={{span: 12, offset:0}}>
                        <div>
                            <div className="signInHeader">Sign Up</div>
                            <form autoComplete="off" onSubmit={this.handleSubmit}>
                                <label className="signInSubHeader">
                                    <div className="tab">Email</div>
                                    <input className="input-form" type="text" name="email" onChange={this.emailChangeHandler}/>
                                </label>
                                <label className="signInSubHeader">
                                    <div className="tab">Name</div>
                                    <input className="input-form" type="text" name="name" onChange={this.emailChangeHandler}/>
                                </label>
                                <label className="signInSubHeader">
                                    <div className="tab">Password</div>
                                    <input className="input-form" type="password" name="password" onChange={this.passwordChangeHandler}/>
                                </label>
                                <label className="signInSubHeader">
                                    <div className="tab">Confirm Password</div>
                                    <input className="input-form" type="password" name="password2" onChange={this.passwordChangeHandler}/>
                                </label>
                                <button type="submit" className="submit-form">Submit</button>
                            </form>
                            <div className="signUpLinkContainer"><a  style={{"pointerEvents": "all", "cursor": "pointer"}} className="signUpLink" onClick={this.toggleContainer}>Already have an account? Log in</a></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );

        if(this.state.containerToggle){
            return(LoginPage);
        }else{
            return(SignUpPage);
        }

    }


}

export default withRouter(welcomeCard);
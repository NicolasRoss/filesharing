import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/welcomeCard.css';


export default class welcomeCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    emailChangeHandler = (event) => {
        this.setState({username: event.target.value})
    }
    passwordChangeHandler = (event) => {
        this.setState({password: event.target.value})
    }

    handleSubmit = () => {
        console.log("submit button pressed")
        console.log(this.state.username)
        console.log(this.state.password)
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col className="signInContainer" xs={{span: 10, offset:1}}>
                        <div>
                            <div className="signInHeader">Login</div>
                            
                            <form autoComplete="off">
                                
                                <label className="signInSubHeader">
                                    <div className="tab">Email</div>
                                    <input className="input-form" type="text" name="email" onChange={this.emailChangeHandler}/>
                                </label>
                                <label className="signInSubHeader">
                                    <div className="tab">Password</div>
                                    <input className="input-form" type="text" name="password" onChange={this.passwordChangeHandler}/>
                                </label>
                                
                            </form>
                            <button className="submit-form" onClick={this.handleSubmit}>Submit</button>
                            <div className="signUpLinkContainer"><a className="signUpLink" href="#">Don't have an account? Sign up</a></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }


}
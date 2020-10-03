import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/welcomeCard.css';
import { withRouter } from 'react-router-dom';
class welcomeCard extends React.Component{

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    async handleSubmit() {
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
                    console.log(result["user_id"])
                    this.props.history.push({
                        pathname: '/Home',
                        state: {user_id: result["user_id"]}
                    });
                }
                
            }
        )

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
                                    <input className="input-form" type="password" name="password" onChange={this.passwordChangeHandler}/>
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

export default withRouter(welcomeCard);
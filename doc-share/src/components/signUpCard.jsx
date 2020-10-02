import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/signUpCard.css';

export default class signUpCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            input: {},
            // to be used in the future
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({
            input
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // add validation check here
        console.log(this.state)
    }

    // will complete later
    // validate() {

    // }

    // resetForm() {

    // }

    render(){
        return(
            <Container>
                <Row>
                    <Col className="signUpContainer" xs={{span: 10, offset:1}}>
                        <div>
                            <div className="signUpHeader">Sign Up</div>
                            
                            <form autoComplete="off">

                                <label className="signUpSubHeader">
                                    Email
                                    <input className="input-form" type="text" name="email" onChange={this.handleChange}/>
                                </label>
                                <label className="signUpSubHeader">
                                    Password
                                    <input className="input-form" type="text" name="password" onChange={this.handleChange}/>
                                </label>
                                <label className="signUpSubHeader">
                                    Confirm Password
                                    <input className="input-form" type="text" name="confirm_password" onChange={this.handleChange}/>
                                </label>
                                
                            </form>
                            <button className="submit-form" onClick={this.handleSubmit}>Submit</button>
                            <div className="signUpFooter"><a className="signInLink" href="#">Already have an account? Sign In</a></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }


}
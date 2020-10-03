import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/navbar.css';

//this should be a func
export default class Navbar extends React.Component{
    render(){
        return(
            <Container fluid>
                <Row>
                    <Col xs = {12}>
                        <ul>
                            <a href="#"><li className="nav-item logo">Doc</li></a>
                            <a href="#"><li className="nav-item right"><img className="img" src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png"></img></li></a>
                            <a href="#"><li className="nav-item right">Sign up</li></a>
                            <a href="#"><li className="nav-item right">Log in</li></a>
                            
                        </ul>
                    </Col>
                </Row>
            </Container>
        );
    }
}
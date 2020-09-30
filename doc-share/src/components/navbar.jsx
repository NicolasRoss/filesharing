import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import './navbar.css';

//this should be a func
export default class Navbar extends React.Component{
    render(){
        return(
            <Container fluid>
                <Row>
                    <Col xs = {12}>
                        <ul>
                            <li className="nav-item logo">Logo</li>
                            <li className="nav-item right"><img className="img" src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png"></img></li>
                            <li className="nav-item right">Sign up</li>
                            <li className="nav-item right">Log in</li>
                            
                        </ul>
                    </Col>
                </Row>
            </Container>
        );
    }
}
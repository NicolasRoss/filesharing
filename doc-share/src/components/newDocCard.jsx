import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/newDocCard.css'

export default class documentCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return(
            <Container className="newDocContainer box-shadow">
                <a href="#">
                    <Row>
                        <Col>
                            <div className="newDocPlus">+</div>
                        </Col>
                    </Row>
                </a>
            </Container>
        );
    }
 
}
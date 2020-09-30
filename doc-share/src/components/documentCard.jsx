import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import './documentCard.css';

export default class documentCard extends React.Component{



    render(){
        return(
            <Container>
                <Row className="docContainer box-shadow">
                    <Col xs={10}>
                        <div className="uuidContainer">
                            <div className="uuidContent">uuid goes here uuid goes here</div>
                        </div>
                    </Col>
                    <Col xs={8}>
                        <div>
                            <div className="docSubtitle marginLeft">ExampleDocument.txt</div>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div>
                            <div className="docSubtitle">September 21st, 2020</div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

}
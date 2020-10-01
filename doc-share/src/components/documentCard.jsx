import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/documentCard.css';

export default class documentCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            uuid: '',
            name: '',
            date: ''
        };
    }

    componentDidMount() {
        //load data here i think
    }




    render(){
        return(
            
                <Container>
                    <a href="#">
                        <Row className="docContainer box-shadow">
                            <Col xs={10}>
                                
                                <div className="uuidContainer">
                                    <div className="uuidContent">5ec48ca8-029e-11eb-b3d9-04d4c40327b5</div>
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
                    </a>
                </Container>
            
        );
    }

}
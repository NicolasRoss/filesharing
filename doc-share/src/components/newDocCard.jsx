import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/newDocCard.css'

export default class documentCard extends React.Component{

    constructor(props){
        super(props);
        this.toggleClick = this.toggleClick.bind(this);
        this.state = {
            clickToggle: false
        };
    }

    toggleClick(){
        console.log("newdoc toggled");
        this.setState({clickToggle: !this.state.clickToggle})
    }

    render(){

        if(this.state.clickToggle){
            return(
                <Container onClick={this.toggleClick} className="newDocContainer box-shadow noselect">
                    <div >
                        <Row>
                            <Col xs={5}>
                                <div>insert doc over here</div>
                            </Col>
                            <Col xs={6}>
                                <div>type in uuid over here</div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            )
        }else{
            return(
                <Container onClick={this.toggleClick} className="newDocContainer box-shadow noselect">
                        <Row>
                            <Col>
                                <div className="newDocPlus">+</div>
                            </Col>
                        </Row>
                </Container>
            );
        }
    }
 
}
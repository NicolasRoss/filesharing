import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import "../css/Intro.css";

export default class Intro extends React.Component{


    constructor(props){
        super();
        this.state = {

        }
    };

    render(){
        return(
            <Container>
                <Row>
                    <Col className="introContainer" xs={12}>
                        <div >
                            <div>
                                <div className="introTitle">
                                    Dropdocs
                                </div>
                                <div className="introStatement">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a sapien facilisis, sagittis ligula dictum, mollis elit. Sed massa odio, sodales non erat eget, consectetur luctus turpis. Fusce sit amet accumsan augue. Duis semper tortor velit, tincidunt imperdiet ligula vestibulum ut. Proin ullamcorper faucibus magna sit amet sollicitudin. In ac quam enim. Suspendisse sed tortor pellentesque, ultricies ligula eget,
                                </div>
                                <button className="introButton" onClick={this.props.toLogin}>Login</button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}
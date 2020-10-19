import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/Intro.css";

export default class Intro extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Row>
          <Col className="introContainer" xs={12}>
            <div>
              <div>
                <div className="introTitle">Doc</div>
                <div className="introStatement">
                  Doc is a user-friendly file hosting web application with
                  focuses on making work easier for people with innovative ways
                  to reduce busywork so users can focus on the work that matters
                  to them.
                </div>
                <button className="introButton" onClick={this.props.toLogin}>
                  Login
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

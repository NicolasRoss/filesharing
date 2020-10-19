import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: -1,
      date: "",
      name: "",
    };
  }

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      console.log("DATE:" + this.props.location.state.date);
      console.log("NAME:" + this.props.location.state.name);
      if (this.props.location.state.uuid !== undefined) {
        console.log("set uuid");
        this.setState({ uuid: this.props.location.state.uuid });
      }
      if (this.props.location.state.date !== undefined) {
        console.log("DATE:" + this.props.location.state.date);
        this.setState({ date: this.props.location.state.date });
      }
      if (this.props.location.state.name !== undefined) {
        console.log("NAME:" + this.props.location.state.name);
        this.setState({ name: this.props.location.state.name });
      }
    }
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div>Document</div>
            <div>{this.state.uuid}</div>
            <div>{this.state.name}</div>
            <div>{this.state.date}</div>
          </Col>
        </Row>
      </Container>
    );
  }
}

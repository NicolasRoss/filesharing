import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../components/navbar";
import Cookies from "js-cookie";
import { API } from "../components/api";

class DocViewer extends React.Component {
  constructor(props) {
    super(props);
    this.toHomePage = this.toHomePage.bind(this);
    this.state = {
      doc_info: [],
    };
  }

  componentDidMount() {
    if (this?.props?.location?.state?.doc_info) {
      this.setState({ doc_info: this.props.location.state.doc_info });
    }
  }
  toHomePage() {
    this.props.history.push({
      pathname: "/",
    });
  }

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Row>
            <Col xs={2}>
              <button onClick={this.toHomePage}>go back</button>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div style={{ color: "white" }}>
                {this.state.doc_info["document_name"]}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(DocViewer);

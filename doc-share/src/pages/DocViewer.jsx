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
      this.setState({ doc_info: this.props.location.state.doc_info }, () => {
        this.getFile();
      });
    }
  }

  toHomePage() {
    this.props.history.push({
      pathname: "/",
    });
  }

  getFile() {
    if (this.state.doc_info["document_name"] !== undefined) {
      var url =
        API +
        "/download?uuid=" +
        this.state.doc_info["uuid_id"] +
        "&name=" +
        this.state.doc_info["document_name"] +
        "&path=" +
        this.state.doc_info["directory_loc"];
      fetch(url, {
        method: "GET",
        mode: "cors",
      })
        .then((res) => {
          if (res.status === 200) {
            return res.blob();
          }
          throw new Error("File not found.");
        })
        .then((blob) => {
          this.displayFile(blob);
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }

  displayFile = (blob) => {
    if (blob.type.startsWith("text/")) {
      var reader = new FileReader();
      reader.addEventListener("loadend", function () {
        const textContainer = document.getElementById("text");

        const textarea = document.createElement("textarea");
        textarea.textContent = reader.result;

        textContainer.append(textarea);
      });
      reader.readAsText(blob);
      
    } else if (blob.type.startsWith("image/")) {
      const textContainer = document.getElementById('text');

      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);

      textContainer.append(img)
    } // pdf support
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
          <Container>
            <div id="text"></div>
          </Container>
        </Container>
      </div>
    );
  }
}

export default withRouter(DocViewer);

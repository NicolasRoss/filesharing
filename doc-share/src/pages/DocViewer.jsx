import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../components/navbar";
import "../css/docViewer.css";
import Cookies from "js-cookie";
import { API } from "../components/api";

class DocViewer extends React.Component {
  constructor(props) {
    super(props);
    this.toHomePage = this.toHomePage.bind(this);
    this.checkFileExt = this.checkFileExt.bind(this);
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

  checkFileExt() {
    if (this.state.doc_info["document_name"] !== "") {
      var patt = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      var ext = this.state.doc_info["document_name"].match(patt);
      if (
        ext[0].includes("jpg") ||
        ext[0].includes("jpeg") ||
        ext[0].includes("png")
      ) {
        return "image";
      } else if (
        ext[0].includes("py") ||
        ext[0].includes("js") ||
        ext[0].includes("css")
      ) {
        return "code";
      } else if (ext[0].includes("zip")) {
        return "zip";
      } else if (ext[0].includes("txt")) {
        return "text";
      }
    }
    return "unknown";
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
    var extension = this.checkFileExt();
    if (extension === "text") {
      var reader = new FileReader();
      reader.addEventListener("loadend", function () {
        const textContainer = document.getElementById("text");
        textContainer.className = "docViewerContainer";
        const textarea = document.createElement("textarea");
        textarea.className = "textArea";
        textarea.textContent = reader.result;
        textContainer.append(textarea);

        //add update button
        const topBar = document.getElementById("topBar");
        const updateButton = document.createElement("button");
        updateButton.className = "backButton";
        updateButton.textContent = "Submit";
        topBar.append(updateButton);
      });
      reader.readAsText(blob);
    } else if (blob.type.startsWith("image/")) {
      const textContainer = document.getElementById("text");
      textContainer.className = "docViewerContainer";

      const img = document.createElement("img");
      img.src = URL.createObjectURL(blob);
      img.className = "imageBox";
      textContainer.append(img);
    } else if (extension === "code") {
      var reader = new FileReader();
      reader.addEventListener("loadend", function () {
        const textContainer = document.getElementById("text");
        textContainer.className = "docViewerContainer";
        const textarea = document.createElement("textarea");
        textarea.className = "textArea";
        textarea.spellcheck = false;
        textarea.textContent = reader.result;
        textContainer.append(textarea);

        const topBar = document.getElementById("topBar");
        const updateButton = document.createElement("button");
        updateButton.className = "backButton";
        updateButton.textContent = "Submit";
        topBar.append(updateButton);
      });
      reader.readAsText(blob);
    } else {
      console.log(blob.type);
    }
  };

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Row>
            <Col xs={2}>
              <button className="backButton" onClick={this.toHomePage}>
                <i className="fas fa-arrow-left"></i>
              </button>
            </Col>
            <Col xs={8}>
              <div className="docNameBox">
                {this.state.doc_info["document_name"]}
              </div>
            </Col>
            <Col xs={2}>
              <div id="topBar"></div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div id="text"></div>
            </Col>
          </Row>
          {/* <Container fluid></Container> */}
        </Container>
      </div>
    );
  }
}

export default withRouter(DocViewer);

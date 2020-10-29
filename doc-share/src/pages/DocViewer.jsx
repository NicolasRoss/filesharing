import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../components/navbar";
import "../css/docViewer.css";
import { API } from "../components/api";

class DocViewer extends React.Component {
  constructor(props) {
    super(props);
    this.toHomePage = this.toHomePage.bind(this);
    this.checkFileExt = this.checkFileExt.bind(this);
    this.handleFileSave = this.handleFileSave.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);

    this.state = {
      doc_info: [],
      user_id: "",
      value: "",
      editable: false,
      spellCheck: true,
      blob: null,
    };
  }

  componentDidMount() {
    if (this?.props?.location?.state?.doc_info) {
      this.setState(
        {
          doc_info: this.props.location.state.doc_info,
          user_id: this.props.location.state.user_id,
        },
        () => {
          this.getFile();
        }
      );
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
      } else if (ext[0].includes("txt") || ext[0].includes("csv")) {
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
          // console.log(document.getElementById("save"))
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }

  displayFile = (blob) => {
    this.setState({ blob: blob });
    var extension = this.checkFileExt();
    if (extension === "text") {
      var reader = new FileReader();
      reader.addEventListener("loadend", () => {
        this.setState({ value: reader.result });
      });
      reader.readAsText(blob);
      //add update button
      this.setState({ editable: true, spellCheck: false });
    } else if (blob.type.startsWith("image/")) {
      var textarea = document.getElementById("textarea");
      textarea.parentNode.removeChild(textarea);

      const textContainer = document.getElementById("text");
      textContainer.className = "docViewerContainer";

      const img = document.createElement("img");
      img.src = URL.createObjectURL(blob);
      img.className = "imageBox";
      textContainer.append(img);
    } else if (extension === "code") {
      var reader = new FileReader();
      reader.addEventListener("loadend", () => {
        this.setState({ value: reader.result });
      });
      reader.readAsText(blob);
      //add update button
      this.setState({ editable: true, spellCheck: false });
    } else {
      console.log(blob.type);
    }
  };

  handleFileChange() {
    this.setState({
      value: document.getElementsByClassName("textArea")[0].value,
    });
  }

  handleFileSave() {
    const newContent = document.getElementsByClassName("textArea")[0]
      .textContent;
    var newBlob = new Blob([newContent], { type: this.state.blob.type });
    var newFile = new File([newBlob], this.state.doc_info["document_name"]);
    
    if (newFile !== undefined) {
      const data = new FormData();
      data.append("file", newFile);
      var url =
        API +
        "/documents?user=" +
        this.state.user_id +
        "&uuid=" +
        this.state.doc_info["uuid_id"];

      if (newBlob.size < 16 * 1024 * 1024) {
        fetch(url, {
          method: "PUT",
          mode: "cors",
          body: data,
        }).then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          throw new Error("File Failed to save");
        })
        .then((result) => {
          alert(result["request"]);
        })
        .catch((error) => {
          alert(error.message);
        });
      }
    }
  }

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
              <button
                id="save"
                className={this.state.editable ? "backButton" : "hidden"}
                onClick={this.handleFileSave}
              >
                Submit
              </button>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div id="text" className="docViewerContainer">
                <textarea
                  id="textarea"
                  className={this.state.editable ? "textArea" : "hidden"}
                  spellCheck={this.state.code}
                  value={this.state.value}
                  onChange={this.handleFileChange}
                ></textarea>
              </div>
            </Col>
          </Row>
          {/* <Container fluid></Container> */}
        </Container>
      </div>
    );
  }
}

export default withRouter(DocViewer);

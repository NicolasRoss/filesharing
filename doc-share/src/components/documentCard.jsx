import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/documentCard.css";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { API, HOST } from "./api";

class documentCard extends React.Component {
  constructor(props) {
    super(props);
    this.goDocPage = this.goDocPage.bind(this);
    this.downloadClick = this.downloadClick.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
    this.shareClick = this.shareClick.bind(this);
    this.noContainerClick = this.noContainerClick.bind(this);
    this.formatDate = this.formatDate.bind(this);

    this.state = {
      uuid: this.props.doc_id,
      name: this.props.name,
      date: this.props.date,
      path: this.props.path,
      user_id: null,
      status: this.props.status, // for public or private
      clickToggle: false,
    };
  }

  componentDidMount() {
    if (Cookies.get("user_id") !== undefined) {
      this.setState({ user_id: Cookies.get("user_id") });
    }
  }

  goDocPage() {
    if (this.state.uuid === this.props.active) {
      this.props.setActiveId(-1);
      this.setState({ clickToggle: false });
    } else if (this.state.uuid !== this.props.active) {
      this.props.setActiveId(this.state.uuid);
      this.setState({ clickToggle: true });
    }
  }

  noContainerClick = (e) => {
    e.stopPropagation();
  };

  downloadClick = (e) => {
    e.stopPropagation();
    console.log("download, path: " + this.state.path);

    if (this.state.uuid !== undefined) {
      console.log("clicked the download button for doc_id: " + this.state.uuid);
      var url =
        API +
        "/download?uuid=" +
        this.state.uuid +
        "&name=" +
        this.state.name +
        "&path=" +
        this.state.path;
      fetch(url, {
        method: "GET",
        mode: "cors",
      })
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.state.name);

          document.body.appendChild(link);
          link.click();

          link.parentNode.removeChild(link);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  deleteClick = (e) => {
    e.stopPropagation();
    console.log("clicked the delete button for doc_id: " + this.state.uuid);
    console.log("delete, path: " + this.state.path);
    this.props.deleteCard(this.state.uuid);

    if (this.state.uuid !== null && this.state.user_id !== null) {
      var url =
        API + "/documents?user=" + this.state.user_id + "&action=delete";
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          uuid: this.state.uuid,
          name: this.state.name,
          date: this.state.date,
          path: this.state.path,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  shareClick = function (e) {
    e.stopPropagation();
    console.log("clicked shar for doc_id: " + this.state.uuid);
    console.log("share, path: " + this.state.path);

    if (this.state.uuid !== null && this.state.user_id !== null) {
      var url = API + "/link?user=" + this.state.user_id;
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          uuid: this.state.uuid,
          name: this.state.name,
          path: this.state.path,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((link) => {
          if (link !== null) {
            const url = HOST + link; //change this to some const WEBSITE that is either localhost or cloud domain
            const textArea = document.createElement("textarea");
            textArea.innerText = url;

            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");

            textArea.parentNode.removeChild(textArea);
            alert("Link copied to clipboard");
          } else {
            alert("Failed to Generate Link");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  editClicked = () => {
    this.props.editClicked(this.state.uuid);
  };

  formatDate() {
    if (this.state.date !== undefined && this.state.date !== "") {
      var t = this.state.date.split(/[- :]/);
      var timeOfDay = "AM";
      var hour = parseInt(t[4]);
      if (parseInt(t[4]) >= 12) {
        timeOfDay = "PM";
      }
      if (parseInt(t[4]) > 12) {
        hour = parseInt(t[4]) - 12;
      }

      var d =
        "" +
        t[0] +
        " " +
        t[2] +
        " " +
        t[1] +
        " " +
        t[3] +
        " " +
        hour +
        ":" +
        t[5] +
        " " +
        timeOfDay +
        " " +
        "EST";
      return d;
    }
    return "";
  }

  render() {
    var dropDown;

    if (this.state.uuid === this.props.active) {
      dropDown = (
        <Row className="backgroundContainer">
          <Col xs={8}>
            <i
              className="icon black fas fa-save"
              onClick={this.downloadClick}
            ></i>
            <i
              className="icon black fas fa-share-alt"
              onClick={this.shareClick}
            ></i>
            <i
              className="icon black fas fa-trash-alt"
              onClick={this.deleteClick}
            ></i>
          </Col>
          <Col xs={4}>
            <div>
              <button className="editButton" onClick={this.editClicked}>
                Edit
              </button>
            </div>
          </Col>
        </Row>
      );
    } else {
      dropDown = <div></div>;
    }

    return (
      <div>
        <Container className="docContainer box-shadow">
          <div
            onClick={this.goDocPage}
            style={{ pointerEvents: "all", cursor: "pointer" }}
          >
            <div className="foregroundContainer box-shadow">
              <Row>
                <Col sm={12} lg={10}>
                  <div className="uuidContainer">
                    <div className="uuidContent">{this.state.name}</div>
                  </div>
                </Col>
                <Col sm={12} lg={1}>
                  <div className="popContainer noselect">
                    <i className="lock fas fa-lock-open"></i>
                    {/* <div  className="publicOrPrivate">Public</div> */}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <div>
                    <div className="docSubtitle marginLeft noselect">
                      {this.formatDate()}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {this.state.clickToggle && dropDown}
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(documentCard);

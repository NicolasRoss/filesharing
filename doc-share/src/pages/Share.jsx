import React from "react";
import Navbar from "../components/navbar";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { API } from "../components/api";
import queryString from "query-string";
import "../css/share.css";

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
    this.calculateTimeToExpiry = this.calculateTimeToExpiry.bind(this);

    this.state = {
      link_id: "",
      fileName: "",
      expireDate: "",
      currentDate: "",
      name: "",
      doc_id: "",
      directory: "",
      fetching: true,
    };
  }

  buttonClick() {
    if (this.state.link_id !== undefined && this.state.link_id !== "") {
      let url =
        API +
        "/download?uuid=" +
        this.state.doc_id +
        "&name=" +
        this.state.fileName +
        "&path=" +
        this.state.directory;
      fetch(url, {
        method: "GET",
        mode: "cors",
      })
        .then((res) => {
          if (res.status === 200) {
            res.blob().then((blob) => {
              const url = window.URL.createObjectURL(new Blob([blob]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", this.state.fileName);

              document.body.appendChild(link);
              link.click();

              link.parentNode.removeChild(link);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  validateLink() {}

  calculateTimeToExpiry() {
    if (this.state.currentDate !== "" && this.state.expireDate !== "") {
      let current = new Date(this.state.currentDate);
      let expiry = new Date(this.state.expireDate);
      var diff = (expiry.getTime() - current.getTime()) / 1000;
      diff /= 60 * 60;
      let hoursRemaining = Math.abs(Math.round(diff));
      if (hoursRemaining > 0) {
        return hoursRemaining + "h";
      } else {
        return Math.abs(Math.round(diff * 60)) + "m";
      }
    }
  }

  componentDidMount() {
    let params = queryString.parse(this.props.location.search);
    if (params.link_id !== undefined) {
      this.setState({ link_id: params.link_id });
      let url = API + "/link?link_id=" + params.link_id;
      fetch(url, {
        method: "GET",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((result) => {
          this.setState({ fileName: result["file_name"] });
          this.setState({ expireDate: result["expire_date"] });
          this.setState({ currentDate: result["current_date"] });
          this.setState({ doc_id: result["doc_id"] });
          this.setState({ directory: result["directory"] });
          this.setState({ fetching: false });
        })
        .then(this.validateLink());
    }
  }

  render() {
    if (this.state.fetching === false) {
      if (this.state.link_id !== "") {
        if (this.state.validLink) {
        }

        return (
          <div>
            {/* <Navbar /> */}
            <Container className="docContainer box-shadow">
              <Row>
                <Col xs={6} className="uuidContainer">
                  <div className="uuidContent">{this.state.fileName}</div>
                </Col>
                <Col xs={4}>
                  <div className="expiry">
                    <div>Expires in: {this.calculateTimeToExpiry()}</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <button className="submit-form" onClick={this.buttonClick}>
                    download
                  </button>
                </Col>
              </Row>
            </Container>
          </div>
        );
      } else {
        return (
          <div>
            <Navbar />
            <div>The link has expired</div>
          </div>
        );
      }
    } else {
      return <div></div>;
    }
  }
}

export default withRouter(Share);

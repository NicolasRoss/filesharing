import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import "../css/documentCard.css";
import "../css/modalContent.css";
import Cookies from "js-cookie";
import { API, HOST } from "./api";

class modalContent extends React.Component {
  constructor(props) {
    super(props);
    this.getDocInfo = this.getDocInfo.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.state = {
      user_id: this.props.user_id,
      uuid: this.props.uuid,
      document_name: "",
      date: "",
    };
  }

  getDocInfo = async () => {
    const url =
      API + `/documents?user=${this.state.user_id}&uuid=${this.state.uuid}`;
    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result !== null) {
          this.setState({ document_name: result[0]["document_name"] });
          this.setState({ date: result[0]["date"] });
        }
      })
      .catch((res) => {
        alert(res);
      });
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
        ", " +
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

  async componentDidMount() {
    await this.getDocInfo();
  }

  render() {
    return (
      <Row>
        <Col xs={8}>
          <div className="modalContainer">
            <div className="modalDisplayField">
              Image or File Text goes here.
            </div>
          </div>
        </Col>
        <Col xs={4}>
          {this.state.document_name !== "" && (
            <div className="modalTitle">{this.state.document_name}</div>
          )}
          {this.state.date !== "" && (
            <div className="modalDate">{this.formatDate()}</div>
          )}
        </Col>
        <Col xs={{ span: 6, offset: 6 }}></Col>
      </Row>
    );
  }
}

export default modalContent;

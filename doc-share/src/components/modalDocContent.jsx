import React from "react";
import { Row, Col } from "react-bootstrap";
import "../css/modalContent.css";

class modalContent extends React.Component {
  constructor(props) {
    super(props);
    this.formatDate = this.formatDate.bind(this);
    this.state = {
      doc_info: this.props.doc_info
    };
  }

  formatDate() {
    if (this.state.doc_info["date"] !== undefined && this.state.doc_info["date"] !== "") {
      var t = this.state.doc_info["date"].split(/[- :]/);
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
            <div className="modalTitle">{this.state.doc_info["document_name"]}</div>
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

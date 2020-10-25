import React from "react";
import { Row, Col } from "react-bootstrap";
import "../css/modalContent.css";

class modalContent extends React.Component {
  constructor(props) {
    super(props);
    this.formatDate = this.formatDate.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      doc_info: this.props.doc_info,
      deleteField: "",
      nameWrong: false,
    };
  }

  changeHandler = (evt) => {
    const value = evt.target.value;
    this.setState({ [evt.target.name]: value });
  };

  formatDate() {
    if (
      this.state.doc_info["date"] !== undefined &&
      this.state.doc_info["date"] !== ""
    ) {
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

  handleDelete() {
    console.log("handle delete");
    if (this.state.deleteField === this.state.doc_info["document_name"]) {
      this.setState({ nameWrong: false });
      console.log("deleting card..");
      this.props.deleteCard(this.state.doc_info["uuid_id"]);

      this.props.handleClose();
    } else {
      this.setState({ nameWrong: true });
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            {" "}
            {this.state.document_name !== "" && (
              <div className="modalTitle">
                {this.state.doc_info["document_name"]}
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <div className="modalContainer">
              <div className="modalDisplayField">Collaborators</div>
            </div>
          </Col>
          <Col xs={6}>
            {this.state.date !== "" && (
              <div className="modalDate">{this.formatDate()}</div>
            )}
            <div>
              <div className="modalDate">
                To confirm, type in file name:{" "}
                {this.state.doc_info["document_name"]}
              </div>
              {this.state.nameWrong && (
                <div className="modalDate">name does not match.</div>
              )}

              <input
                type="text"
                name="deleteField"
                onChange={this.changeHandler}
              ></input>
              <button onClick={this.handleDelete}>Delete</button>
            </div>
          </Col>
          <Col xs={{ span: 6, offset: 6 }}></Col>
        </Row>
      </div>
    );
  }
}

export default modalContent;

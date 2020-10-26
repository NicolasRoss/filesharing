import React from "react";
import { Row, Col } from "react-bootstrap";
import "../css/modalContent.css";

class modalContent extends React.Component {
  constructor(props) {
    super(props);
    this.formatDate = this.formatDate.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.checkCorrectName = this.checkCorrectName.bind(this);

    this.state = {
      doc_info: this.props.doc_info,
      deleteField: "",
      nameWrong: false,
      buttonIsDisabled: true,
    };
  }

  changeHandler = async (evt) => {
    const value = evt.target.value;
    await this.setState({ [evt.target.name]: value });
    await this.checkCorrectName();
  };

  checkCorrectName = async () => {
    if (this.state.deleteField === this.state.doc_info["document_name"]) {
      this.setState({ buttonIsDisabled: false });
    } else {
      this.setState({ buttonIsDisabled: true });
    }
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
              <div className="modalDate">Collaborators</div>
              <div className="modalDisplayField">lorem ipsum dolor</div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="modalContainer">
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
                <div className="modalDeleteForm">
                  <input
                    type="text"
                    name="deleteField"
                    className="modalTextField"
                    onChange={this.changeHandler}
                  ></input>
                  <button
                    className={
                      this.state.buttonIsDisabled
                        ? "disabledButton"
                        : "activeButton"
                    }
                    disabled={
                      this.state.deleteField !==
                      this.state.doc_info["document_name"]
                    }
                    onClick={this.handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 6, offset: 6 }}></Col>
        </Row>
      </div>
    );
  }
}

export default modalContent;

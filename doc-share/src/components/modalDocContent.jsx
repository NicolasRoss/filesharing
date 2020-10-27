import React from "react";
import { Row, Col } from "react-bootstrap";
import "../css/modalContent.css";
import { API, HOST } from "./api";

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

  deleteClick = (e) => {
    console.log("clicked the delete button for doc_id: " + this.state.uuid);
    console.log("delete, path: " + this.state.path);
    this.props.deleteCard(this.state.doc_info["uuid_id"]);

    if (this.state.deleteField === this.state.doc_info["document_name"]) {
      var url = API + "/documents?user=" + this.props.user_id;
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          uuid: this.state.doc_info["uuid_id"],
          name: this.state.doc_info["document_name"],
          date: this.state.doc_info["date"],
          path: this.state.doc_info["directory_loc"],
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("deleted");
          this.props.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({ nameWrong: true });
    }
  };

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
                    onClick={this.deleteClick}
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

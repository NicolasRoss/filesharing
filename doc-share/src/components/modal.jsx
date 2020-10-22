import React from "react";
import { Row, Col } from "react-bootstrap";
import "../css/modal.css";
const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="closeContainer">
          <button onClick={handleClose} className="closeButton">
            <div className="closeBox">
              <i class="fas fa-times-circle"></i>
              {/* <div className="closeText">x</div> */}
            </div>
          </button>
        </div>
        {children}
      </section>
    </div>
  );
};

export default Modal;

//modal should be use like so:

/* <Modal
              show={this.state.showErrorModal}
              handleClose={this.hideModal}
            >
              {!this.state.emailWrong && (
                <div className="tab">Username was wrong</div>
              )}
              {!this.state.passWrong && (
                <div className="tab">Password was wrong</div>
              )}
            </Modal> */

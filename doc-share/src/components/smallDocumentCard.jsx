import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/documentCard.css";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { API, HOST } from "./api";

class smallDocumentCard extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }
}

export default withRouter(smallDocumentCard);

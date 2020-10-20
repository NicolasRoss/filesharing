import React from "react";
import Navbar from "../components/navbar";
import { withRouter } from "react-router-dom";
import { API } from "../components/api";
import Cookies from "js-cookie";
import "../css/account.css";
import { Container, Row, Col } from "react-bootstrap";

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.logoutButton = this.logoutButton.bind(this);
    this.passwordToggle = this.passwordToggle.bind(this);
    this.passwordSubmit = this.passwordSubmit.bind(this);
    this.state = {
      user_id: "",
      name: "",
      passToggle: false,
      password: "",
      password2: "",
    };
  }

  componentDidMount() {
    if (
      Cookies.get("user_id") !== undefined &&
      Cookies.get("name") !== undefined
    ) {
      this.setState({ user_id: Cookies.get("user_id") });
      this.setState({ name: Cookies.get("name") });
    }
  }

  changeHandler = (evt) => {
    const value = evt.target.value;
    // console.log("name: " + evt.target.name)
    // console.log("value:" + value)
    this.setState({ [evt.target.name]: value });
  };

  passwordToggle() {
    this.setState({ passToggle: !this.state.passToggle });
  }

  passwordSubmit = (e) => {
    // e.preventDefault();
    console.log(this.state.password);
    console.log(this.state.password2);
    if (
      this.state.password === this.state.password2 &&
      this.state.password !== ""
    ) {
      let url =
        API +
        "/users?newPass=" +
        this.state.password +
        "&user_id=" +
        Cookies.get("user_id");
      console.log(url);
      fetch(url, {
        method: "PUT",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  logoutButton() {
    Cookies.remove("user_id");
    Cookies.remove("name");
    this.props.history.push({
      pathname: "/",
    });
  }

  render() {
    if (Cookies.get("user_id") === undefined) {
      this.props.history.push({
        pathname: "/",
        // state: {user_id: result["user_id"]}
      });
    }

    let passDropDown = (
      <Row>
        <Col>
          <form autoComplete="off" name="signup" onSubmit={this.passwordSubmit}>
            <label className="signInSubHeader">
              <div className="tab">Password</div>
              <input
                className="input-form"
                type="password"
                name="password"
                onChange={this.changeHandler}
              />
            </label>
            <label className="signInSubHeader">
              <div className="tab">Confirm Password</div>
              <input
                className="input-form"
                type="password"
                name="password2"
                onChange={this.changeHandler}
              />
            </label>
            <button type="submit" className="submit-form">
              Submit
            </button>
          </form>
        </Col>
      </Row>
    );

    return (
      <div>
        <Navbar />
        <Container className="accountContainer">
          <Row>
            <Col xs={12}>
              <div className="accountHeader">Account</div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <div>
                <div className="accountSubHeader">Password</div>
              </div>
            </Col>
            <Col xs={6}>
              <button
                className="accountButton floatRight"
                onClick={this.passwordToggle}
              >
                Change
              </button>
            </Col>
          </Row>

          {this.state.passToggle && passDropDown}

          <Row xs={12}>
            <Col>
              <button
                className="accountButton logoutButton"
                onClick={this.logoutButton}
              >
                Log out
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Share);

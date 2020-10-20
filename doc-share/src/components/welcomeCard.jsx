import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/welcomeCard.css";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import { API } from "./api";
class welcomeCard extends React.Component {
  constructor(props) {
    super(props);
    this.toggleContainer = this.toggleContainer.bind(this);
    this.checkPasswords = this.checkPasswords.bind(this);
    this.checkEmail = this.checkEmail.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: "",
      name: "",
      password: "",
      password2: "",
      containerToggle: true,
    };
  }

  changeHandler = (evt) => {
    const value = evt.target.value;
    this.setState({ [evt.target.name]: value });
  };
  passwordChangeHandler = (event) => {
    this.setState({ password: event.target.value });
  };

  toggleContainer() {
    this.setState({ containerToggle: !this.state.containerToggle });
  }

  checkEmail() {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailCheck = re.test(this.state.email);
    console.log("emailCheck:" + emailCheck);
    if (emailCheck === false) {
      alert("please check if your email is correct");
    }
    return emailCheck;
  }

  checkPasswords() {
    if (this.state.password !== this.state.password2) {
      alert("passwords aren't the same");
      return false;
    }
    const posPass = this.state.password;
    var passCheck = false;
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (passw.test(posPass)) {
      passCheck = true;
    }
    if (passCheck === false) {
      alert(
        "password must contain uppercase, lowercase, numbers and be longer than 8 characters"
      );
    }
    return passCheck;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const submitRequest = event.target.getAttribute("name");
    var url;
    if (submitRequest === "login") {
      if (this.state.email !== "" && this.state.password !== "") {
        url =
          API +
          "/users?email=" +
          this.state.email +
          "&pass=" +
          this.state.password;
        fetch(url, {
          method: "GET",
          mode: "cors",
        })
          .then((res) => res.json())
          .then((result) => {
            if (result !== undefined) {
              if (result["user_id"] !== undefined) {
                if (result["user_id"] !== "-1") {
                  Cookies.remove("user_id");
                  Cookies.set("user_id", result["user_id"], { expires: 7 });
                  if (result["name"] !== undefined) {
                    Cookies.set("name", result["name"], { expires: 7 });
                  }
                  this.props.history.push({
                    pathname: "/",
                  });
                }
              }
            }
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        alert("Please check your email and password");
      }
    } else if (submitRequest === "signup") {
      if (
        this.checkEmail() === true &&
        this.checkPasswords() === true &&
        this.state.name !== ""
      ) {
        url =
          API +
          "/users?email=" +
          this.state.email +
          "&pass=" +
          this.state.password +
          "&name=" +
          this.state.name;
        fetch(url, {
          method: "POST",
          mode: "cors",
        })
          .then((res) => res.json())
          .then((result) => {
            if (result !== undefined) {
              if (result["user_id"] !== undefined) {
                if (result["user_id"] !== "-1") {
                  Cookies.remove("user_id");
                  Cookies.set("user_id", result["user_id"], { expires: 7 });
                  if (result["name"] !== undefined) {
                    Cookies.set("name", result["name"], { expires: 7 });
                  }
                  this.props.history.push({
                    pathname: "/",
                    // state: {user_id: result["user_id"]}
                  });
                }
              }
            }
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    }
  };

  componentDidMount() {
    if (
      this.props.location !== undefined &&
      this.props.location.state !== undefined &&
      this.props.location.state.containerToggle !== undefined
    ) {
      this.setState({
        containerToggle: this.props.location.state.containerToggle,
      });
      this.props.location.state.containerToggle = undefined;
    }
  }

  render() {
    const LoginPage = (
      <Container>
        <Row>
          <Col className="signInContainer" xs={{ span: 12, offset: 0 }}>
            <div>
              <div className="signInHeader">Login</div>

              <form
                autoComplete="off"
                name="login"
                onSubmit={this.handleSubmit}
              >
                <label className="signInSubHeader">
                  <div className="tab">Email</div>
                  <input
                    className="input-form"
                    type="text"
                    name="email"
                    onChange={this.changeHandler}
                  />
                </label>
                <label className="signInSubHeader">
                  <div className="tab">Password</div>
                  <input
                    className="input-form"
                    type="password"
                    name="password"
                    onChange={this.changeHandler}
                  />
                </label>
                <button type="submit" className="submit-form">
                  Submit
                </button>
              </form>

              <div className="signUpLinkContainer">
                <a
                  style={{ pointerEvents: "all", cursor: "pointer" }}
                  className="signUpLink"
                  onClick={this.toggleContainer}
                >
                  Don't have an account? Sign up
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );

    const SignUpPage = (
      <Container>
        <Row>
          <Col className="signInContainer" xs={{ span: 12, offset: 0 }}>
            <div>
              <div className="signInHeader">Sign Up</div>
              <form
                autoComplete="off"
                name="signup"
                onSubmit={this.handleSubmit}
              >
                <label className="signInSubHeader">
                  <div className="tab">Email</div>
                  <input
                    className="input-form"
                    type="text"
                    name="email"
                    onChange={this.changeHandler}
                  />
                </label>
                <label className="signInSubHeader">
                  <div className="tab">Name</div>
                  <input
                    className="input-form"
                    type="text"
                    name="name"
                    onChange={this.changeHandler}
                  />
                </label>
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
              <div className="signUpLinkContainer">
                <a
                  style={{ pointerEvents: "all", cursor: "pointer" }}
                  className="signUpLink"
                  onClick={this.toggleContainer}
                >
                  Already have an account? Log in
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );

    if (this.state.containerToggle) {
      return LoginPage;
    } else {
      return SignUpPage;
    }
  }
}

export default withRouter(welcomeCard);

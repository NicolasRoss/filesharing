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
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: "",
      name: "",
      password: "",
      password2: "",
      containerToggle: true,
      showErrorModal: false,
      emailWrong: false,
      passWrong: false,
      pass2Wrong: false,
      loginFailed: false,
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
    if (emailCheck === false) {
      this.setState({ emailWrong: true });
      // this.showModal();
    } else {
      this.setState({ emailWrong: false });
    }

    return emailCheck;
  }

  checkPasswords(isLogin) {
    if (isLogin === true) {
      if (this.state.password === "") {
        // this.showModal();
        this.setState({ passWrong: true });
        return false;
      }
    } else {
      if (this.state.password !== this.state.password2) {
        // this.showModal();
        this.setState({ passWrong: true });
        return false;
      }
    }

    const posPass = this.state.password;
    var passCheck = false;
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (passw.test(posPass)) {
      passCheck = true;
      this.setState({ passWrong: false });
    }
    if (passCheck === false) {
      this.setState({ passWrong: true });
      // this.showModal();
    }
    return passCheck;
  }

  showModal = () => {
    this.setState({ showErrorModal: true });
  };

  hideModal = () => {
    this.setState({ showErrorModal: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const submitRequest = event.target.getAttribute("name");
    var url;
    if (submitRequest === "login") {
      const emailCheck = this.checkEmail();
      const passCheck = this.checkPasswords(true);
      if (
        this.state.email !== "" &&
        this.state.password !== "" &&
        emailCheck === true &&
        passCheck === true
      ) {
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
                  this.setState({ loginFailed: false });
                  Cookies.remove("user_id");
                  Cookies.set("user_id", result["user_id"], { expires: 7 });
                  if (result["name"] !== undefined) {
                    Cookies.set("name", result["name"], { expires: 7 });
                  }
                  this.props.history.push({
                    pathname: "/",
                  });
                } else {
                  this.setState({ loginFailed: true });
                }
              }
            }
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        // alert("Please check your email and password");
      }
    } else if (submitRequest === "signup") {
      const emailCheck = this.checkEmail();
      const passCheck = this.checkPasswords(false);
      if (emailCheck === true && passCheck === true && this.state.name !== "") {
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
              {this.state.loginFailed && (
                <div className="error">Failed to log in</div>
              )}

              <form
                autoComplete="off"
                name="login"
                onSubmit={this.handleSubmit}
              >
                <label className="signInSubHeader">
                  <div className="tab">Email</div>
                  {this.state.emailWrong && (
                    <div className="error">Email Incorrect</div>
                  )}
                  <input
                    className="input-form"
                    type="text"
                    name="email"
                    onChange={this.changeHandler}
                  />
                </label>
                <label className="signInSubHeader">
                  <div className="tab">Password</div>
                  {this.state.passWrong && (
                    <div className="error">Password Incorrect</div>
                  )}
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
                  {this.state.emailWrong && (
                    <div className="error">Email Incorrect</div>
                  )}
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
                  {this.state.passWrong && (
                    <div className="error">Password Incorrect</div>
                  )}
                  <input
                    className="input-form"
                    type="password"
                    name="password"
                    onChange={this.changeHandler}
                  />
                </label>
                <label className="signInSubHeader">
                  <div className="tab">Confirm Password</div>
                  {this.state.passWrong && (
                    <div className="error">Password Incorrect</div>
                  )}
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

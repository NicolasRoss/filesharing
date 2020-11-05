import React from "react";
import Navbar from "../components/navbar";
import DocCardContainer from "../components/docCardContainer";
import Intro from "../components/Intro";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.toLogin = this.toLogin.bind(this);
    this.rerenderHome = this.rerenderHome.bind(this);
    this.state = {
      user_id: -1,
      dragging: false,
      dragCounter: 0,
    };
  }

  toLogin() {
    this.props.history.push({
      pathname: "/Login",
    });
  }

  componentDidMount() {
    if (Cookies.get("user_id") !== undefined) {
      this.setState({ user_id: Cookies.get("user_id") });
    }
  }

  rerenderHome() {
    console.log("rerendering home");
    this.setState({ user_id: -1 });
  }

  insertCard = (result) => {
    if (this.state.doc_info !== null) {
      const newDocInfo = [...this.state.doc_info, result];
      this.setState({ doc_info: newDocInfo });
    } else {
      this.setState({ doc_info: [result] });
    }
  };

  render() {
    if (this.state.user_id !== -1) {
      return (
        <div>
          <Navbar rerenderHome={this.rerenderHome} />
          <DocCardContainer
            rerenderHome={this.rerenderHome}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Navbar />
          <Intro rerenderHome={this.rerenderHome} toLogin={this.toLogin} />
        </div>
      );
    }
  }
}

export default withRouter(Home);

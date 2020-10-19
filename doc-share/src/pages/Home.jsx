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
    };
  }

  toLogin() {
    this.props.history.push({
      pathname: "/Login",
    });
  }

  componentDidMount() {
    // this.data.props.map((item) => console.log(item));
    // if(this.props.location.state !== undefined && this.props.location.state.user_id !== undefined){
    //     console.log("yolo:" + this.props.location.state.user_id)
    //     this.setState({ user_id: this.props.user_id})
    // }

    if (Cookies.get("user_id") !== undefined) {
      this.setState({ user_id: Cookies.get("user_id") });
    }
  }

  rerenderHome() {
    console.log("rerendering home");
    this.setState({ user_id: -1 });
  }

  render() {
    if (this.state.user_id !== -1) {
      return (
        <div>
          <Navbar rerenderHome={this.rerenderHome} />
          <DocCardContainer rerenderHome={this.rerenderHome} />
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

import React from "react";
import Navbar from "../components/navbar";
import DocCardContainer from "../components/docCardContainer";
import Intro from "../components/Intro";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { API } from "../components/api";

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

  fileUploadHandler = () => {
    if (this.state.user_id !== null && this.state.selectedFile != null) {
      const data = new FormData();
      data.append("file", this.state.selectedFile);
      if (this.state.selectedFile["size"] < 16 * 1024 * 1024) {
        var url =
          API + "/documents?user=" + this.state.user_id + "&action=insert";
        fetch(url, {
          method: "POST",
          mode: "cors",
          body: data,
        })
          .then((res) => res.json())
          .then((result) => {
            this.insertCard(result);
          })
          .catch((error) => {});
      } else {
        alert("File size is too large");
      }
    }
  };

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
            fileUploadHandler={this.fileUploadHandler}
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

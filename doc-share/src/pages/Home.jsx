import React from "react";
import Navbar from "../components/navbar";
import DocCardContainer from "../components/docCardContainer";
import Intro from "../components/Intro";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
class Home extends React.Component {
  dropRef = React.createRef();
  constructor(props) {
    super(props);
    this.toLogin = this.toLogin.bind(this);
    this.rerenderHome = this.rerenderHome.bind(this);
    this.state = {
      user_id: -1,
      dragging: false,
      dragCounter: 0,
    };
    this.hiddenFileInput = React.createRef();
  }

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ dragCounter: this.state.dragCounter + 1 });
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
    }
  };

  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ dragCounter: this.state.dragCounter - 1 });

    if (this.state.dragCounter === 0) {
      this.setState({ dragging: false });
    }
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ dragging: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.setState({ dragCounter: 0 });
      this.setState(
        {
          selectedFile: e.dataTransfer.files[0],
        },
        () => this.fileUploadHandler()
      );
      e.dataTransfer.clearData();
    }
  };

  toLogin() {
    this.props.history.push({
      pathname: "/Login",
    });
  }

  componentDidMount() {
    let div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);

    if (Cookies.get("user_id") !== undefined) {
      this.setState({ user_id: Cookies.get("user_id") });
    }
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }

  rerenderHome() {
    console.log("rerendering home");
    this.setState({ user_id: -1 });
  }

  render() {
    if (this.state.user_id !== -1) {
      return (
        <div
          ref={this.dropRef}
          className={
            this.state.dragging
              ? "dropZoneContainer isDragging"
              : "dropZoneContainer"
          }
        >
          <Navbar rerenderHome={this.rerenderHome} />
          <DocCardContainer rerenderHome={this.rerenderHome} />
        </div>
      );
    } else {
      return (
        <div ref={this.dropRef}>
          <Navbar />
          <Intro rerenderHome={this.rerenderHome} toLogin={this.toLogin} />
        </div>
      );
    }
  }
}

export default withRouter(Home);

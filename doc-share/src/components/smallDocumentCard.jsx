import React from "react";
import "../css/smallDocumentCard.css";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { API, HOST } from "./api";

class smallDocumentCard extends React.Component {
  constructor(props) {
    super(props);
    this.downloadClick = this.downloadClick.bind(this);
    this.shareClick = this.shareClick.bind(this);
    this.checkFileExt = this.checkFileExt.bind(this);
    this.toDocViewer = this.toDocViewer.bind(this);
    this.state = {
      uuid: this.props.doc_id,
      name: this.props.name,
      date: this.props.date,
      path: this.props.path,
      user_id: null,
    };
  }

  componentDidMount() {
    if (Cookies.get("user_id") !== undefined) {
      this.setState({ user_id: Cookies.get("user_id") });
    }
  }

  downloadClick = (e) => {
    e.stopPropagation();
    console.log("download, path: " + this.state.path);

    if (this.state.uuid !== undefined) {
      console.log("clicked the download button for doc_id: " + this.state.uuid);
      var url =
        API +
        "/download?uuid=" +
        this.state.uuid +
        "&name=" +
        this.state.name +
        "&path=" +
        this.state.path;
      fetch(url, {
        method: "GET",
        mode: "cors",
      })
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.state.name);

          document.body.appendChild(link);
          link.click();

          link.parentNode.removeChild(link);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  shareClick = function (e) {
    e.stopPropagation();
    console.log("clicked shar for doc_id: " + this.state.uuid);
    console.log("share, path: " + this.state.path);

    if (this.state.uuid !== null && this.state.user_id !== null) {
      var url = API + "/link?user=" + this.state.user_id;
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          uuid: this.state.uuid,
          name: this.state.name,
          path: this.state.path,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((link) => {
          if (link !== null) {
            const url = HOST + link; //change this to some const WEBSITE that is either localhost or cloud domain
            const textArea = document.createElement("textarea");
            textArea.innerText = url;

            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");

            textArea.parentNode.removeChild(textArea);
            alert("Link copied to clipboard");
          } else {
            alert("Failed to Generate Link");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  editClicked = () => {
    this.props.editClicked(this.state.uuid);
  };

  formatDate() {
    if (this.state.date !== undefined && this.state.date !== "") {
      var t = this.state.date.split(/[- :]/);
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
        " " +
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

  checkFileExt() {
    if (this.state.name !== "") {
      var patt = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      var ext = this.state.name.match(patt);
      if (
        ext[0].includes("jpg") ||
        ext[0].includes("jpeg") ||
        ext[0].includes("png")
      ) {
        return <i className="fas fa-file-image"></i>;
      } else if (
        ext[0].includes("py") ||
        ext[0].includes("js") ||
        ext[0].includes("css")
      ) {
        return <i className="fas fa-file-code"></i>;
      } else if (ext[0].includes("zip")) {
        return <i className="fas fa-file-archive"></i>;
      }
    }
    return <i className="fas fa-file-alt"></i>;
  }

  toDocViewer() {
    this.props.history.push({
      pathname: "/DocViewer",
      state: { doc_info: this.props.doc_info, user_id: this.state.user_id },
    });
  }

  render() {
    var icon = this.checkFileExt();
    return (
      <div
        className="smallDocContainer"
        style={{ pointerEvents: "all", cursor: "pointer" }}
      >
        <div className="fileIcon" onClick={this.toDocViewer}>
          {icon}
        </div>
        <div className="smallDocTitle noselect">{this.state.name} </div>
        {/* <div className="smallDocTitle noselect">{this.state.date}</div> */}
        <div className="smallDocIcons">
          <i
            className="smallIcons fas fa-file-download"
            onClick={this.downloadClick}
          ></i>
          <i
            className="smallIcons fas fa-share-alt"
            onClick={this.shareClick}
          ></i>
          {/* <i
            className="smallIcons fas fa-trash-alt"
            onClick={this.deleteClick}
          ></i> */}
          <i className="smallIcons fas fa-cog" onClick={this.editClicked}></i>
        </div>
      </div>
    );
  }
}

export default withRouter(smallDocumentCard);

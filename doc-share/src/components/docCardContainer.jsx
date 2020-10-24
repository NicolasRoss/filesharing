import React from "react";
import DocumentCard from "./documentCard";
// import NewDocCard from "./newDocCard";
import Cookies from "js-cookie";
import Filter from "./filter";
import { Container, Row, Col } from "react-bootstrap";
import { API } from "./api";

export default class DocCardContainer extends React.Component {
  dropRef = React.createRef();
  constructor(props) {
    super(props);
    this.getDocInfo = this.getDocInfo.bind(this);
    this.rerenderContainer = this.rerenderContainer.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.insertCard = this.insertCard.bind(this);
    this.setActiveId = this.setActiveId.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getCards = this.getCards.bind(this);
    this.onkeypressed = this.onkeypressed.bind(this);

    this.state = {
      isFetching: true, //later for loading animation
      user_id: Cookies.get("user_id"),
      doc_info: [],
      activeId: -1,
      searchField: "",
      selectedFile: null,
      dragging: false,
      dragCounter: 0,
    };
    this.hiddenFileInput = React.createRef();
  }

  async componentDidMount() {
    let div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);

    if (Cookies.get("user_id") !== undefined) {
      this.setState({ user_id: Cookies.get("user_id") });
      try {
        await this.getDocInfo();
      } catch (error) {
        console.log(error);
      }
    }
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }
  handleClick = () => {
    this.hiddenFileInput.current.click();
  };

  fileSelectedHandler = (event) => {
    this.setState(
      {
        selectedFile: event.target.files[0],
      },
      () => this.fileUploadHandler()
    );
  };

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

  handleChange = (event) => {
    const req = event.target.getAttribute("name");
    if (req === "searchField") {
      this.setState({ searchField: event.target.value });
    }
  };

  onkeypressed(evt) {
    var code = evt.charCode || evt.keyCode;
    if (code === 27) {
      this.setState({ searchField: "" });
      evt.target.value = "";
    }
  }

  getDocInfo() {
    var url = API + "/documents?user=" + this.state.user_id;
    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({ doc_info: result });
        this.setState({ isFetching: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  rerenderContainer() {
    this.setState({ isFetching: true });
    this.getDocInfo();
  }

  setActiveId(id) {
    if (id !== undefined) {
      this.setState({ activeId: id });
    }
  }

  getCards() {
    if (this.state.searchField === "") {
      return this.state.doc_info;
    } else {
      var searchedCards = [];
      this.state.doc_info.map((doc) => {
        if (doc["file_name"].includes(this.state.searchField)) {
          searchedCards.push(doc);
        }
      });
      return searchedCards;
    }
  }

  insertCard = (result) => {
    if (this.state.doc_info !== null) {
      const newDocInfo = [...this.state.doc_info, result];
      this.setState({ doc_info: newDocInfo });
    } else {
      this.setState({ doc_info: [result] });
    }
  };

  deleteCard = (result) => {
    console.log(result);
    const items = [...this.state.doc_info];
    const j = items.findIndex((item) => item.doc_id === result);

    items.splice([j], 1);

    this.setState({ doc_info: items });
  };

  getCards() {
    if (this.state.searchField === "") {
      // console.log("searchfield empty")
      return this.state.doc_info;
    } else {
      var searchedCards = [];
      this.state.doc_info.map((doc) => {
        if (doc["file_name"].includes(this.state.searchField)) {
          searchedCards.push(doc);
        }
      });
      return searchedCards;
    }
  }

  handleFilter = (value) => {
    const sortedDocs = this.state.doc_info;
    sortedDocs.sort(this.dynamicSort(value));
    this.setState({ doc_info: sortedDocs });
  };

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  render() {
    var cards;
    if (
      this.state.user_id !== -1 &&
      this.state.isFetching !== true &&
      this.state.doc_info !== null
    ) {
      var filteredCards = this.getCards();
      if (filteredCards.length > 0) {
        cards = filteredCards.map((doc) => (
          <DocumentCard
            key={doc["doc_id"]}
            date={doc["date"]}
            doc_id={doc["doc_id"]}
            name={doc["file_name"]}
            status={doc["status"]}
            path={doc["location"]}
            active={this.state.activeId}
            setActiveId={this.setActiveId}
            deleteCard={this.deleteCard}
          />
        ));
      } else {
        cards = (
          <Container>
            <Row>
              <Col>
                <div className="uuidContent">
                  no documents matching search..
                </div>
              </Col>
            </Row>
          </Container>
        );
      }
    } else {
      cards = <div></div>;
    }

    var newCard;
    if (this.state.searchField === "") {
      // newCard = <NewDocCard insertCard={this.insertCard} />;
    } else {
      newCard = <div></div>;
    }

    const options = [
      { value: "file_name", name: "Filename" },
      { value: "date", name: "Date" },
    ];

    return (
      <div
        ref={this.dropRef}
        className={this.state.dragging ? "isDragging" : ""}
      >
        <Container>
          <Row>
            <Col xs={9}>
              <input
                type="text"
                className="searchBar"
                placeholder="search..."
                name="searchField"
                onKeyDown={this.onkeypressed}
                onChange={this.handleChange}
              ></input>
            </Col>
            <Col xs={2}>
              <Filter
                handleFilter={this.handleFilter}
                defaultText="Filter"
                options={options}
              />
            </Col>
          </Row>

          {/* {newCard} */}
          {cards}
        </Container>
      </div>
    );
  }
}

import React from "react";
import DocumentCard from "./documentCard";
import SmallDocumentCard from "./smallDocumentCard";
import Modal from "./modal";
import ModalContent from "./modalDocContent";
import Cookies from "js-cookie";
import Filter from "./filter";
import { Container, Row, Col } from "react-bootstrap";
import { API } from "./api";

export default class DocCardContainer extends React.Component {
  dropRef = React.createRef();
  constructor(props) {
    super(props);
    this.getDocInfo = this.getDocInfo.bind(this);
    this.setActiveId = this.setActiveId.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getCards = this.getCards.bind(this);
    this.onkeypressed = this.onkeypressed.bind(this);
    this.editClicked = this.editClicked.bind(this);

    this.state = {
      searchField: "",
      doc_info: [],
      user_id: Cookies.get("user_id"),
      isFetching: true, //later for loading animation
      activeId: -1,
      selectedFile: null,
      editUUID: null,
      showDocModal: false,
      cardType: "small",
      filter: "",
    };
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

  editClicked = (uuid) => {
    console.log("editClicked");
    console.log(uuid);
    if (uuid !== undefined) {
      this.setState({ modalUUID: uuid });
      this.setState({ showDocModal: true });
    }
  };

  hideModal = () => {
    this.setState({ showDocModal: false });
  };

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
        // console.log(result);
        this.setState({ doc_info: result, isFetching: false, filter: "date" });
        this.handleFilter(this.state.filter);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setActiveId(id) {
    if (id !== undefined) {
      this.setState({ activeId: id });
    }
  }

  fileUploadHandler = () => {
    if (this.state.user_id !== null && this.state.selectedFile != null) {
      const data = new FormData();
      data.append("file", this.state.selectedFile);
      if (this.state.selectedFile["size"] < 16 * 1024 * 1024) {
        //for files < 16MB
        var url = API + "/documents?user=" + this.state.user_id;
        fetch(url, {
          method: "POST",
          mode: "cors",
          body: data,
        })
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            }
            throw new Error("Unsupported file type.");
          })
          .then((result) => {
            this.insertCard(result);
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        alert("File size is too large");
      }
    }
  };

  insertCard = (result) => {
    if (this.state.doc_info !== null) {
      const newDocInfo = [...this.state.doc_info, result];
      this.setState({ doc_info: newDocInfo });
      this.handleFilter(this.state.filter);
    } else {
      this.setState({ doc_info: [result] });
    }
  };

  deleteCard = (result) => {
    console.log(result);
    const items = [...this.state.doc_info];
    const j = items.findIndex((item) => item.uuid_id === result);

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
        if (doc["document_name"].includes(this.state.searchField)) {
          searchedCards.push(doc);
        }
      });
      return searchedCards;
    }
  }

  handleFilter = (value) => {
    this.setState({ filter: value });
    const sortedDocs = this.state.doc_info;
    if (sortedDocs !== null) {
      sortedDocs.sort(this.dynamicSort(value));
      this.setState({ doc_info: sortedDocs });
    }
  };

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = null;
      if (property === "date") {
        var date1 = new Date(a[property]);
        var date2 = new Date(b[property]);
        result = date1 < date2 ? 1 : date1 > date2 ? -1 : 0;
      } else {
        result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      }
      return result * sortOrder;
    };
  }

  render() {
    var modal;
    if (this.state.modalUUID !== null) {
      modal = (
        <Modal show={this.state.showDocModal} handleClose={this.hideModal}>
          {this.state.showDocModal && (
            <ModalContent
              doc_info={
                this.state.doc_info[
                  this.state.doc_info.findIndex(
                    (p) => p.uuid_id === this.state.modalUUID
                  )
                ]
              }
              user_id={this.state.user_id}
              uuid={this.state.modalUUID}
            />
          )}
        </Modal>
      );
    } else {
      modal = <div></div>;
    }

    var cards;
    if (
      this.state.user_id !== -1 &&
      this.state.isFetching !== true &&
      this.state.doc_info !== null
    ) {
      var filteredCards = this.getCards();
      if (filteredCards.length > 0) {
        if (this.state.cardType === "small") {
          cards = filteredCards.map((doc) => (
            <Col xs={12} sm={6} md={4} lg={4} xl={3} key={doc["uuid_id"]}>
              <SmallDocumentCard
                date={doc["date"]}
                doc_id={doc["uuid_id"]}
                name={doc["document_name"]}
                status={doc["public"]}
                path={doc["directory_loc"]}
                active={this.state.activeId}
                setActiveId={this.setActiveId}
                deleteCard={this.deleteCard}
                editClicked={this.editClicked}
              />
            </Col>
          ));
        } else {
          //full sized cards
          cards = filteredCards.map((doc) => (
            <DocumentCard
              key={doc["uuid_id"]}
              date={doc["date"]}
              doc_id={doc["uuid_id"]}
              name={doc["document_name"]}
              status={doc["public"]}
              path={doc["directory_loc"]}
              active={this.state.activeId}
              setActiveId={this.setActiveId}
              deleteCard={this.deleteCard}
              editClicked={this.editClicked}
            />
          ));
        }
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

    const options = [
      { value: "document_name", name: "Filename" },
      { value: "date", name: "Date" },
    ];

    return (
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
          <Col xs={3}>
            <Filter
              handleFilter={this.handleFilter}
              defaultText="Filter"
              options={options}
            />
          </Col>
        </Row>
        <Container
          ref={this.dropRef}
          className={
            this.state.dragging
              ? "dropZoneContainer isDragging"
              : "dropZoneContainer"
          }
        >
          {modal}
          {this.state.cardType === "small" && <Row>{cards}</Row>}
          {this.state.cardType === "large" && cards}
        </Container>
      </Container>
    );
  }
}

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/documentCard.css";

export default class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultText: "",
      value: "",
      directionToggle: true,
      isOpen: false,
      options: [],
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.setState({
      defaultText: this.props.defaultText,
    });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (
      !e.target.classList.contains("ddList") &&
      !e.target.classList.contains("ddItem")
    ) {
      this.setState({ isOpen: false });
    }
  };

  toggleDD = () => {
    this.setState((prevState) => {
      return {
        isOpen: !prevState.isOpen,
      };
    });
  };

  handleOptionClick = (e) => {
    this.setState(
      {
        defaultText: e.target.getAttribute("data-name"),
        value: e.target.getAttribute("value"),
        isOpen: false,
      },
      () => {
        var direction = document
          .getElementById("direction")
          .getAttribute("value");
        var sortBy = this.state.value;
        // console.log(direction + sortBy);

        this.props.handleFilter(direction + sortBy);
      }
    );
  };

  handleSortDirection = (e) => {
    this.setState(
      {
        directionToggle: !this.state.directionToggle,
      },
      () => {
        var direction = document
          .getElementById("direction")
          .getAttribute("value");
        var sortBy = this.state.value;
        // console.log(direction + sortBy);

        this.props.handleFilter(direction + sortBy);
      }
    );
  };

  render() {
    const { options } = this.props;
    const { isOpen, defaultText } = this.state;
    return (
      <Container>
        <Row>
          <Col xs={9}>
            <div className="sortButton">
              <div className="sortContainer">
                <div
                  id="sortby"
                  value={this.state.value}
                  onClick={this.toggleDD}
                >
                  {defaultText}
                </div>
                {isOpen && (
                  <div className="ddListContainer">
                    <ul className="ddList">
                      {options.map((option) => {
                        return (
                          <li
                            className="ddItem"
                            data-name={option.name}
                            key={option.value}
                            value={option.value}
                            onClick={this.handleOptionClick}
                          >
                            {option.name}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col xs={3} className="sortContainer">
            <div className="sortDirection">
              <i
                id="direction"
                className={
                  this.state.directionToggle
                    ? "fas fa-sort-amount-up"
                    : "fas fa-sort-amount-down"
                }
                onClick={this.handleSortDirection}
                value={this.state.directionToggle ? "" : "-"}
              ></i>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

import React from "react";
import "../css/documentCard.css";

export default class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultText: "",
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
    this.setState({
      defaultText: e.target.getAttribute("data-name"),
      isOpen: false,
    });
    this.props.handleFilter(e.target.getAttribute("value"));
  };

  render() {
    const { options } = this.props;
    const { isOpen, defaultText } = this.state;
    return (
      <div className="sortButton">
        <div id="sortby" onClick={this.toggleDD}>
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
    );
  }
}

import React from 'react';
import DocumentCard from './documentCard';
import NewDocCard from './newDocCard';
import Cookies from "js-cookie";
import {Container, Row, Col } from 'react-bootstrap';
import { API } from './api';
export default class DocCardContainer extends React.Component {

    constructor(props){
        super(props);
        this.getDocInfo = this.getDocInfo.bind(this);
        this.rerenderContainer = this.rerenderContainer.bind(this);
        this.setActiveId = this.setActiveId.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getCards = this.getCards.bind(this);
        this.state = {
            isFetching: true, //later for loading animation
            user_id: Cookies.get("user_id"),
            doc_info: [],
            activeId: -1,
            searchField: ''
        }
    }

    async componentDidMount() { 
        if(Cookies.get("user_id") !== undefined){
            this.setState({user_id: Cookies.get("user_id")})
            try {
                await this.getDocInfo();
            
            } catch(error) {
                console.log(error);
            }
        }

    }

    handleChange = (event) =>{
        const req = event.target.getAttribute('name')
        console.log("req is:" + req)
        if(req === 'searchField'){
            this.setState({searchField: event.target.value})
            // console.log(this.state.searchField)
        }
    }
        
    getDocInfo(){
        console.log("fetching documents for:" + this.state.user_id)
        var url = API + "/documents?user="+this.state.user_id;
        fetch(url, {
            method: 'GET',
            mode: 'cors'
        })
        .then(res => res.json())
        .then((result) => {
            // console.log(result)
            this.setState({ doc_info: result})
            this.setState({isFetching: false})

        }).catch((error) => {
            console.log(error);
        });
    }

    rerenderContainer(){
        console.log("rerendering container")
        this.setState({isFetching: true})
        this.getDocInfo();
    }

    setActiveId(id){
        if (id !== undefined){
            this.setState({activeId: id})
        }
    }

    getCards(){
        if(this.state.searchField === ''){
            // console.log("searchfield empty")
            return this.state.doc_info
        }else{
            var searchedCards = [];
            this.state.doc_info.map((doc) =>{
                if(doc["file_name"].includes(this.state.searchField)){
                    searchedCards.push(doc);
                }
            })
            // console.log("serachfield not empty")
            // console.log(searchedCards)
            return searchedCards;
        }
    }


    render() {
        var cards;
        // console.log(this.state.doc_info);
        // console.log("render called")
        if(this.state.user_id !== -1 && this.state.isFetching !== true && this.state.doc_info !== null){
            var filteredCards = this.getCards();
            if(filteredCards.length > 0){
                cards = filteredCards.map((doc) => 
                <DocumentCard
                    key={doc["doc_id"]}
                    date={doc["date"]}
                    doc_id={doc["doc_id"]} 
                    name={doc["file_name"]}
                    status={doc["status"]}
                    path={doc["location"]}
                    active= {this.state.activeId}
                    setActiveId = {this.setActiveId}
                    rerenderContainer={this.rerenderContainer}
                /> 
                );
            }else{
                console.log("no documents")
                cards = (
                <Container>
                    <Row>
                        <Col>
                            <div className="uuidContent">no documents matching search..</div>
                        </Col>
                    </Row>
                </Container>
                );
            }
        }else{
            cards = (
                <div></div>
            );
        }

        var newCard;
        if(this.state.searchField === ''){
            newCard = (<NewDocCard rerenderContainer = {this.rerenderContainer}/>);
        }else{
            newCard = (
            <div></div>
            );
        }

        return(
            <div>
                <Container>
                    <Row>
                        <Col xs={8}>
                            <input type="text" className="input-form" placeholder="search..." name="searchField" onChange={this.handleChange}></input>
                        </Col>
                    </Row>
                </Container>
                {cards}
                {newCard}
            </div>
        );
    }
}
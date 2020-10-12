import React from 'react';
import DocumentCard from './documentCard';
import NewDocCard from './newDocCard';
import Cookies from "js-cookie";
import { API } from './api';
export default class DocCardContainer extends React.Component {

    constructor(props){
        super(props);
        this.getDocInfo = this.getDocInfo.bind(this);
        this.rerenderContainer = this.rerenderContainer.bind(this);
        this.setActiveId = this.setActiveId.bind(this);
        this.state = {
            isFetching: true, //later for loading animation
            user_id: Cookies.get("user_id"),
            doc_info: [],
            activeId: -1
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


    render() {
        var cards;
        // console.log(this.state.doc_info);
        // console.log(this.state.activeId)
        if(this.state.user_id !== -1 && this.state.isFetching !== true && this.state.doc_info !== null){
            cards = this.state.doc_info.map((doc) => 
                <DocumentCard
                    key={doc["doc_id"]}
                    date={doc["date"]}
                    doc_id={doc["doc_id"]} 
                    name={doc["file_name"]}
                    status={doc["status"]}
                    path={doc["location"]}
                    active= {this.state.activeId}
                    setActiveId = {this.setActiveId}
                    
                />   
        );
        }else{
            cards = (
                <div>uh oh</div>
            )
        }

        return(
            <div>
                {cards}
                <NewDocCard rerenderContainer = {this.rerenderContainer}/>
            </div>
        );
    }
}
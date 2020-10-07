import React from 'react';
import DocumentCard from './documentCard';
import NewDocCard from './newDocCard';
import Cookies from "js-cookie";

export default class DocCardContainer extends React.Component {

    constructor(props){
        super(props);
        this.getDocInfo = this.getDocInfo.bind(this);
        this.state = {
            isFetching: true, //later for loading animation
            user_id: this.props.user_id,
            doc_info: []
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
        // console.log(this.state.user_id)
        var url = "http://localhost:5000/documents?user="+this.state.user_id;
        fetch(url, {
            method: 'GET',
            mode: 'cors'
        })
        .then(res => res.json())
        .then((result) => {
            console.log(result)
            this.setState({ doc_info: result})
            this.setState({isFetching: false})
        }).catch((error) => {
            console.log(error);
        });
    }


    render() {
        var cards;
        // console.log(this.state.doc_info);
        if(this.state.user_id !== -1 && this.state.isFetching !== true && this.state.doc_info !== null){
            cards = this.state.doc_info.map((doc) => 
                <DocumentCard
                    key={doc["doc_id"]}
                    date={doc["date"]}
                    doc_id={doc["doc_id"]} 
                    name={doc["file_name"]}
                    status={doc["status"]}
                    path={doc["location"]}
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
                <NewDocCard/>
            </div>
        );
    }
}
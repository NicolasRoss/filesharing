import React from 'react';
import DocumentCard from './documentCard';
import NewDocCard from './newDocCard';
import Cookies from "js-cookie";

export default class DocCardContainer extends React.Component {

    constructor(props){
        super(props);
        this.getDocIDFunc = this.getDocIDFunc.bind(this);
        this.state = {
            isFetching: true, //later for loading animation
            user_id: this.props.user_id,
            doc_ids: []
        }
    }


    


    async componentDidMount() { 
        // console.log("container: " + this.props.user_id)
        
        if(Cookies.get("user_id") !== undefined){

            this.setState({user_id: Cookies.get("user_id")})
            try {
                await this.getDocIDFunc();
            }
            catch(error){
                console.log(error);
            }
        }

    }

        
    getDocIDFunc(){
        try {
            console.log(this.state.user_id)
            var url = "http://localhost:5000/documents?user="+this.state.user_id;
            fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    this.setState({ doc_ids: result})
                    this.setState({isFetching: false})
                }
            )
        }
        catch(error){
            console.log(error);
        }
    }


    render() {
        var cards;
        console.log(this.state.doc_ids);
        if(this.state.user_id !== -1 && this.state.isFetching !== true){
            console.log("in check" + this.state.user_id);
            console.log(this.state.doc_ids);
            cards = this.state.doc_ids.map((doc) => 
            <DocumentCard key={doc["doc_id"]} doc_id={doc["doc_id"]}/>   
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
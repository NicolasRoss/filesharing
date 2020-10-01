import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import DocumentCard from './documentCard';


export default class DocCardContainer extends React.Component {

    constructor(props){
        super(props);
        this.getDocIDFunc = this.getDocIDFunc.bind(this);
        this.state = {
            isFetching: false, //later for loading animation
            user: 4,
            doc_ids: []
        }
    }


    


    async componentDidMount() { 
        try {
            await this.getDocIDFunc();
        }
        catch(error){
            console.log(error);
        }
    }

        
    getDocIDFunc(){
        try {
            var url = "http://localhost:5000/documents?user=4";
            fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ doc_ids: result})
                }
            )
        }
        catch(error){
            console.log(error);
        }
    }


    render() {
        const cards = this.state.doc_ids.map((doc) => 
            <DocumentCard key={doc.doc_id[0]} doc_id={doc.doc_id}/>   
        );
        return(
            <div>
                {cards}
            </div>
        );
    }
}
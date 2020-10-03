import React from 'react';
import DocumentCard from './documentCard';
import NewDocCard from './newDocCard';


export default class DocCardContainer extends React.Component {

    constructor(props){
        super(props);
        this.getDocIDFunc = this.getDocIDFunc.bind(this);
        this.state = {
            isFetching: false, //later for loading animation
            user_id: -1,
            doc_ids: []
        }
    }


    


    async componentDidMount() { 
        console.log("container: " + this.props.user_id)
        try {
            await this.getDocIDFunc();
        }
        catch(error){
            console.log(error);
        }
    }

        
    getDocIDFunc(){
        try {
            var url = "http://localhost:5000/documents?user=14";
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
            <DocumentCard key={doc["doc_id"]} doc_id={doc["doc_id"]}/>   
        );
        return(
            <div>
                {cards}
                <NewDocCard/>
            </div>
        );
    }
}
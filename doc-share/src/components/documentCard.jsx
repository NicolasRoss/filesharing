import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/documentCard.css';

export default class documentCard extends React.Component{

    constructor(props){
        super(props);
        this.getDocInfo = this.getDocInfo.bind(this);
        this.state = {
            uuid: this.props.doc_id,
            name: 'placeholder',
            date: 'placeholder',
        };
    }


    getDocInfo(){
        try {
            var url = "http://localhost:5000/documents?key=" + this.state.uuid;
            console.log(url);
            fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result[0]["document_name"]);
                    
                    this.setState({ name: result[0]["document_name"]})
                    this.setState({date: result[0]["date"]})
                }
            )
        }
        catch(error){
            console.log(error);
        }
    }

    async componentDidMount() {
        //load data here i think
        try {
            await this.getDocInfo();
        }
        catch(error){
            console.log(error);
        }
    }




    render(){
        console.log(this.state.name)
        return(
            
                <Container className="docContainer box-shadow">
                    {/* <a href="#"> */}
                        <Row >
                            <Col xs={10}>
                                
                                <div className="uuidContainer">
                                    <div className="uuidContent">{this.state.uuid}</div>
                                </div>
                            </Col>
                            <Col xs={8}>
                                <div>
                                    <div className="docSubtitle marginLeft">{this.state.name}</div>
                                </div>
                            </Col>
                            <Col className="buffer" xs={4}>
                                <div>
                                    <div className="docSubtitle">{this.state.date}</div>
                                </div>
                                
                            </Col>
                            
                        </Row>
                    {/* </a> */}
                </Container>
            
        );
    }

}
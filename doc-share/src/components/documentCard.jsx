import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/documentCard.css';
import { withRouter } from 'react-router-dom';
 class documentCard extends React.Component{

    constructor(props){
        super(props);
        this.getDocInfo = this.getDocInfo.bind(this);
        this.goDocPage = this.goDocPage.bind(this);
        this.state = {
            uuid: this.props.doc_id,
            name: '',
            date: '',
        };
    }


    async getDocInfo(){
        try {
            var key = "6909a899-044f-11eb-9446-00155d4ec2f4";
            console.log("id: " + this.props.doc_id);
            if(this.props.doc_id !== undefined){
                var url = "http://localhost:5000/documents?key=" + this.props.doc_id;
                // console.log(url);
                fetch(url, {
                    method: 'GET',
                    mode:'cors',
                    
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        
                        if(result !== undefined && result[0] !== undefined){
                            console.log(result[0]);
                            this.setState({ name: result[0]["document_name"]})
                            this.setState({date: result[0]["date"]})
                        }
                    }
                )
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async goDocPage(){
        await(this.getDocInfo);
        this.props.history.push({
            pathname: '/Document',
            state: {uuid: this.state.uuid, date: this.state.date, name: this.state.name}
        });
    }

    async componentDidMount() {
        try { 
            this.setState({uuid: this.props.doc_id})
            await this.getDocInfo();
        }
        catch(error){
            console.log(error);
        }
    }




    render(){
        
        // console.log(this.state.name)
        return(
                <div>
                <Container className="docContainer box-shadow">
                    
                    <a onClick={this.goDocPage} style={{"pointerEvents": "all", "cursor": "pointer"}}>
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
                    </a>
                    
                </Container>
                {/* <Container>
                    <Row>
                        <Col xs={12}> 
                            <div className="test"></div>
                        </Col>
                    </Row>
                </Container> */}
                
                </div>
                
            
        );
    }

} 


export default withRouter(documentCard);
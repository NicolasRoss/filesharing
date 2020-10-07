import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/documentCard.css';
import { withRouter } from 'react-router-dom';
 class documentCard extends React.Component{

    constructor(props){
        super(props);
        this.goDocPage = this.goDocPage.bind(this);
        this.downloadClick = this.downloadClick.bind(this);
        this.noContainerClick = this.noContainerClick.bind(this);

        this.state = {
            uuid: this.props.doc_id,
            name: this.props.name,
            date: this.props.date,
            path: this.props.path,
            status: this.props.status, // for public or private
            clickToggle: false
        };
    }

    goDocPage(){
        this.setState({clickToggle: !this.state.clickToggle})
    }

    noContainerClick = function(e) {
        e.stopPropagation();
    }

    downloadClick = function(e) {
        e.stopPropagation();
        console.log(this.state.path)
        if(this.state.uuid !== undefined){
            console.log("clicked the download button for doc_id: " + this.state.uuid);
            var url = "http://localhost:5000/download?doc_id=" + this.state.uuid + "&name=" + this.state.name + "&path=" + this.state.path;
            fetch(url, {
                method: 'GET',
                mode: 'cors'
            })
            .then(res => res.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', this.state.name);

                document.body.appendChild(link);
                link.click();

                link.parentNode.removeChild(link);
             
                
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    render(){
        const dropDown = (
            <Row>
                <Col xs={4}>
                    <button className="downloadButton noselect" onClick={this.downloadClick} download> Download File</button>
                </Col>
                <Col xs={{span: 4, offset: 3}}>
                    <button className="shareButton noselect">Share file</button>
                </Col>
            </Row>
        )
        
        return(
                <div>
                <Container className="docContainer box-shadow">
                    
                    <div onClick={this.goDocPage} style={{"pointerEvents": "all", "cursor": "pointer"}}>
                        <Row>
                            <Col sm={12} lg={10}>
                                
                                <div onClick={this.noContainerClick}  className="uuidContainer">
                                    <div style={{"pointerEvents": "none", "cursor": "initial"}} className="uuidContent">{this.state.uuid}</div>
                                </div>
                            </Col>
                            <Col  sm={12} lg={2}>
                                <div className="popContainer noselect">
                                    <div  className="publicOrPrivate">Public</div>
                                </div>
                                
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} >
                                <div>
                                    <div className="docSubtitle marginLeft noselect">{this.state.name}</div>
                                </div>
                            </Col>
                            <Col className="buffer" xs={5}>
                                <div>
                                    <div className="docSubtitle floatRight noselect">{this.state.date}</div>
                                </div>
                                
                            </Col>
                        </Row>
                            
                        
                        {this.state.clickToggle && dropDown}
                    </div>
                    
                    
                    
                </Container>
                
                </div>
                
            
        );
    }

} 


export default withRouter(documentCard);
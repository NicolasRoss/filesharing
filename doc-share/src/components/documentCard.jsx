import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/documentCard.css';
import { withRouter } from 'react-router-dom';
import { API } from './api';
 class documentCard extends React.Component{

    constructor(props){
        super(props);
        this.goDocPage = this.goDocPage.bind(this);
        this.downloadClick = this.downloadClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.noContainerClick = this.noContainerClick.bind(this);

        this.state = {
            uuid: this.props.doc_id,
            name: this.props.name,
            date: this.props.date,
            path: this.props.path,
            status: this.props.status, // for public or private
            clickToggle: false,
        };
    }

    goDocPage(){
        
        if(this.state.uuid === this.props.active){
            this.props.setActiveId(-1);
            this.setState({clickToggle: false})
        }else if (this.state.uuid !== this.props.active){
            this.props.setActiveId(this.state.uuid);
            this.setState({clickToggle: true})
        }
    }

    noContainerClick = function(e) {
        e.stopPropagation();
    }

    downloadClick = function(e) {
        e.stopPropagation();
        console.log(this.state.path)
        if(this.state.uuid !== undefined){
            console.log("clicked the download button for doc_id: " + this.state.uuid);
            var url = API + "/download?doc_id=" + this.state.uuid + "&name=" + this.state.name + "&path=" + this.state.path;
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

    deleteClick = function(e){
        e.stopPropagation();
        console.log("delete, path:" + this.state.path);
    }

    // componentDidMount(){
    //     if(this.state.uuid === this.props.active){
    //         this.setState({clickToggle: true})
    //     }else{
    //         this.setState({clickToggle: false})
    //     }
    // }

    render(){
        var dropDown;
        if(this.state.uuid === this.props.active){
            dropDown = (
                <Row>
                    <Col xs={8}>
                        <i className="icon black fas fa-arrow-alt-circle-down fa-3x" onClick={this.downloadClick}></i>
                        <i className="icon black fas fa-share-alt-square fa-3x" onClick={this.deleteClick}></i>
                        <i className="icon black fas fa-trash-alt fa-3x" onClick={this.deleteClick}></i>
                        {/* <button className="downloadButton noselect" onClick={this.downloadClick} download> Download File</button> */}
                    </Col>
                    {/* <Col xs={{span: 4}}> */}
                        
                    {/* </Col> */}
                    {/* <Col> */}
                        
                        {/* <button className="downloadButton noselect" onClick={this.deleteClick}>Delete file</button> */}
                    {/* </Col> */}
                </Row>
                
            )
        }else{
            dropDown = (<div></div>);
        }

        
        
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
                            <Col  sm={12} lg={1}>
                                <div className="popContainer noselect">
                                    <i className="lock fas fa-lock-open"></i>
                                    {/* <div  className="publicOrPrivate">Public</div> */}
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
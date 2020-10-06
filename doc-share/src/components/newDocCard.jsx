import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/newDocCard.css'
import Cookies from 'js-cookie'

export default class documentCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedFile: null,
            user_id: null
        }
        this.hiddenFileInput = React.createRef()
    }

    componentDidMount(){
        if(Cookies.get("user_id") !== undefined){
            this.setState({user_id: Cookies.get("user_id")})
        }
    }

    handleClick = () => {
        this.hiddenFileInput.current.click()
    }

    fileSelectedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        }, () => this.fileUploadHandler())
    }

    fileUploadHandler = () => {
        if (this.state.user_id !== null && this.state.selectedFile != null) {
            const data = new FormData();
            data.append('file', this.state.selectedFile);
            
            if (this.state.selectedFile["size"] < 16 * 1024 * 1024) {
                var url = "http://localhost:5000/documents?user=" + this.state.user_id;
                fetch(url, {
                    method: 'POST',
                    mode:'cors',
                    body: data
                    
                })
                .then(res => res.json())
                .then(result => {
                    console.log(result)
                    
                }).catch((error) => {
                    console.log(error);
                });
            }
            // add else for file to big
            
        }
        // add else for no user_id
    }

    render(){
        return(
            <Container onClick={this.handleClick} className="newDocContainer box-shadow noselect">
                <form>

                    <div className="form-group">   
                        <Row>
                            <Col>
                                <div className="dottedBorder newDocPlus">
                                    +
                                    <input
                                        name="file" 
                                        id="file" 
                                        type="file"
                                        ref={this.hiddenFileInput} 
                                        onChange={this.fileSelectedHandler}
                                        style={{display:'none'}}/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    
                </form>
            </Container>
        );
    }
 
}
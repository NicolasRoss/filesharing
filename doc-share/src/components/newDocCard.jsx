import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../css/newDocCard.css';
import Cookies from 'js-cookie';
import {useDropzone} from 'react-dropzone';
import { API } from './api';

export default class documentCard extends React.Component{

    dropRef = React.createRef();
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            selectedFile: null,
            user_id: null,
            dragging: false,
            dragCounter: 0
        }
        this.hiddenFileInput = React.createRef()
    }

    componentDidMount(){
        this.dragCounter = 0
        if(Cookies.get("user_id") !== undefined){
            this.setState({user_id: Cookies.get("user_id")})
        }

        let div = this.dropRef.current;
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)


    }

    componentWillUnmount(){
        let div = this.dropRef.current;
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
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
                var url = API + "/documents?user=" + this.state.user_id + "&action=insert";
                fetch(url, {
                    method: 'POST',
                    mode:'cors',
                    body: data
                    
                })
                // .then(res => res.json())
                .then(result => {
                    console.log(result)
                    this.props.rerenderContainer();
                    
                }).catch((error) => {
                    console.log(error);
                });
            }
            // add else for file to big
            
        }
        // add else for no user_id
    }

    handleDrag = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        console.log(this.state.dragCounter)

    }

    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log("draginIn")
        this.setState({dragCounter: this.state.dragCounter + 1})
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0){
            this.setState({dragging: true})
        }

    }

    handleDragOut = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        console.log("dragout")
        
        this.setState({dragCounter: this.state.dragCounter - 1})
        // console.log("")
        if (this.state.dragCounter === 0){
            this.setState({dragging: false})
        }
        

    }

    handleDrop = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        this.setState({dragging: false})
        if(e.dataTransfer.files && e.dataTransfer.files.length > 0){
            this.setState({dragCounter: 0})
            console.log(e.dataTransfer.files[0]);
            this.setState({
                selectedFile: e.dataTransfer.files[0]
            }, () => this.fileUploadHandler())
            e.dataTransfer.clearData()
        }
            
    }


    render(){
        console.log("drag is:" + this.state.dragging)
        return(
            <Container onClick={this.handleClick}>
                <Row>
                    <Col>
                        <div ref={this.dropRef} className={this.state.dragging ? "newDocContainer isDragging noselect" : "newDocContainer box-shadow noselect"}>
                            <div className={this.state.dragging ? "newDocPlus isDragging": "newDocPlus "}>+
                                <input
                                        name="file" 
                                        id="file" 
                                        type="file"
                                        ref={this.hiddenFileInput} 
                                        onChange={this.fileSelectedHandler}
                                        style={{display:'none'}}/>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

        )
        
    }

    // render(){
    //     return(
    //         <Container onClick={this.handleClick} className="newDocContainer box-shadow noselect">
    //             <form encType="multipart/form-data">

    //                 <div >   
    //                     <Row>
                            // <Col>
    //                             <div className=" newDocPlus">
    //                                 +
                                    // <input
                                    //     name="file" 
                                    //     id="file" 
                                    //     type="file"
                                    //     ref={this.hiddenFileInput} 
                                    //     onChange={this.fileSelectedHandler}
                                    //     style={{display:'none'}}/>
    //                             </div>
    //                         </Col>
    //                     </Row>
    //                 </div>
                    
    //             </form>
    //         </Container>
    //     );
    // }
 
}
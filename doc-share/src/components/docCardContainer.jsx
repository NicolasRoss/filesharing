import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import DocumentCard from './documentCard';


export default class DocCardContainer extends React.Component {


    render() {
        return(
            <div>
                <DocumentCard/>
                <DocumentCard/>
                <DocumentCard/>
                <DocumentCard/>
            </div>
        );
    }
}
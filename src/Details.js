
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from './hooks/UseFetch';
import Container from 'react-bootstrap/esm/Container';
import { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Details () {
    const {id} = useParams();
    //const navigate = useNavigate();
    return (
            <div>
            Details of Todo
            <LoadDetails id={id}></LoadDetails>
            </div>
        )
}


export function LoadDetails({id}) {

    let fetch_url = `http://localhost:8083/api/todos/${id}`;

    const {responseData, loading, error } = useFetch(fetch_url);
    const [completed, setCompleted] = useState(false);
    const[deadline, setDate] = useState(null);
    const[priority, setPriority] = useState(null);

    useEffect (() => {
        if (responseData) {
            setCompleted(responseData.completed);
            setDate(responseData.deadline);
            setPriority(responseData.priority);
        }
    },[responseData]);

    function handleChange(event) {
        let newTodo = {};
    
        newTodo.completed = !responseData.completed;
    
        fetch(`http://localhost:8083/api/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify(newTodo),
            headers: { "Content-type": "application/json; charset = UTF-8" } 
            })
          .then(response => response.json())
          .then(data => {
             alert('Toggled todo status!'); 
             setCompleted(!responseData.completed)
            })
            .catch(error => {
                 alert('ERROR!!!'); 
             })

    }

    function saveChanges(event) {
        let formData = event.currentTarget;
        let newTodo = {...responseData};

        console.log(formData);
        newTodo.deadline = deadline; //formData["deadline"].value;
        newTodo.priority = priority; //formData["priority"].value;
        
        console.log(newTodo);
        console.log(JSON.stringify(newTodo));
    
        fetch(`http://localhost:8083/api/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify(newTodo),
            headers: { "Content-type": "application/json; charset = UTF-8" } 
            })
          .then(response => response.json())
          .then(data => {
             alert('updated todo!'); 
             setCompleted(!responseData.completed)
            })
            .catch(error => {
                 alert('ERROR!!!'); 
             })
    }

    //console.log(responseData, loading, error);
    if(error) {
        return <div>error!!</div>
    }

    if (loading) {
        return <div>loading...</div>
    }
    if (!loading) {
    //console.log(responseData);
    //let users = [{id: 123},{id: 234}];
    //        {responseData.map((todo) => <option value={todo.id}>{todo.description}</option>)}

    
    if(responseData) {
    return (
                <Container>
                <Form onSubmit={saveChanges}>
                <Card>
                <Row>
                    <Card.Text>Category: {responseData.category}</Card.Text>
                    <Card.Text>Description: {responseData.description}</Card.Text>
                    <Card.Text>                    
                        Deadline: <input value={deadline} type="date" name="deadline" onChange={(e)=> {
                            setDate(e.target.value);
                        }}/>
                    </Card.Text>
                    <Card.Text>
                    <Row className="d-flex justify-content-center">
                    <Col sm={6} md={4}>
                    <InputGroup>
                    <InputGroup.Text id="basic-addon1">Priority:</InputGroup.Text>
                    <Form.Select name="priority" id="priority" value={priority} onChange={(e)=> {
                            setPriority(e.target.value)}}>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </Form.Select>
                    </InputGroup>
                    </Col>
                    </Row>
                    </Card.Text>
                    <Card.Text>Status: <input value={completed? "Completed": "Pending"} type="text" name="completed" disabled={true}/>
                    </Card.Text>      
                    <Row className="d-flex justify-content-center">
                    <Col>             
                    {(!completed) && <Button type="button" className='md-4' onClick={handleChange}>Mark As Complete</Button>}
                    {(completed) && <Button type="button"className='md-4' onClick={handleChange}>Revert to Pending</Button>}
                    </Col>
                    <Col>             
                    <Button type="submit">Save Changes</Button>
                    </Col>
                    <Link to={`/UserTodo/${responseData.userid}`}>Go back
                    </Link>
                    </Row>
                    </Row>
                </Card>
                </Form>
                </Container>
            )

    }
}
}
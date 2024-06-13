
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';
import useFetch from './hooks/UseFetch';
import { Navigate, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

export default function NewTodo() {

    const [userId, setUserId] = useState(null);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    

    function handleUser(event) {
        console.log("Selected user id: " + event.target.value);
        setUserId(event.target.value);
    }

    function handleSubmit(event) {


        let formData = event.target;
    
        //console.log("Entering addTodo");
        //console.log(formData['users']);

        let date = new Date(formData['deadline'].value);
        let valid = true;
    if ( Object.prototype.toString.call(date) === "[object Date]") {
            if ( !isNaN(date.getTime()) )         
            {
                formData['deadline'].classList.remove("is-invalid");
                formData['deadline'].setCustomValidity("")
                formData['deadline'].classList.add("is-valid");
            } 
            else {
                formData['deadline'].setCustomValidity("Invalid date format. Please enter a valid date!")
                formData['deadline'].classList.add("is-invalid");
                valid = false;
            }
        }
        else {
            formData['deadline'].setCustomValidity("Invalid date format. Please enter a valid date!")
            formData['deadline'].classList.add("is-invalid");
            valid = false;
        }
    
    if (formData.checkValidity() === false){
            event.preventDefault();
            event.stopPropagation();      
        }
        else {
    
        if (!valid) {
            event.preventDefault();
            event.stopPropagation();      
        }
        else
        {
        let newTodo = {};
    
    newTodo.userid = formData["users"].value;
    newTodo.category = formData["categories"].value;
    newTodo.description = formData["description"].value;
    newTodo.deadline = formData["deadline"].value;
    newTodo.priority = formData["priority"].value;
    
    console.log(newTodo);
    console.log(JSON.stringify(newTodo));
        
        fetch('http://localhost:8083/api/todos/', {
           method: "POST",
           body: JSON.stringify(newTodo),
           headers: { "Content-type": "application/json; charset = UTF-8" }
           })
         .then(response => response.json())
         .then(data => {
            alert('Added new todo!'); 
            /* setTimeout(() => {
                <Navigate to="/home" replace={true} />;
            }, "2000") */
           })
           .catch(error => {
                alert('ERROR!!!'); 
            })
        }
        
    }
    setValidated(true);    
    }
    
    return (
    <Container>
    <Row className='justify-content-center'>
    <Col xs md lg={6}>
    <h4>Add New Todo</h4>
    <Form id="newTodoForm" noValidate onSubmit={handleSubmit} validated={validated} 
     onChange={(e) => e.target.checkValidity()}>
    <Form.Group>
    <Form.Label>Choose a user:</Form.Label>
    <Form.Select type="number" name="users" id="users" onChange={handleUser} required>
        <option value="" key="select">Select a user</option>    
        <LoadUsers></LoadUsers>
    </Form.Select>
    <Form.Control.Feedback type="invalid">
    Please select a user from the list.
    </Form.Control.Feedback>
    </Form.Group>
    <Form.Label>Choose a category:</Form.Label>
    <Form.Select name="categories" id="categories" required> 
        <option value="" key='select'>Select a category</option>    
        <LoadCategories></LoadCategories>
    </Form.Select>
    <Form.Control.Feedback type="invalid">
    Please select a category from the list.
    </Form.Control.Feedback>
    <Form.Label>Description:</Form.Label>
    <Form.Control type="text" id="description" name="description" required/>
    <Form.Label>Deadline:</Form.Label>
    <Form.Control type="date" id="deadline" name="deadline"/>
    <Form.Label>Priority:</Form.Label>
    <Form.Select name="priority" id="priority" required>
        <option value="" key='select'>Select priority</option>    
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
    </Form.Select>
    <Button className='col-md-2' type="submit" name="ADD" value="ADD">
        ADD
    </Button>{'  '}
    <Button className='col-md-2' type="button" name="CANCEL" value="CANCEL" onClick={() => {
                alert("Cancelled!!!");
                navigate('/');
                }}>
        CANCEL
    </Button>
    </Form>
    </Col>
    </Row>
    </Container>
    )
}

export function LoadUsers() {
    let fetch_url = `http://localhost:8083/api/users`;

    const {responseData, loading, error } = useFetch(fetch_url);

    //console.log(responseData, loading, error);
    if(error) {
        return "error!!"
    }

    if (loading) {
        return "loading..."
    }
    if (responseData) {
            return (responseData.map((user) => <option value={user.id} key={user.id}>{user.name}</option>))    
    }
}


export function LoadCategories() {
    let fetch_url = `http://localhost:8083/api/categories`;

    const {responseData, loading, error } = useFetch(fetch_url);

    //console.log(responseData, loading, error);
    if(error) {
        return "error!!"
    }

    if (loading) {
        return "loading..."
    }
    if(responseData) {
    return (
            responseData.map((category) => <option value={category.name} key={category.id}>{category.name}</option>)
        )
    }
    
}

export function checkFormData(formData) {

    let valid = true;

    console.log("Check form elements ---");

    if (formData['users'].selectedIndex === 0) {
        formData['users'].setCustomValidity("Not a valid user! Please select a user from the list.")
        formData['users'].classList.add("is-invalid");
        valid = false;
    } 
    else {
        formData['users'].setCustomValidity("")
        formData['users'].classList.remove("is-invalid");
        formData['users'].classList.add("is-valid");
    }

    if (formData['categories'].selectedIndex === 0) {
        formData['categories'].setCustomValidity("Not a valid category! Please select a category from the list")
        formData['categories'].classList.add("is-invalid");
        valid = false;
    } 
    else {
        formData['categories'].setCustomValidity("")
        formData['categories'].classList.remove("is-invalid");
        formData['categories'].classList.add("is-valid");
    }

    if (formData['description'].value === "") {
        formData['description'].setCustomValidity("Description cannot be empty!")
        formData['description'].classList.add("is-invalid");
        valid = false;
    } 
    else {
        formData['description'].setCustomValidity("")
        formData['description'].classList.remove("is-invalid");
        formData['description'].classList.add("is-valid");
    }    

    let date = new Date(formData['deadline'].value);
    
    if ( Object.prototype.toString.call(date) === "[object Date]") {
        if ( !isNaN(date.getTime()) )         
        {
            formData['deadline'].classList.remove("is-invalid");
            formData['deadline'].setCustomValidity("")
            formData['deadline'].classList.add("is-valid");
        } 
        else {
            formData['deadline'].setCustomValidity("Invalid date format. Please enter a valid date!")
            formData['deadline'].classList.add("is-invalid");
            valid = false;
        }
    }
    else {
        formData['deadline'].setCustomValidity("Invalid date format. Please enter a valid date!")
        formData['deadline'].classList.add("is-invalid");
        valid = false;
    }

    return valid;

}
 

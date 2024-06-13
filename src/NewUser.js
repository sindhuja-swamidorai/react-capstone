import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Navigate, useNavigate } from 'react-router';
import InputGroup from 'react-bootstrap/InputGroup';


export default function NewUser() {


    const [valid, setValid] = useState(null);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

let passwordRef = useRef();
let confirmPasswordRef = useRef();

function MatchPasswords(event) {

    if (confirmPasswordRef.current.value !== passwordRef.current.value)
    {
        console.log("Invalid input. Passwords do not match");
        confirmPasswordRef.current.classList.remove("is-valid");
        confirmPasswordRef.current.classList.add("is-invalid");
        setValid(false);
        return false;
    }    
    confirmPasswordRef.current.classList.remove("is-invalid");
    confirmPasswordRef.current.classList.add("is-valid");
    setValid(true);
    return true;
}

const handleSubmit = (event) => {

    const formData = event.currentTarget;
    formData['confirmPassword'].classList.remove("is-valid");
    formData['confirmPassword'].classList.remove("is-invalid");


  if (formData.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  }
  else {

    if (MatchPasswords(event) === false) {
        formData['confirmPassword'].classList.remove("is-valid");
        formData['confirmPassword'].classList.add("is-invalid");
        event.preventDefault();
        event.stopPropagation();
    }
    else 
    {
    console.log("Entering add new user");
    formData['confirmPassword'].classList.remove("is-invalid");
    formData['confirmPassword'].classList.add("is-valid");
    let newUser = {};
    newUser.name = formData['name'].value;
    newUser.username = formData["username"].value;
    newUser.password = formData["password"].value;

    console.log(newUser);
    console.log(JSON.stringify(newUser));
    
    
    fetch('http://localhost:8083/api/users/', {
       method: "POST",
       body: JSON.stringify(newUser),
       headers: { "Content-type": "application/json; charset = UTF-8" }
       })
     .then(response => response.json())
     .then(data => {
        alert('Added new user!'); 
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
        <h4> Register New User </h4>
        <Form id="newUserForm" noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group>
            <Form.Label>Name</Form.Label>    
            <Form.Control type="text" id="name" required name="name"/>
            <Form.Control.Feedback type="invalid">
            Please provide a name.
           </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" id="username" required name="username"/>
            <Form.Control.Feedback type="invalid">
            Please provide a username.
           </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} name="password" required minLength="8"/>
            <Form.Control.Feedback type="invalid">
            Please provide a valid password. Password must be atleast 8 characters. 
           </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" required name="confirmPassword" ref={confirmPasswordRef} onBlur={MatchPasswords}
            isInvalid = {passwordRef.current ? passwordRef.current.value !== confirmPasswordRef.current.value : false}
            isValid = {passwordRef.current ? passwordRef.current.value === confirmPasswordRef.current.value : false}/>
            <Form.Control.Feedback type="invalid">
            Passwords do not match.
           </Form.Control.Feedback>
           </Form.Group>
            <br/>
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
    `   </Col>
        </Row>
        </Container>
    );
}


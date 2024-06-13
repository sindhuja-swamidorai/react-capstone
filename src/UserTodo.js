import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import useFetch from './hooks/UseFetch';
import Details from './Details';
import {Link, useParams, Navigate, useNavigate} from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import { LoadUsers } from './Home';

export default function UserTodo() {
    const {id} = useParams();
    const [priority, setPriority] = useState([]);
    const [users, setUsers] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        setUserId(id);
        let priorityList = [];
        if (localStorage.getItem("High") === "High"){
            priorityList.push("High");
        } 
        if (localStorage.getItem("Medium" === "Medium")){
            priorityList.push("Medium");
        } 
        if (localStorage.getItem("Low") === "Low"){
            priorityList.push("Low");
        } 
        setPriority([...priorityList]);
    },[id])
    /* let fetch_url = `http://localhost:8083/api/users`;

    const {responseData, loading, error } = useFetch(fetch_url);

    //console.log(responseData, loading, error);
    if(error) {
        return <div>error!!</div>
    }

    if (loading) {
        return <div>loading...</div>
    }
    */

    function handleUsers(users) {
        setUsers(users);
    }

    function handleUser(event) {
        setUserId(event.target.value);
        localStorage.setItem("userName", users.find((x) => {return x.id == event.target.value}).name );
        setPriority([]);
    }

    const handlePriority = (event) => {
        const priorityList = [...priority];
        if (event.target.checked) {
            priorityList.push(event.target.value);
            localStorage.setItem(event.target.value, event.target.value);
        }
        else {
            priorityList.pop(event.target.value) 
            localStorage.removeItem(event.target.value);
        }
        setPriority(() => [...priorityList]);
    }
    
    /* if (!loading) {
    //console.log(responseData);
    //let users = [{id: 123},{id: 234}];
    if(responseData) {
    */
    return (
        <Container>
        <div>
            <h4>List User Todo</h4>
            <Form.Label>List my todos:</Form.Label>
            <select name="user" onChange={handleUser}>
            <option value="-1" key={-1}>Select a user</option>    
            <LoadUsers handleUsers={handleUsers}></LoadUsers>
            </select> 
            <br/>
            <label>
                <input type='checkbox' name="priority" value="High" onChange={handlePriority} checked={(priority.length > 0) ? priority.includes("High"): false}/>
                <span style={{backgroundColor: "Coral"}} disabled={true}>High</span>{"  "}
            </label>
            <label>
                <input type='checkbox' name="priority" value="Medium" onChange={handlePriority} checked={(priority.length > 0) ? priority.includes("Medium"): false}/>
                <span style={{backgroundColor: "Orange"}} disabled={true}>Medium</span>{"  "}
            </label>
            <label>
                <input type='checkbox' name="priority" value="Low" onChange={handlePriority} checked={(priority.length > 0) ? priority.includes("Low"): false}/>
                <span style={{backgroundColor: "LightYellow"}} disabled={true}>Low</span>{"  "}
            </label>
            {(userId > 0) && <p>Todos of {localStorage.getItem("userName")}</p>}
            {(userId > 0) && <LoadTodos userId={userId} priority={priority}></LoadTodos>}
        </div>
        </Container>
        )
}



export function LoadTodos(props) {

    const [todos, setTodos] = useState([]);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    let fetch_url = `http://localhost:8083/api/todos/byuser/${props.userId}`;

    const {responseData, loading, error } = useFetch(fetch_url);

    console.log(props);
    
    const handleChange = (event) => {
        const todosList = [...todos];
        if (event.target.checked) {
                todosList.push(event.target.value);
        }
        else {
           todosList.pop(event.target.value) 
        }
        setTodos(() => [...todosList]);
        console.log(todosList);
        console.log(todos);
    }


    function handleSubmit(event) {

        let formData = event.target;

        setProcessing(true);
        event.preventDefault();
        event.stopPropagation();      

        console.log(todos);    

        for (let id of todos) { 
        console.log(id);    
            
        fetch(`http://localhost:8083/api/todos/${todos[0]}`, {
            method: "DELETE",
            })
          .then(response => response.json())
          .then(data => {
             alert(`Deleted todo! with id ${id}`); 
            })
            .catch(error => {
                 alert(`ERROR deleting todo with id ${id}`); 
             })
        }        
        setTodos([]);
        setProcessing(false);
        navigate(`/UserTodo/${props.userId}`);
        //alert('Delete Successful!'); 
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
        <Form id="formInput" name="formInput" onSubmit={handleSubmit}>
        <Row className='justify-content-center'>
        <Table>
        <thead>
            <tr>
                <td>Select</td>
                <td>Category</td>
                <td>Description</td>
                <td>Deadline</td>
                <td>Priority</td>
                <td>Status</td>
            </tr>
        </thead>
        <tbody>
        {responseData.map((todo) => {
            let backgroundColor = "";
            let color = todo.completed ? "green" : "black";
                        switch(todo.priority){
                            case "High":
                                backgroundColor = "Coral"
                                break;
                            case "Medium":
                                backgroundColor = "Orange"
                                break;
                            default:
                                backgroundColor = "LightYellow"
                                break;
                        }   
                return (
                    (props.priority.find( (x) => { 
                        return x === todo.priority;
                    } )) && 
                <tr style={{color: `${color}`}}>
                    <td>
                    <Form.Check 
                    type='checkbox'
                    id={todo.id}
                    name="delBox"
                    value = {todo.id}
                    onChange={handleChange}
                    />
                    </td>
                    <td>{todo.category}</td>
                    <td>{todo.description}</td>
                    <td>{todo.deadline}</td>
                    <td style={{backgroundColor: `${backgroundColor}`}}>{todo.priority}</td>
                    <td style={{color: `${color}`}}>{todo.completed? "Completed": "Pending"}</td>
                    <Link to={`/Details/${todo.id}`}>
                        Edit
                    </Link>
                </tr>
                )
            })}
        </tbody>
        </Table>    
        <Button className='col-md-2' type="submit" name="DELETE" value="DELETE" disabled={processing}>
               DELETE
        </Button>
        </Row>
        </Form>
        )
    }
}
}
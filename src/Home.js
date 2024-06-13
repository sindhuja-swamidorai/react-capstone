import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { useState, useEffect, useMemo } from 'react';
import useFetch from './hooks/UseFetch';
import Details from './Details';
import {Link, useParams, Navigate} from 'react-router-dom';

export default function Home () {
    const {id} = useParams();
    const [priority, setPriority] = useState([]);
    const [userId, setUserId] = useState(null);
    const [category, setCategory] = useState(null);
    const [view, setView] = useState(false);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        setUserId(userId);
        setCategory(category);
    }, [view, userId, category])

    /* if(id) {
        setUserId(id);
    } */

    function handleUsers(users) {
        setUsers(users);
    }

    function handleUser(event) {
        setUserId(event.target.value);
    }

    function handleCategory(event) {
        if (event.target.value == -1) {
            setCategory(null);
        }
        else {
            setCategory(event.target.value);
        }
    }

    const handlePriority = (event) => {
        const priorityList = [...priority];
        if (event.target.checked) {
            priorityList.push(event.target.value);
        }
        else {
            priorityList.pop(event.target.value) 
        }
        setPriority(() => [...priorityList]);
    }

    return (
        <Container className='home'>
        <Row className='row1'>
        <div>
            <h2>
            <p>Stay Organized</p>
            An easy and simple way to manage your Todos 
            </h2>
        </div>
        </Row>
        <Row className='row2'>
        <div>
            <h4> View todos by user </h4>
            <select name="user" onChange={handleUser} disabled={view}>
            <option value="-1" key={-1}>All Users</option>    
            <LoadUsers handleUsers={handleUsers}></LoadUsers>
            </select> 
        </div>
        </Row>
        <Row className='row3'>
        <div>
            <br/>
            <h4> View todos by category </h4>
            <select name="category" onChange={handleCategory} disabled={view}>
            <option value="-1" key={-1}>All Categories</option> 
            <LoadCategories></LoadCategories>   
            </select> 
        </div>
        </Row>
        <Row className='row4'>
        <div>
            <br/>
            <h4> Filter todos by priority </h4>
            <label>
                <input type='checkbox' name="priority" value="High" onChange={handlePriority} checked={priority ? priority.includes("High"): false}/>
                    High
            </label>
            <label>
                <input type='checkbox' name="priority" value="Medium" onChange={handlePriority} checked={priority ? priority.includes("Medium"): false}/>
                    Medium
            </label>
            <label>
                <input type='checkbox' name="priority" value="Low" onChange={handlePriority} checked={priority ? priority.includes("Low"): false}/>
                Low
            </label>
            <br/>
            <Button variant="outline-primary" className='col-2' onClick={() => { setView(!view); if (view) setPriority([]); } }>
                {(!view) ? "Quick View": "Toggle View"}
            </Button>
        </div>
        <Row>
        <div>
            {view && <LoadTodos userId={userId} priority={priority} category={category} usersList={users}></LoadTodos>}
        </div>
        </Row>
        </Row>
        </Container>
        )
}


export function LoadTodos(props) {

    let fetch_url = `http://localhost:8083/api/todos/`;
    
    if (props.userId) {
            fetch_url = `http://localhost:8083/api/todos/byuser/${props.userId}`;
    }

    const {responseData, loading, error } = useFetch(fetch_url);
    
    //console.log(props);

    if(responseData) {
        let allPrioriries = ["High", "Medium", "Low"];
        let selectedPriorities = allPrioriries.map((x) => {
            return Boolean(props.priority.find((y) => x === y))
        })
        let summary = {};
        let pending = {};
        for (let x of allPrioriries) {
            let data = responseData.filter((y) => (y.priority === x) && (props.category ? y.category == props.category : true));
            let dataPending = responseData.filter((y) => (y.priority === x) && (props.category ? (y.category == props.category) : true) && (y.completed === false));
            summary[x] = data.length;
            pending[x] = dataPending.length;
            //console.log("Summary" + summary);
            //console.log("Pending" + pending);
        }

        //console.log("Selected Priorities :" + selectedPriorities);
        return (
        <div>
            {<p>
             {'Total: '}{(selectedPriorities[0] ? summary["High"] : 0) + 
                        (selectedPriorities[1] ? summary["Medium"] : 0) + 
                        (selectedPriorities[2] ? summary["Low"] : 0 )}
             {' Pending: '}{(selectedPriorities[0] ? pending["High"] : 0) + 
                        (selectedPriorities[1] ? pending["Medium"] : 0) + 
                        (selectedPriorities[2] ? pending["Low"] : 0 )}
             {(selectedPriorities[0] ? " High: " + pending["High"] : "")}
             {(selectedPriorities[1] ? " Medium: " + pending["Medium"] : "")}
             {(selectedPriorities[2] ? " Low: " + pending["Low"] : "")}
            </p>
            }
        <Table striped bordered>
        <thead>
            <tr key={-1}>
                <td>User</td>
                <td>Category</td>
                <td>Description</td>
                <td>Deadline</td>
                <td>Priority</td>
                <td>Status</td>
            </tr>
        </thead>
        <tbody>
        {responseData.map((todo) => {
                let user = props.usersList.find((x) => { return x.id == todo.userid});
                //console.log("User: " + user);
                return (
                    (props.priority.find( (x) => { 
                        return x === todo.priority && (props.category ? todo.category == props.category : true);
                    } )) && 
                <tr key={todo.id}>
                    <td>
                        {user.name}
                    </td>
                    <td>{todo.category}</td>
                    <td>{todo.description}</td>
                    <td>{todo.deadline}</td>
                    <td>{todo.priority}</td>
                    <td>{todo.completed? "Completed": "Pending"}</td>
                </tr>
                )
            })}
        </tbody>
        </Table>
        </div>    
        )
    }
}

export function LoadUsers({handleUsers}) {
    let fetch_url = `http://localhost:8083/api/users`;

    const {responseData, loading, error } = useFetch(fetch_url);

    useEffect(() => {
        handleUsers(responseData);
    }, [responseData, handleUsers]);

    //console.log(responseData, loading, error);
    if(error) {
        return "error!!"
    }

    if (loading) {
        return "loading..."
    }
    if (responseData) {
            return (
                responseData.map((user) => <option value={user.id} key={user.id}>{user.name}</option>)
            )    
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

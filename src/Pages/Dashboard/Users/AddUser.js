import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { Axios } from "../../../Api/axios";
import { USER } from "../../../Api/Api";
import LoadingSubmit from "../../../Component/Loading/Loading";



export default function AddUser(){
    
    const [name,setName]=useState('')
    const [role,setRole]=useState('');
    const [email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[Loading,setLoading]=useState(false);
    // const[created_at,setCreated_at]=useState('')
    
  
    async function HandleSubmit(e){

        setLoading(true);
        e.preventDefault();
        try{
           await Axios.post(`${USER}/add`,{
                name:name,
                email:email,
                password:password,
                role:role,
                
            });
            window.location.pathname='/dashboard/users'
        }catch(err){
            setLoading(false);
            console.log(err)
        }
    }
    return(
      <>
            {Loading  && <LoadingSubmit />}
        <Form  className="bg-white w-100" onSubmit={HandleSubmit} >
       
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>User Name:</Form.Label>
                <Form.Control 
                required               
                value={name}
                onChange={(e)=>setName(e.target.value)}                  
                 type="text" 
                 placeholder="Name ..." />
           </Form.Group>
           <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label>Email:</Form.Label>
                <Form.Control                
                value={email}
                onChange={(e)=>setEmail(e.target.value)}                
                 type="email" placeholder="Email ..." />
           </Form.Group>
           <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label>password:</Form.Label>
                <Form.Control                
                value={password}
                onChange={(e)=>setPassword(e.target.value)}                
                 type="password" placeholder="password ..." />
           </Form.Group>

           <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label>Role:</Form.Label>
                <Form.Select                
                value={role}
                onChange={(e)=>setRole(e.target.value)}                
              >
                <option disabled value=''>Select Role</option>
                <option value='1995'>Admin</option>
                <option value='2001'>User</option>
                <option value='1996'>Writer</option>
                <option value='1999'>Product Manger</option>
                </Form.Select>
           </Form.Group>
         
            
        
            <button disabled={name.length>1 && 
                email.length>1 &&
                password.length>1 && 
                role !=='' ? false:true} className="btn btn-primary">Save</button>
          
              
    
    </Form>
      </>
    )
}
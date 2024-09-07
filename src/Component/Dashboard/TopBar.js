import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Menu } from "../../Context/MenuContext";
import { LOGOUT, USER } from "../../Api/Api";
import { Axios } from "../../Api/axios";
import { useNavigate } from "react-router-dom";
import Cookie from 'cookie-universal' ;
import { Dropdown, DropdownButton } from "react-bootstrap";
export default function TopBar(){

    const menu=useContext(Menu);
    const setisOpen=menu.setisOpen;
    
    const[name,setName]=useState('');

    const Navigate=useNavigate();
    const cookie=Cookie();
    useEffect(()=>{
        Axios.get(`/${USER}`)
        .then(data=>setName(data.data.name))
        // .catch(()=>Navigate('/login',{replace:true}))
        .catch(<Navigate to={'/login'} replace={true}/>)
    },[])

   

    async function handleLogout(){
        try{
            await Axios.get(`/${LOGOUT}`);         
         window.location.pathname='/login'
         cookie.remove('e-commerce');
        }
        catch(err){
            console.log(err)
        }
    
        }
   
    return (
       
        <div className="top-bar ">
           <div className="d-flex align-items-center justify-content-between h-100 flex-wrap"> 
           <div className="d-flex align-items-center gap-4 ">
               <h5>E-Commerce</h5>
                <FontAwesomeIcon
                onClick={()=>setisOpen(prev =>!prev)} 
                cursor={'pointer'}
                icon={faBars} />
            </div>
              <div>
                <DropdownButton id='dropdown-basic-button'title={name}>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    
                </DropdownButton>
              
                  

              </div>
           </div>
        </div>
    )
    
}

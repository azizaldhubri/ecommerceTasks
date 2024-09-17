import { useEffect, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import { Axios } from "../../../Api/axios"

import {  USER, USERS } from "../../../Api/Api"
import TranFormDate from "../../../Helpers/TranFormDate";
import { Link, useNavigate } from "react-router-dom";
// import TranFormDate from "../../Helpers/TranFormDate";


export default function AddTaskes(){
    const navigate=useNavigate();
    const[start_task,setStart_task]=useState(TranFormDate(new Date()));
    const[endtask,setEndtask]=useState(TranFormDate(new Date()));
    
    const today = new Date().toISOString().split('T')[0];


  
    const[id,setId]=useState('');   
    const[sender_name,setSender_name]=useState('');
     const[receivertask_id,setReceivertask_id]=useState('');
     const[typetask,setTypetask]=useState('General');
 
    const[description,setDescription]=useState('');
    const[users,setUsers]=useState([]);


    const[filesdata,setFilesdata]=useState([]);
 
   

    const focus=useRef('');   
    const openImage=useRef(null);
   
   
       // handle focus
    useEffect(()=>{     
     focus.current.focus();
    },[]);

    
    useEffect(()=>{
        try{
            Axios.get(`${USERS}`)
            .then(e=>{
                setUsers(e.data.data);                           
                                    })
        }
        catch(err){console.log(err)}
    },[])

    // setSelect_user(users);

    useEffect(()=>{
        try{
            Axios.get(`${USER}`)
            .then(e=>{
                setId(e.data.id);                
                setSender_name(e.data.name);                
                          })
        }
        catch(err){console.log(err)}
    },[])



    
// handlechange files
function handlechangefile(e){
    setFilesdata((prev)=>[...prev,...e.target.files]);
}
    
    // --------------handleSubmite---------------
    
    async function handlesubmit(e){
        e.preventDefault();      
       
       
        const formData = new FormData();
        formData.append('sender_id', id);
        formData.append('sender_name', sender_name);
        formData.append('id_receiver', receivertask_id);
        formData.append('receiver_name', receiver_name);
        formData.append('task_status','To Do' );
        formData.append('task_type', typetask);
        formData.append('description', description);
        formData.append('start_task', start_task);
        formData.append('end_task', endtask);    
    
        // إضافة الملفات إلى formData
        for (let i = 0; i < filesdata.length; i++) {
          formData.append('files[]', filesdata[i]);
        }
     
        // console.log(...formData)
        try{        
           await Axios.post('tasks/add',formData )
             window.location.pathname='/dashboard/taskes' 
           // navigate('/dashboard/taskes');        
          }
          catch (error) {
            console.error('Error sending data:', error);
          }
           
    }

    const selectUser=users.map((item,index)=>(            
         <option key={index} value={item.id}  >{item.name}</option>        
        ))
   
        let receiver_name='' ;
    {receivertask_id &&(
         users.map((item,index)=>(                       
            item.id ==receivertask_id &&
            (receiver_name=item.name)        
       ))
    ) }             
        function HandleCansleFiles(id){
            setFilesdata((prev)=>prev.filter(img=>img !==id)) ;            
        }

        function handleOpenImage(){
            openImage.current.click()      
          }

    return(
        <div className=" w-100  ">
            <h5 className="mt-2 d-flex py-3 px-2">
                Add  New Taskes 
                </h5>
            
            <div className=" w-100  d-flex align-items-center justify-content-start mt-2">
                <Form onSubmit={handlesubmit}
                className=" d-flex ms-2 w-100 flex-column"
                encType="multipart/form-data">
                  
                    <fieldset>
                    <Form.Group className="mt-3 d-flex gap-3">                   
                        <Form.Check
                        type="radio"
                        label="General task"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios1"
                        value={1}
                        onChange={()=>setTypetask('General task')}
                        defaultChecked 
                        />
                        <Form.Check
                        type="radio"
                        label="Financial"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios2"
                        value={2}
                        // onChange={e=>setTypetask(e.target.value)}
                        onChange={()=>setTypetask('Financial')}
                        />
                        <Form.Check
                        type="radio"
                        label="Personal task"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios3"
                        value={3}
                        onChange={()=>setTypetask('Personal task')}
                        />
                        <Form.Check
                        type="radio"
                        label="Administrative "
                        name="formHorizontalRadios"
                        id="formHorizontalRadios4"                       
                        value={4}
                        onChange={()=>setTypetask('Administrative')}                       
                        />
                    {/* </Col> */}
                    </Form.Group>
                    </fieldset>                   
                   
                    <Form.Group className="mt-3" >
                    <Form.Label className="mt-0 "htmlFor="basic-url">Description</Form.Label>      

                       <Form.Control as="textarea" aria-label="With textarea"
                       value={description}
                       onChange={e=>setDescription(e.target.value)}
                       placeholder="Description"
                       >
                       </Form.Control>
                    </Form.Group>
                                   
                  
                    <Form.Group className="mt-3 mb-3  d-flex flex-wrap  gap-5">
                    <fieldset className=" d-flex align-items-center">   
                    <Form.Label>Start_task</Form.Label>
                        <Form.Control className="m-0  ms-2 w-75 "
                            type="date"
                            name="start_task"
                            value={start_task}                            
                            onChange={(e)=>{setStart_task(e.target.value);
                                (e.target.value>endtask) &&  setEndtask(e.target.value)
                            }}
                            min={today}
                            >
                        </Form.Control>            
                        </fieldset>                        
                        <fieldset className=" d-flex align-items-center">  
                      <Form.Label>End_task</Form.Label>
                        <Form.Control className="m-0  ms-2 w-70"
                            type="date"
                            name="end_task"
                            value={endtask}                           
                            onChange={(e)=>setEndtask(e.target.value)}
                            min={start_task}

                             >
                        </Form.Control> 
                        </fieldset>             
                                                
                    </Form.Group>  
                   
                    <Form.Group  className="d-flex  gap-2">
                            <Form.Select style={{width:'30%'}}
                            value={receivertask_id}                       
                            onChange={(e)=>{
                                setReceivertask_id(e.target.value);                           
                            }}
                            >
                                <option  disabled value={''}>Select User</option>
                                {selectUser}
                            </Form.Select>
                        
                        </Form.Group>

                        <Form.Group className="  pt-2 ">
                            <Form.Control 
                            ref={openImage}
                            hidden
                            type="file"
                            multiple
                            onChange={handlechangefile}
                            >
                            </Form.Control>
                        </Form.Group>   
                </Form>

            </div> 
            <div 
           onClick={handleOpenImage}>
            <button 
             className=" cursor-pointer border-0 bg-white  text-primary ">+Add Files:</button> 
        </div>           
                <div className=" border mt-3 bg-white d-flex gap-2 ">
                    {filesdata && filesdata.map((item,i)=>(
                         <div key={i} className="  position-relative ">
        
                         <div className="d-flex align-items-center justify-content-start pt-3 ">
                         {(item.type=='image/jpeg' || item.type=='image/png') ?
                          <div className="d-flex align-items-center justify-content-start flex-column">
                             <img  src={URL.createObjectURL(item)} width='35px'  alt="" ></img>
                             <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                         </div>
                        :(item.type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'? 
                            <div className="d-flex align-items-center justify-content-start flex-column">
                            <img src={require('../../../Assets/files/doc.png')} width='35px'  alt=" img product"></img>
                            <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                             </div>
                        :(item.type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'? 
                            <div className="d-flex align-items-center justify-content-start flex-column">
                            <img src={require('../../../Assets/files/excel.jpg')} width='35px' height='35px' alt=" img product"></img>
                            <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                            </div>
                        :(item.type=='application/pdf'?
                            <div className="d-flex align-items-center justify-content-start flex-column">
                            <img src={require('../../../Assets/files/pdf.png')} width='35px' height='35px'alt=" img product"></img>
                            <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                            </div>
                             :(item.type=='application/x-zip-compressed'&&
                                <div className="d-flex align-items-center justify-content-start flex-column">
                                <img src={require('../../../Assets/files/rar.jpg')} width='35px' height='35px' alt=" img product"></img>
                                <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                                </div>
                            ) )))  }
                         </div>  
                         <div style={{cursor:"pointer"}}
                         className="position-absolute  top-0 end-0 bg-danger rounded text-white">
                             <p className="py-1 px-2 m-0" onClick={()=>HandleCansleFiles(item)}>
                                 x
                             </p>
                         </div>         
                       
                        </div>
                      
                    ))
                    }
                </div>
                <div className="w-100 d-flex justify-content-center gap-3 mt-2 ">   
                {/* <button className="btn btn-primary  " disabled ={receiver_name && description ? false:true }>Add</button>     */}
                  <button ref={focus}  className="border-0 bg-white fs-4 "
                  onClick={handlesubmit}
                  disabled ={receiver_name && description ? false:true}
                  style={{color:description ? '#E41B17':'	#FBBBB9' }}
                  >Save</button> 
                  <Link to='/dashboard/taskes'
                  className="border-0 bg-white fs-4 text-danger">Cancle</Link>     
               </div>
    
        </div>
    )
}

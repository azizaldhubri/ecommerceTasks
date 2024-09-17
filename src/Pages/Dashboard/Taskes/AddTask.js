import { useEffect, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import { Axios } from "../../../Api/axios"
import {  USER, USERS } from "../../../Api/Api"
import TranFormDate from "../../../Helpers/TranFormDate";
import { Link, useNavigate } from "react-router-dom";

export default function AddTaskes(){
    const navigate=useNavigate();   
    
    const today = new Date().toISOString().split('T')[0];       
    const todayDate=TranFormDate(new Date());    
    const[users,setUsers]=useState([]);
    const[filesdata,setFilesdata]=useState([]);
    const [message, setMessage] = useState("");

  // تحديث الرسالة عند الضغط على الزر
  const handleClick = () => {
    setMessage("عنوان المهمة او اسم المسستقبل غير موجود ");
  };

    const focus=useRef('');   
    const openImage=useRef(null);
    const[form,setForm]=useState({
        id_receiver:'Select User',
        description:'',
        task_type:'General task',
        sender_name:'',
        sender_id:''  ,
        receiver_name:'',
        task_status:'To Do',
        start_task:todayDate  ,
        end_task:todayDate
        
     }) 
   
       // handle focus
    useEffect(()=>{     
     focus.current.focus();
    },[]);

    
    useEffect(()=>{
        try{
            Axios.get(`${USERS}`)
            .then(e=>{setUsers(e.data.data);})
        }
        catch(err){console.log(err)}
    },[])



    // setSelect_user(users);

    useEffect(()=>{
        try{
            Axios.get(`${USER}`)
            .then(e=>{
                setForm((prevData) => ({
                    ...prevData,
                    sender_name: e.data.name,
                    sender_id: e.data.id,                    
                  })); 
                                      
                          })
        }
        catch(err){console.log(err)}
    },[])


  function handleChange (e){
        
        setForm({...form,[e.target.name]: e.target.value});       
         }
    
// handlechange files
function handlechangefile(e){
    setFilesdata((prev)=>[...prev,...e.target.files]);
}
    
    // --------------handleSubmite---------------
    
    async function handlesubmit(e){
        e.preventDefault();   
   
        const formData = new FormData();
        formData.append('sender_id', form.sender_id);
        formData.append('sender_name', form.sender_name);
        formData.append('id_receiver', form.id_receiver);
        formData.append('receiver_name', form.receiver_name);
        formData.append('task_status',form.task_status );
        formData.append('task_type', form.task_type);
        formData.append('description',form.description);
        formData.append('start_task', form.start_task);
        formData.append('end_task', form.end_task);    
       
        // إضافة الملفات إلى formData
        for (let i = 0; i < filesdata.length; i++) {
            formData.append('files[]', filesdata[i]);
        }     
        try{                  
           await Axios.post('tasks/add',formData )             
           navigate('/dashboard/taskes');        
          }
          catch (error) {
            console.error('Error sending data:', error);
          }
           
    }

    const selectUser=users.map((item,index)=>(            
         <option key={index} value={item.id}  >{item.name}</option>        
        ))
   
        // let receiver_name='' ;
    {form.id_receiver &&(
         users.map((item,index)=>(                       
            item.id ==form.id_receiver &&
            (form.receiver_name=item.name)        
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
                        name="task_type"                                                 
                        value="General task"
                        checked={form.task_type === 'General task'}                       
                        onChange={handleChange}
                        defaultChecked 
                                 
                        />
                        <Form.Check
                        type="radio"
                        label="Financial"
                        name="task_type"                        
                        value='Financial'
                        checked={form.task_type === 'Financial'}   
                        onChange={handleChange}                        
                        />
                        <Form.Check
                        type="radio"
                        label="Personal task"
                        name="task_type"                        
                        value='Personal task'
                        checked={form.task_type === 'Personal task'}                        
                        onChange={handleChange}
                        />
                        <Form.Check
                        type="radio"
                        label="Administrative "
                        name="task_type"                                         
                        value='Administrative'                       
                        checked={form.task_type === 'Administrative'}                        
                        onChange={handleChange}                    
                        />
                    
                    </Form.Group>
                    </fieldset>                   
                   
                    <Form.Group className="mt-3" >
                    <Form.Label className="mt-0 "htmlFor="basic-url">Description</Form.Label>
                    <Form.Control as="textarea" aria-label="With textarea"
                       name="description"
                       value={form.description}            
                    onChange={handleChange}
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
                            value={form.start_task}   
                            onChange={handleChange}                          
                            min={today}
                            >
                        </Form.Control>            
                        </fieldset>                        
                        <fieldset className=" d-flex align-items-center">  
                      <Form.Label>End_task</Form.Label>
                        <Form.Control className="m-0  ms-2 w-70"
                            type="date"
                            name="end_task"
                            value={form.start_task>form.end_task ?form.start_task:form.end_task}                           
                            onChange={handleChange}
                            min={form.start_task}
                             >
                        </Form.Control> 
                        </fieldset>                                                
                    </Form.Group>  
                   
                    <Form.Group  className="d-flex  gap-2">
                            <Form.Select style={{width:'30%'}}
                            name="id_receiver"                             
                            value={form.id_receiver}                       
                            onChange={handleChange}                           
                            >
                                <option  disabled >Select User</option>
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
                  <button ref={focus}  className="border-0 bg-white fs-4 text-danger"                
                  onClick={(form.receiver_name && form.description) ?handlesubmit:handleClick}                   
                  >Save</button> 

                  <Link to='/dashboard/taskes'
                  className="border-0 bg-white fs-4 text-danger">Cancle</Link>                        
               </div>
               <div className="w-100 d-flex -align-items-center justify-content-center fs-5 text-danger">
                
               {message && <p>{message}</p>}
               </div>                              
    
        </div>
    )
}

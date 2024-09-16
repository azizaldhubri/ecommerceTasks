import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Axios } from "../../../Api/axios";
import { USER, USERS } from "../../../Api/Api";
import TransformTime from "../../../Helpers/TransformTime";
import TranFormDate from "../../../Helpers/TranFormDate";
import File_Name from "../../../Helpers/File_Name";
import File_Path from "../../../Helpers/File_path";

export default function ChiledTask(){
    const {id}=useParams();
    const[refresh,setrefresh]=useState(0)
   
    const[title,setTitle]=useState('');
    const[name_sender,setName_sender]=useState('');
    const[id_senderTask,setId_senderTask]=useState('');
    const[senderTask,setSenderTask]=useState('');
 
    const[id_receiver,setId_receiver]=useState('');
    const[id_sender,setId_sender]=useState('');
    const[tasks,setTasks]=useState([])
   
    const [isopen, setIsopen] = useState(false)
    const[task_status,setTask_status]=useState('');
     const[users,setUsers]=useState([]);
     const[filesdata,setFilesdata]=useState([]);

     const[Loading,setLoading]=useState(false);
   
       const[start_task,setStart_task]=useState(TranFormDate(new Date()));
    const[endtask,setEndtask]=useState(TranFormDate(new Date()));

    const today = new Date().toISOString().split('T')[0];

    const startDate = new Date(start_task);
  const endDate = new Date(endtask);

    const timeDifference = endDate - startDate;
    // تحويل الفرق من مللي ثانية إلى أيام
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      const focus=useRef('');   
    const openImage=useRef(null);   

    
    //-----------------------------------

     useEffect(()=>{
        Axios.get(`${USERS}`)
        .then((e)=>setUsers(e.data.data))
     },[])

     useEffect(()=>{
        Axios.get(`${USER}`)
        .then((e)=>{
          setName_sender(e.data.name);
          setId_sender(e.data.id);
          
        
        })
     },[])
 
     const selectUser=users.map((item,index)=>(            
      <option key={index} value={item.id}  >{item.name}</option>        
     ))
    
     let receiver_name='' ;
    {id_receiver &&(
      users.map((item,index)=>(                       
         item.id ==id_receiver &&
         (receiver_name=item.name)        
    ))
    ) }

     function getFirstLetter(word) {
      return word.charAt(0).toUpperCase();
    };
 
  
    //-----------------
    useEffect(()=>{
      async function gettask(){
      try{    Axios.get(`tasks/${id}`)
          .then(e=>{
            setTasks(e.data);
            setStart_task(e.data.start_task)
            setEndtask(e.data.end_task);
            setTask_status(e.data.task_status)
            setId_senderTask(e.data.sender_id)
            setSenderTask(e.data.sender_name)            
         setLoading(false);
            })                             
      }
      catch(err){console.log(err)}
  }
  gettask();

  },[refresh])  

       //-----------------------------------------------------------------------------------
      async function handlesubmit(e){
        e.preventDefault();       
       
        const formData = new FormData();
        formData.append('task_id', id);
        formData.append('id_sender', id_sender);
        formData.append('name_sender', name_sender);
        formData.append('id_receiver', id_receiver ?id_receiver:id_senderTask);
        formData.append('name_receiver', receiver_name?receiver_name:senderTask);      
        formData.append('title', title);
     
    
        // إضافة الملفات إلى formData
        for (let i = 0; i < filesdata.length; i++) {
          formData.append('files[]', filesdata[i]);
        }
     
        // console.log(...formData)
        try{        
            await Axios.post('chiled_task/add',formData )            
            setrefresh(prev=>prev+1);  
            setTitle('');
            setId_receiver('')   ;   
            setIsopen(false);
            setFilesdata('') ; 
            if(task_status==='To Do') 
             { setTask_status('In_progress')    ;
               Axios.put(`tasks/status_update/${id}`,{ status: 'In_progress' }) ;   
              }
          }
          catch (error) {
            console.error('Error sending data:', error);
          }
     
    }  

        //  function handel change status task
const handleOptionChange =async (e) => {  
    setTask_status(e.target.value);
   const status=e.target.value; 
  try{        
     await Axios.put(`tasks/status_update/${id}`,{ status: status }) ;
        setrefresh(perv=>perv+1) 
  }
  catch (error) {
    console.error('Error sending data:', error);
  }
};
    
    function handlechangefile(e){
      setFilesdata((prev)=>[...prev,...e.target.files]);
    }
    
    //-------------------------------------------------------------------------------------


             
 function HandleCansleFiles(id){
     setFilesdata((prev)=>prev.filter(img=>img !==id)) ;            
 }

    //handle open image
    function handleOpenImage(){
      openImage.current.click()      
    }
 
    return(
      <>
      
      {/* {Loading  && <LoadingSubmit />} */}
  <div className="w-100  py-4 px-4 d-flex justify-content-center bg-white ">
    <div className="w-75  "> 
        <div className=" w-100 d-flex justify-content-between ">
            <div className=" w-100 d-flex gap-3">
            <p className="mb-4 text-danger">Taske Work {id}</p>
            <div className=" gap-3 d-flex">
              <p className="m-0">Task duration:</p>
              <p className="m-0 ms- -1">{daysDifference} days</p>
            </div>
            <p>{tasks.task_status}</p>

            </div>
            <Link to='/dashboard/taskes' className="ms-100">Back</Link>
        </div>              
        <div className="border px-3 py-3 rounded">
        {tasks.sender_name &&
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex justify-content-center align-items-center ">
              <p className=" m-0  fs-5  border rounded-circle d-flex justify-content-center align-items-center"                 
              style={{width:'40px',height:'40px',background:'#98AFC7'}}>{getFirstLetter(tasks.sender_name) } </p>
          
              <p className=" m-0 ms-2 fs-5">{tasks.sender_name} for { tasks.receiver_name}</p>
          </div>
        <p className=" m-0">{TransformTime(tasks.created_at)}</p>
      </div>
            } 

          <p className="w-100  m-0 mt-2 ms-3">{tasks.description}</p>
          <div className=" gap-3 ">
        
            <p className="m-0 mt-1  text-danger fs-6">Change Task_status</p>
            <fieldset style={{cursor:"pointer"}} >
                  <Form.Group className=" mt-2 mb-0 d-flex gap-2 flex-wrap border px-1 py-1 " 
                  style={{fontSize:'13px'}}>               
                      <Form.Check  style={{cursor:"pointer"}}
                      type="radio"
                      label="To Do"
                      value="To Do"
                        checked={task_status === 'To Do'}                       
                      onChange={handleOptionChange}
                      disabled
                      />
                      <Form.Check style={{cursor:"pointer"}}
                      type="radio"
                      label="In_progress"
                      value="In_progress"
                        checked={task_status === 'In_progress'}                       
                      onChange={handleOptionChange}
                      />
                      <Form.Check style={{cursor:"pointer"}}
                      type="radio"
                      label="Completed"
                      value="Completed"
                        checked={task_status === 'Completed'}
                       
                      onChange={handleOptionChange}
                      />
                      <Form.Check style={{cursor:"pointer"}}
                      type="radio"
                      label="Deferred"
                      value="Deferred"
                        checked={task_status === 'Deferred'}
                        onChange={handleOptionChange}
                    
                      />
                      <Form.Check style={{cursor:"pointer"}}
                      type="radio"
                      label="Cancelled"
                      value="Cancelled"
                        checked={task_status === 'Cancelled'}
                      
                      onChange={handleOptionChange}
                      />
                      <Form.Check style={{cursor:"pointer"}}
                      type="radio"
                      label="In_Review"
                      value="In_Review"
                        checked={task_status === 'In_Review'}
                      onChange={handleOptionChange}
                    
                      />                       
                  
                  </Form.Group>
                  </fieldset>              
            
          </div>
          <div className="d-flex flex-column">
            <div>

          <div className=" d-flex  flex-wrap  py-1 px-1 mb-2">
          {tasks.file_paths && tasks.file_paths.map((file,index)=>
          
          
          <div key={index} className=" d-flex gap-2 flex-column   w-100 "style={{width:'100px'}}> 
          <p className="m-0   ">Files</p>
          <div className=" d-flex gap-3   py-1  flex-wrap border ">
            {(file.split('.').pop())==='jpg' ||(file.split('.').pop())==='png' 
            ||(file.split('.').pop())==='jfif'||(file.split('.').pop())==='JPG'?
                    <div className=" d-flex gap-2 align-items-center justify-content-center  flex-column" >
                      <img key={index} src={`https://free-001.yemenhosting.com/storage/app/public/assets/${file}`} width='60px'height='60px' alt="img"></img>                   
                      <p className="m-0">{File_Name(file,index)}</p>
                      {/* <a  href={`https://free-001.yemenhosting.com/api/storage/${file}`} >Download</a>  */}
                      <a className="fs-6"  href={`https://free-001.yemenhostingyyyy.com/storage/app/public/assets/download/${File_Path(file,index)}`} >Download</a>
                  </div>
                  
                  :(file.split('.').pop())==='docx'?(
                    <div className=" d-flex gap-2 align-items-center justify-content-center flex-column " > 
                        <img src={require('../../../Assets/files/doc.png')} width='60px' height='60px' alt="docs"></img>
                        <p className="m-0">{File_Name(file,index)}</p>
                        <a  href={`https://free-001.yemenhosting.com/storage/${file}`} >Download</a>  
                    </div> )
                  
                  :(file.split('.').pop())==='pdf'?
                  <div className=" d-flex gap-2 align-items-center justify-content-center  flex-column" >
                    <img src={require('../../../Assets/files/pdf.png')} width='50px' height='60px' alt="docs"></img>
                    <p className="m-0">{File_Name(file,index)}</p>
                        <a  href={`https://free-001.yemenhosting.com/api/download/${File_Path(file,index)}`} >Download</a> 
                  </div>
                  :(file.split('.').pop())==='xlsx'?
                  <div className=" d-flex gap-2 align-items-center justify-content-center  flex-column" > 
                    
                    <img src={require('../../../Assets/files/excel.jpg')} width='35px' height='35px' alt="docs"></img>
                    
                    <h6  className="m-0 " style={{fontSize:'14px'}}>{File_Name(file,index)}</h6>
                        <a    href={`https://free-001.yemenhosting.com/api/download/${File_Path(file,index)}`} >
                        <h6 className="m-0" style={{fontSize:'12px'}}>Download</h6></a> 
                  </div>
                  :(file.split('.').pop())==='zip'?
                  <div className=" d-flex gap-2 align-items-center justify-content-center  flex-column" >
                    <img src={require('../../../Assets/files/rar.jpg')} width='80px' height='60px' alt="docs"></img>
                    <p className="m-0"style={{fontSize:'12px'}}>{File_Name(file,index)}</p>
                        <a  href={`http://127.0.0.1:8000/api/download/${File_Path(file,index)}`} >
                        <h6 className=""        style={{fontSize:'10px'}}>Download</h6></a> 
                  </div>
                  
                :(file.split('.').pop())}
            </div>
              </div>
              ) }

          </div>

          </div>
            <div >
                  {tasks.comments && tasks.comments.map((it,index)=>
              <div key={index} className="border-bottom  mb-2">
                  <div className="d-flex justify-content-between align-items-center  ">
          
          <div className="d-flex justify-content-center align-items-center ">
              <p className=" m-0    border rounded-circle d-flex justify-content-center align-items-center"                 
              style={{width:'30px',height:'30px',background:'#98AFC7'}}>{getFirstLetter(it.name_sender) } </p>
          
              <p className=" m-0 ms-2 fs-5">{it.name_sender} for { it.name_receiver}</p>
          </div>
          <p className=" m-0">{TransformTime(it.created_at)}</p>
        </div>
              <p className="m-0 d-flex ms-3 me-2 ">{it.title}</p>
              {  it.file_paths.length>0 &&
              <div className=" d-flex gap-3   py-1 px-1 flex-column">
                <p className="m-0 mb-1  ">Files:</p>
                  {  it.file_paths && it.file_paths.map((item,i)=>            
                      <div key={i} className=" d-flex  flex-wrap  gap-3 align-items-center justify-content-center  "style={{width:'100px'}}> 
                      
                          {item.split('.').pop()==='jpg' ||(item.split('.').pop())==='png'
                          ||(item.split('.').pop())==='jfif' ||(item.split('.').pop())==='JPG'?
                                <div className=" d-flex gap-2 align-items-center justify-content-center  flex-column" >
                                  <img key={i} src={`https://free-001.yemenhostingddddd.com/storage/${item}`} width='60px'height='60px' alt="img"></img>                   
                                {/* <p className="m-0 fs-6">{FileName(item)} {nameFile2[i]}</p> */}
                                <p className="m-0 fs-6">{File_Name(item,i)} </p>
                                    {/* <a  href={`https://free-001.yemenhosting.com/storage/${file}`} >Download</a>  */}
                                    <a className="fs-6"  href={`https://free-001.yemenhostingdddddd.com/download/${File_Path(item,i)}`} >Download</a>
                              </div>
                                
                                :(item.split('.').pop())==='docx'?(
                                  <div className=" d-flex gap-2 align-items-center justify-content-center flex-column " > 
                                    <img src={require('../../../Assets/files/doc.png')} width='60px' height='60px' alt="docs"></img>
                                    <p className="m-0">{File_Name(item,i)}</p>
                                    <a  href={`http://127.0.0.1:8000/storage/${item}`} >Download</a>  
                                  </div> )
                              
                                :(item.split('.').pop())==='pdf'?
                                <div className=" d-flex gap-2 align-items-center justify-content-center  flex-column" >
                                  <img src={require('../../../Assets/files/pdf.png')} width='50px' height='60px' alt="docs"></img>
                                  <p className="m-0">{File_Name(item,i)}</p>
                                    <a  href={`http://127.0.0.1:8000/api/download/${File_Path(item,i)}`} >Download</a> 
                                </div>
                                :(item.split('.').pop())==='xlsx'?
                                <div className=" d-flex gap-2 align-items-center justify-content-center  flex-column" > 
                                  <img src={require('../../../Assets/files/excel.jpg')} width='35px' height='35px' alt="docs"></img>
                                  <h6  className="m-0 " style={{fontSize:'14px'}}>{File_Name(item,i)}</h6>
                                    <a    href={`http://127.0.0.1:8000/api/download/${File_Path(item,i)}`} >
                                    <h6 className="m-0" style={{fontSize:'12px'}}>Download</h6></a> 
                                </div>
                                :(item.split('.').pop())==='zip'?
                                <div className=" d-flex gap-2 align-items-center justify-content-center  flex-column" >
                                  <img src={require('../../../Assets/files/rar.jpg')} width='80px' height='60px' alt="docs"></img>
                                  <p className="m-0"style={{fontSize:'12px'}}>{File_Name(item,i)}</p>
                                    <a  href={`http://127.0.0.1:8000/api/download/${File_Path(item,i)}`} >
                                    <h6 className=""        style={{fontSize:'10px'}}>Download</h6></a> 
                                </div>                     
                              :(item.split('.').pop())}
                          </div>
                  ) }
            </div>}


              </div>
                    ) }
                
            </div>

          </div>
          <button className="border-0 bg-white mt-2 text-primary" 
          style={{ visibility:!tasks && "hidden"}}
          onClick={()=>setIsopen(true)}>Add comment</button>
          { isopen &&
      <Form  onSubmit={handlesubmit}
      className="  gap-2  mt-0 pt-2" encType="multipart/form-data" >          
          <Form.Group className="mt-0" >
           <Form.Control as="textarea" aria-label="With textarea"
                value={title}
                onChange={e=>setTitle(e.target.value)}
                placeholder="add comment"
                >
                </Form.Control>
            </Form.Group>
            <Form.Group 
              className=" d-flex mt-2 gap-2">
                          <Form.Select style={{width:'30%'}}
                          value={id_receiver}                          
                          // name={id_receiver}                          
                          onChange={(e)=>{
                            setId_receiver(e.target.value);                           
                          }}
                          >
                              <option  disabled value={''}>Select User</option>
                              {selectUser}
                          </Form.Select>
                        {/* <button className="btn btn-primary  " disabled ={receiver_name && description ? false:true }>Add</button> */}
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
      } 
          <div ref={focus} 
            onClick={handleOpenImage}>
            <button style={{ visibility:!isopen && "hidden"}}
              className=" cursor-pointer border-0 bg-white  text-danger ">+Add Files:</button> 
        </div>                 
      </div> 
        
        
      
        <div className=" mt-3 bg-white d-flex gap-2 ">
                    {filesdata && filesdata.map((item,i)=>(
                          <div key={i} className="border rounded  position-relative ">
        
                          <div className="d-flex align-items-center justify-content-start mt-3">
                          {(item.type=='image/jpeg' || item.type=='image/png') ?
                          <div className="d-flex align-items-center justify-content-start flex-column">
                              <img  src={URL.createObjectURL(item)} width='30px'  alt="" ></img>
                              <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                          </div>
                        :(item.type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'? 
                          <div className="d-flex align-items-center justify-content-start flex-column">
                            <img src={require('../../../Assets/files/doc.png')} width='30px' height='30px' alt=" img product"></img>
                            <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                              </div>
                        :(item.type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'? 
                          <div className="d-flex align-items-center justify-content-start flex-column">
                            <img src={require('../../../Assets/files/excel.jpg')} width='30px'height='30px' alt=" img product"></img>
                            <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                            </div>
                        :(item.type=='application/pdf'?
                          <div className="d-flex align-items-center justify-content-start flex-column">
                            <img src={require('../../../Assets/files/pdf.png')} width='35px' height='35px' alt=" img product"></img>
                            <p className="m-0"style={{fontSize:'12px'}}>{item.name}</p>
                            </div>
                              :(item.type=='application/x-zip-compressed'&&
                              <div className="d-flex align-items-center justify-content-start flex-column">
                                <img src={require('../../../Assets/files/rar.jpg')} width='35px'height='35px' alt=" img product"></img>
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
                  <button  className="border-0 bg-white fs-4  " 
                  disabled ={title ? false:true }
                  style={{color:title ? '#E41B17':'	#FBBBB9' }}
                  onClick={handlesubmit}>Save</button>      
                  <button className="border-0 bg-white fs-4 "
                   disabled ={title ? false:true }
                   style={{color:title ? '#E41B17':'	#FBBBB9' }}
                  onClick={()=>{setIsopen(false);setTitle('')}}>Cancle</button>                     
                </div> 
         
        
                        
    </div>
      
  </div>
      </>

    )
}



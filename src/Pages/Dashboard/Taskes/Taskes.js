import { useEffect,  useState } from "react"
import { Axios } from "../../../Api/axios"
import { Link } from "react-router-dom"
import { USER, USERS } from "../../../Api/Api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faPlus, faStar, faTrash } from "@fortawesome/free-solid-svg-icons"
import TransformTime from "../../../Helpers/TransformTime"
import LoadingSubmit from "../../../Component/Loading/Loading"


export default function Temptask1(){     
        const[refresh,setrefresh]=useState(0)   
        const[userId,setUserId]=useState('');     
        const[tasks,setTasks]=useState([]);       
        const[incomingTasks,setIncomingTasks]=useState(false)       
        const[loading,setLoading]=useState(false);
        let iswrritten=true ;
        let countCommit=0 ;
   
        useEffect(()=>{
            Axios.get(`${USER}`)
            .then(res=>{
                setUserId(res.data.id);  })
        },[])
        
        
        useEffect(()=>{
            async function gettask(){
            try{  await  Axios.get('tasks')
                .then(e=>{setTasks(e.data.post);               
               setLoading(false);
                  })                             
            }
            catch(err){console.log(err)}
        }
        gettask();

        },[])

      const taskshow=tasks.map((task,index)=>(
        <div className="   w-100   " key={index}
         style={{color:task.task_status=='Completed' ?'black':'red',boxShadow:'0 5px 5px rgba(0,0,0,0.3)'}}>           
                <>
         {countCommit===0}
       {iswrritten=true}
        {(userId==(incomingTasks?task.id_receiver:task.sender_id)) &&                            
    <Link to={`${task.id}`}     
    className="p-2 d-flex gap-2  w-100 align-items-center mb-2
     justify-content-between border rounded  flex-wrap "
     style={{color:task.task_status=='Completed' ?'black':'red',boxShadow:'0 2px 3px rgba(0,0,0,0.3)'}}>       
         <div className=" d-flex align-items-center justify-content-start  gap-2 flex-wrap">
           <div className=" d-flex align-items-center justify-content-between flex-wrap gap-3  ">
              <h5 className="m-0">{task.id}</h5>
              <h5 className="m-0">{task.sender_name}</h5>
              <h6 className="m-0  "style={{fontSize:'12px',color:'black'}}>
                 {task.task_status}</h6>       
           </div>
            <div  
            className="ms-3"           
                style={{color:task.task_status=='Completed' ?'black':'red'}}>
                <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="text-dark"></FontAwesomeIcon>
                    <p className="m-0">{task.description}</p>
                </div>
            </div>
        </div> 
        {iswrritten=false}
        <h6 className="m-0  ">{TransformTime(task.created_at)}</h6>
    </Link>
    }
    {incomingTasks &&    
    task.chiledtask.map((item ,nm)=>(
    
        (item.task_id==task.id && item.id_receiver==userId && task.sender_id !=userId && iswrritten)&&
          
        <Link to={`${task.id}`} key={nm}    
    className="p-2 d-flex gap-2  w-100 align-items-center mb-2
     justify-content-between border rounded  flex-wrap "
     style={{color:task.task_status=='Completed' ?'black':'red',boxShadow:'0 2px 3px rgba(0,0,0,0.3)'}}>       
         <div className=" d-flex align-items-center justify-content-start  gap-2 flex-wrap">
           <div className=" d-flex align-items-center justify-content-between flex-wrap gap-3  ">
              <h5 className="m-0">{task.id}</h5>
              <h5 className="m-0">{task.sender_name}</h5>
              <h6 className="m-0  "style={{fontSize:'12px',color:'black'}}>
                 {task.task_status}</h6>       
           </div>
            <div  
            className="ms-3"           
                style={{color:task.task_status=='Completed' ?'black':'red'}}>
                <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="text-dark"></FontAwesomeIcon>
                    <p className="m-0">{task.description}</p>
                </div>
            </div>
        </div> 
        {iswrritten=false}
        <h6 className="m-0  ">{TransformTime(task.created_at)}</h6>
    </Link>
    ))                     
                                        
          } 
     
    </>
        </div>
    
    )
)                      
    
        
           
        

          
        return(
            <>
           
           {loading && <LoadingSubmit/>} 
    <div className=" w-100 px-3 py-3 ">                                  
        <div  className="d-flex   justify-content-center justify-content-between mt-1 w-100 flex-wrap ">
            <button className="btn" disabled={!incomingTasks} onClick={()=>setIncomingTasks(perv=>!perv)}>task sending</button>
            <button className="btn"disabled={incomingTasks} onClick={()=>setIncomingTasks(perv=>!perv)}>task incoming</button>
            <Link className="btn " to='/dashboard/addTask'>New task</Link>                
        </div>         
                
        <div className="mt-3 "> 
            {taskshow}           
        </div>               
                    
        
    </div>
            </>
            )
    }

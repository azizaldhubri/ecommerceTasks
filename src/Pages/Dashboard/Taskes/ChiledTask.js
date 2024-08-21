import { useEffect, useRef, useState } from "react";
import { Form, FormControl, FormGroup, FormSelect } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Axios } from "../../../Api/axios";
import { USER } from "../../../Api/Api";
import TransformTime from "../../../Helpers/TransformTime";
import LoadingSubmit from "../../../Component/Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import StringSlice from "../../../Helpers/StringSlice";

export default function ChiledTask(){
    const {id}=useParams();
    const[refresh,setrefresh]=useState(0)
    const[comment,setComment]=useState('')
     const[users,setUsers]=useState([]);
     const[user,setUser]=useState('');    
     const[Loading,setLoading]=useState(false);
     const[receiver_id,setReceiver_id]=useState('')
     const[chiledTasks,setChiledTask]=useState([])
     const[files,setFiles]=useState([]);
     const [id_chiledTask,setId_chiledTask]=useState('');
     const [update,setUpdate]=useState(false);
     const [id_editTitel,setId_editTitel]=useState(-1);

     const dummyForm={
        title:'temp',
        task_id:id,
        sender_id:2,
        sender_name:'temp',
        receiver_id:1,
        receiver_name:'temp',
            
      }      
        
    const[sent,setSent]=useState(false);  
    const focus=useRef('');
    let file_type='';
    const openImage=useRef(null);
    const progress=useRef([]);
    const ids=useRef([]);
    const j=useRef(-1);
     
 let imagesShow='';
    useEffect(()=>{     
        focus.current.focus();
       },[]);
    //-----------------------------------

     useEffect(()=>{
        Axios.get('users')
        .then((e)=>setUsers(e.data.data))
     },[])

     useEffect(()=>{
        Axios.get(`${USER}`)
        .then((e)=>setUser(e.data))
     },[])

  
     useEffect(()=>{
        Axios.get('chiled_task')
        .then((res)=>{
          setChiledTask(res.data);                     
            
        })
     },[refresh])     

  //==============================
       imagesShow=files.map((item,index)=>(
      <div key={index} className="border p-2 w-100">
        <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-start gap-2">
            {item.type=='image/jpeg'?  <img src={URL.createObjectURL(item)} width='80px' alt=" img task"></img>
            :(item.type =='application/vnd.openxmlformats-officedocument.wordprocessingml.document'? <img src={require('../../../Assets/files/doc.png')} width='80px' alt=" img task"></img>
            :(item.type =='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'?
               <img src={require('../../../Assets/files/excel.jpg')} width='80px' alt=" img task"></img>
              :(item.type=='application/pdf'?
              <img src={require('../../../Assets/files/pdf.png')} width='80px' alt=" img task"></img>
              :(item.type=='application/x-zip-compressed'?
                <img src={require('../../../Assets/files/rar.jpg')} width='80px' alt=" img task"></img>
              :'')) )
               
            )}
            {/* // <img src={URL.createObjectURL(item)} width='80px' alt=" img product"></img> */}
            <div>
              <p className="mb-1">{item.name}</p>
  
              <p >{item.size/1024 <900 ?
              (item.size/1024).toFixed(2)+'kB'
              :(item.size/(1024*1024)).toFixed(2)+'MB'}
              </p>         
            </div>
            </div>
            <button onClick={()=>HandelImageDelet(index,item)} className="dlet">Delete</button>
  
      </div>
          <div className="custom-progress mt-3">
            <span 
           
            ref={(e)=>(progress.current[index]=e)}
                   
              className="inner-progress"></span>
        </div>
      </div>
    ))
    
   
  
 
  //==========================================
  async function HandelImageDelet(id,img){
    const findId=ids.current[id];
    try{
      await Axios.delete(`chiled_file/${findId}`);
      setFiles((prev)=>prev.filter((imgi) =>imgi !==img));
      ids.current=ids.current.filter((i)=>i !==findId);
      j.current-- ;
      
    }
    catch(err){
      console.log(err)
    }

    }

    //-------
    async  function HandleDelteImageFromServer(id){ 
      try{
        await Axios.delete(`chiled_file/${id}`)
        .then(res=>console.log(res));
        setrefresh(perv=>perv+1) ;                                 
          }
        catch(err){
          console.log(err)
        }       
      }
    //-----
    function handleOpenImage(){
        openImage.current.click()
      }

        // ------------------------------------------------------------------------------------
  async function HandleImagesChange(e){
    setFiles((prev)=>[...prev,...e.target.files]);
   
    const file_data=e.target.files;     
    const data=new FormData();
    for(let i=0;i<file_data.length;i++){    
       file_type=( (file_data[i].type=='image/jpeg' ||file_data[i].type=='image/png') ?'image'
        :(file_data[i].type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'? 'doc'
        :(file_data[i].type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'? 'excel'
          :(file_data[i].type=='application/pdf'?'pdf'
            :(file_data[i].type=='application/x-zip-compressed'&&'rar')
          )
        )))        
       let fileSize=file_data[i].size/1024 <900 ?
        (file_data[i].size/1024).toFixed(2)+'kB'
        :(file_data[i].size/(1024*1024)).toFixed(2)+'MB'

      j.current++ ;
      data.append('file',file_data[i]);
      data.append('chiledtask_id',id_chiledTask);
      data.append('fileType',file_type);
      data.append('fileName',file_data[i].name);
      data.append('fileSize',fileSize);      
      try{
        
        const res= await Axios.post('chiled_file/add',data,{
          onUploadProgress:(ProgressEvent)=>{
            const { loaded,total}=ProgressEvent ;
            const percent=Math.floor((loaded*100)/total);
            
            if(percent %10===0 ){
              progress.current[j.current].style.width=`${percent}%` ;
              progress.current[j.current].setAttribute('percent',`${percent}%`) ;                              
            }
                      
          }
        });
        ids.current[j.current]=res.data.id ;
      }
      catch(err){console.log(err)}
    }

  }
//---------------------------------------------------
      async function HandleSubmitForm(){  
        try{
          const res =await Axios.post('chiled_task/add',dummyForm)
          // .then(()=>setId_chiledTask(res.data.id))
         setId_chiledTask(res.data.id)
          ;
          console.log(res.data.id)
        }
  
        catch(err){
          console.log(err)
        }
      }

      //-----------------------------------------------------------------------------------
      async function handlesubmit(e){
        e.preventDefault();
        const data=new FormData()
        data.append('title',comment);
        data.append('task_id',id)
        data.append('sender_id',user.id)
        data.append('sender_name',user.name)
        data.append('receiver_id',receiver_id)
        data.append('receiver_name',receiver_name)
            setLoading(true);
             console.log(...data)   ;
        try{        
          await Axios.post(`chiled_task/edit/${id_chiledTask}`,data);             
              setLoading(false);
              setrefresh(perv=>perv+1);
              j.current=-1 ;
              setFiles([]);
              setComment('');
              setReceiver_id('')   ;        
                      }
          catch(err){
            setLoading(false);
            console.log(err)
        }
    }
    //-----------
    async function handleUpdateChiledTask(id){
     
      const formdata=new FormData();
           formdata.append('title',comment)
         
      await Axios.post(`chiled_task/edittask/${id}`,formdata)
      .then(res=>{console.log(res.data);
          setrefresh(perv=>perv+1);
            setUpdate(false) ;     
          
      })
   }

   async function handelDeleteChiledTask(id){
    try{
        await Axios.delete(`chiled_task/${id}`)
        setChiledTask((perv)=>perv.filter((item)=>item.id!==id)) 
        // setrefresh(perv=>perv+1)                                         
        }
        catch(err){console.log(err)}    
 }
//-------------------------------------------------------------------------------------
    const  selectUser=users.map((item,nm)=>(      
       item.id !==user.id &&
        <option key={nm} value={item.id}>{item.name}</option>      
     ))

     let receiver_name='' ;
     {receiver_id &&(
          users.map((item,index)=>(           
             item.id ==receiver_id &&
             (receiver_name=item.name)
        
        
        ))
     ) }       
 
    return(
        <>
      
  {Loading  && <LoadingSubmit />}
  <div className="w-100  py-4 px-4 d-flex justify-content-center bg-white ">
    <div className="w-75  "> 
        <div className=" w-100 d-flex justify-content-between ">
            <p className="mb-4 text-danger">Taske Work {id}</p>
            <Link to='/dashboard/taskes' className="ms-100">Back</Link>
        </div>
        <div>
        {chiledTasks.map((item,index)=>(
            item.task_id==id&& (
              <div key={index} >
                 <>
          <div  className="  mt-2 rounded border  " >
              <div className="d-flex justify-content-between align-items-center  border-bottom  ">
                  <div className="p-2 d-flex gap-2 ">
                        <h5 style={{color:'#B041FF'}}>   {item.sender_name}</h5>
                        for <h5 style={{color:'#D16587'}}>{item.receiver_name}</h5>                               
                  </div>
                  <p className="m-0 me-3">{TransformTime(item.created_at)}</p>
                  
              </div>
              <div className=" d-flex align-items-center  justify-content-between  p-2 ">
                    {(update && id_editTitel==index ) ? 
                    <div className="d-flex align-items-center w-100 me-2">
                        <input className="border-0 outlin-0 w-100 form-control  " type="text" 
                      value={comment} name="title" onChange={(e)=>setComment(e.target.value)}
                    style={{background:'#C8BBBE'}}
                    /> 
                    <button className="btn btn-primary m-2"onClick={()=>handleUpdateChiledTask(item.id)}>Save</button>

                    </div>                                 
                                                      
                    :
                    <p className="m-0 mt-1 ms-3 " style={{color:'#000000'}}>{item.title}</p>}
                    
                    {item.sender_id==user.id &&
                       <div className="d-flex align-items-center  justify-content-center gap-3">
                   
                       <FontAwesomeIcon 
                         fontSize={'19px'} icon={faPenToSquare}
                         onClick={()=>{setComment(item.title);
                         setId_editTitel(index);
                         setUpdate(true); }}
                         cursor={'pointer'} />             
                  
                         <FontAwesomeIcon 
                         onClick={()=>handelDeleteChiledTask(item.id)}
                             fontSize={'19px'} 
                         color="red"
                         cursor={'pointer'}
                         icon={faTrash} />                   
                   </div> 

                    }
                               

              </div>
              <div className="   d-flex  gap-2 flex-wrap lign-items-center justify-content-start  ms-2 mb-2 ">
                    {item.files.map((it,nm)=>(
                  <div key={nm} className="border rounded  position-relative " style={{width:'100px'}}>
                  <div className="d-flex flex-column align-items-center  justify-content-center  gap-1">
                      {it.fileType=='image'?  <img 
                       src={(`https://free-001.yemenhosting.com/assets/${it.file}`)} width='50px'height='80px' alt=" img product"></img>
                    //  src={(`/assets/${it.file}`)} width='50px'height='80px' alt=" img product"></img>
                      :(it.fileType =='doc'? <img src={require('../../../Assets/files/doc.png')} width='50px' height='60px' alt=" img product"></img>
                      :(it.fileType =='excel'?
                        <img src={require('../../../Assets/files/excel.jpg')} width='50px'height='60px' alt=" img product"></img>
                        :(it.fileType=='pdf'?<img src={require('../../../Assets/files/pdf.png')} width='50px' height='60px' alt=" img product"></img>
                        :(it.fileType =='rar'?
                        <img src={require('../../../Assets/files/rar.jpg')} width='60px'height='50px' alt=" img product"></img>
                        :'')) )
                        
                      )}
                      <p className="m-0  p-0 d-flex   ">{it.fileName.length>12?StringSlice(it.fileName,12):it.fileName}</p>                                       
                          <p className="m-0">{it.fileSize}</p>
                      <a  href={`https://free-001.yemenhosting.com/api/download/${it.file}`} >Download</a>  
                      
             
                      </div>                      

                      
                    {(update && id_editTitel==index ) && <div style={{cursor:"pointer"}}
                          className="position-absolute  top-0 end-0 bg-danger rounded text-white"
                          onClick={()=>HandleDelteImageFromServer(it.id)}>                        
                          <p className="py-1 px-2 m-0" >
                              x
                          </p>
                      </div>} 
                      
              
                
                </div>                    
                                            
                        ))}
              </div> 
                          
          </div>
                              
          </>

              </div>
         
        )
        ))}

        </div>
        <Form  onSubmit={handlesubmit}
        className="  gap-2 m-2 mt-2 pt-2" encType="multipart/form-data" >
            <FormGroup className=" w-100" >
                <FormControl
                  ref={focus} 
                type="text"
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                placeholder="Add Comment"
                disabled={update}
                >
                
                </FormControl>
            </FormGroup>

            
            <div className="mt-2 d-flex gap-2">

            <FormGroup className=" w-100">
                <FormSelect
                value={receiver_id}
                onChange={(e)=>{setReceiver_id(e.target.value);setSent(true);HandleSubmitForm();}}
                disabled={update}>
                    <option  disabled  value={''}>Select User </option>
                    {selectUser}
                    

                </FormSelect>
            </FormGroup>
            <button className="btn btn-primary" disabled ={(receiver_name && comment !=='') ? false:true } >Save</button>
            </div>

            <Form.Group className="mb-3" controlId="images">
      <Form.Label></Form.Label>
        <Form.Control
        ref={openImage}
        hidden
        multiple 
        onChange={HandleImagesChange}
        type="file"                
        disabled={(!sent || receiver_id =='')}

        />
    </Form.Group>
    <div
    onClick={handleOpenImage}
    className="d-flex 
    align-items-center 
    justify-content-center
    gap-2 py-3 rounded  mb-2 w-100 flex-column "
    style={{border:(!sent || receiver_id =='') ? '2px dashed gray':'2px dashed #0086fe',
    cursor: (sent && receiver_id !='') && "pointer"}}
    >
    <img src={require('../../../Assets/images.jpg')}
    alt="upload here"
    width='100px'     
     style={{filter:(!sent || receiver_id =='') && 'grayscale(1)'}}
    >
    </img>
    <p className="fw-bold mb-0" style={{color:(!sent || receiver_id =='')  ?'gray':'#0086fe'}} >Upload Files</p>
    </div>

        
        </Form>
        {
          sent && <div className="d-flex align-items-start flex-column gap-2">  
          {imagesShow} 
          </div> 
        }                   
    </div>
      
  </div>
  </>
    )
}

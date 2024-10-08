import React, { useState,useEffect } from 'react';
import Signin from './signinForm.js'
import './App.css'; 
import Integrate from './RamaBlog';
import Explore from './Explore'; 
import Cookies from 'js-cookie';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'
const socket=io.connect('http://localhost:8000')



export default function Chat(){
  const username=Cookies.get('username') 
  if(username){
    return(
      <Chat1/>
    )
  }
  else{
   return( <></>)
  }
}












 function Chat1(){
    const {name} =useParams();
    let name1=name.slice(1)
    const [msg,setMsg]=useState('')
    const [displayMessages,setDisplay]=useState([])
    const username=Cookies.get('username')
const[messages,setMessages]=useState([])
    useEffect(()=>{
        axios.post("http://localhost:8000/prev",{title:name1}).then(res=>{setMessages(res.data)})
        socket.on('messageReceived',(data)=>{
            console.log("emitted")
            setMessages((prev)=>[...prev,data])
           
        })
        return () => {
            socket.off('messageReceived');
        };
      
    },[])
    useEffect(()=>{
        console.log("msgs",messages)
    },[messages])

   

     function HandleChange(e){
        let m=e.target.value;
        setMsg(m);
     }

     function HandleClick(e){
        console.log(msg)
              socket.emit('newMessage',{title:name1,username:username,msg:msg});
              

     }
    
     const [data,setData]=useState({})
     useEffect(()=>{
       axios.get('http://localhost:8000/getDetails',{withCredentials:true}).then((res)=>{setData(res.data)
          console.log("res",res.data)})
 
 },[])
 function check(s){
    let joined=data.joined;
    let created=data.created;
    let c=0;
    
   
    let i=0;
    if(Array.isArray(joined)&&Array.isArray(created)){
    for(i=0;i<joined.length;i++){
     if(joined[i]==s){
       c+=1;
     }
    }
    for(i=0;i<created.length;i++){
     if(created[i]==s){
       c+=1;
     }
    }
   console.log(c)
    }
    if(c==0){
     return false
    }
    else{
     return true
    }
 
 
 }

    return(
      <div className="chatbody">
      <h1 align="center" className="chat-title">{name1}</h1>
        <div className="chat-holder">
       
     <div>   <Chats data={messages}/> </div>
   { (check(name1)) ? <div>   <input placeholder="lets-caht" onChange={(e)=>{HandleChange(e)} } className='chatInput' ></input><button onClick={(e)=>{HandleClick(e)}} className='ChatButton'>send</button></div>:<></>}
       
        </div>
        </div>
    )
}
function Chats({ data }) {
    
    const sortedMessages = data.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const username=Cookies.get('username')
    return (
      <>
        {sortedMessages.map((message, index) => (
          <div key={index} className={message.username==username?"messageContainer":"messageContainerRand"}>
            <strong  className={message.username==username?"username":"usernameRand"}>
              {message.username}</strong>
            <br />
          &nbsp;&nbsp;&nbsp;  {message.message}
            <br></br>
          </div>
        ))}
      </>
    );
  }
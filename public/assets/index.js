

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const roomName = $("#room-name");

const call = $("#call")
const localVideo = $("#local-video");
const peerVideo = $("#peer-video");
let localStream;
let creator = false
let roomValue;
var constraints = window.constraints = {audio: false,video: true};
// Contains the stun server URL we will be using.
let iceServers = {
  mandatory: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  },
  iceServers:   [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ]
};

 
/*
{
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
*/

call.addEventListener("click", async ()=>{
  try{
   let stream = await navigator.mediaDevices.getUserMedia(constraints)
   localStream = stream
   if('srcObject' in localVideo){
     localVideo.srcObject = stream
   }else{
     localVideo.src = URL.createObjectURL(stream)
   }
   initConnection(stream)
  }catch(err){
    console.log("navigator error",err)
  }
})



const initConnection = (stream)=>{
  const url = "http://localhost:9000"
  const socket = io(url)
  let localConnection,
      remoteConnection,
      localChannel,
      remoteChannel
  
  socket.on("other-user",(otherUsers)=>{
      console.log("other-user",otherUsers)
    
    if (!otherUsers || !otherUsers.length) return;
   
    const socketId = otherUsers[0]
    
    localConnection = new RTCPeerConnection(iceServers)
    
    console.log("socket Other-user addTrack: " ,stream.getTracks()[0],stream)

    localConnection.addTrack(stream.getTracks()[0],stream);
    localConnection.onicecandidate = ({candidate})=>{
      console.log("other-user :- onicecandidate :- ",candidate)
      candidate && socket.emit("candidate",candidate,socketId)
    }

    localConnection.ontrack = ({streams:[stream]})=>{
      console.log("other-user :- ontrack :-",stream)
      localVideo.srcObject = stream
    }
    

    localConnection
     .createOffer()
     .then((offer)=> localConnection.setLocalDescription(offer))
     .then(()=>{
      console.log("localConnection.localDescription :- offer :-" ,localConnection.localDescription)
      socket.emit('offer',socketId,localConnection.localDescription)
    })
  })


  socket.on("offer",(socketId, description)=>{
      console.log("offer",socketId,description)
      remoteConnection = new RTCPeerConnection(iceServers)

      remoteConnection.addTrack(stream.getTracks()[0])
      
      remoteConnection.onicecandidate = ({candidate})=>{
        console.log("offer :- onicecandidate :-",candidate)
        candidate && socket.emit("candidate",candidate,socketId)
      }


      remoteConnection.ontrack = ({streams:[stream]})=>{
        console.log("offer :- onicecandidate :-",stream)
        peerVideo.srcObject = stream
      }


      remoteConnection
          .setRemoteDescription(description)
          .then(()=> remoteConnection.createAnswer())
          .then(answer =>remoteConnection.setLocalDescription(answer))
          .then(()=>{
            console.log("remoteConnection.localDescription :- answer :-", remoteConnection.localDescription)
            socket.emit("answer",remoteConnection.localDescription,socketId)
          })
  })
  socket.on('answer',(description)=>{
    localConnection.setRemoteDescription(description)
  })
  socket.on("candidate",(candidate)=>{
     console.log("++++++++++++socket :- answer :- ",candidate)
     const conn = localConnection || remoteConnection;
     console.log("localConnection :-",localConnection,"remoteConnection :-" , remoteConnection)
     conn.addIceCandidate(new RTCIceCandidate(candidate));
  })
}




$("#leave").addEventListener("click",()=>{
  localStream.pause()
  localStream.src = ""
  localStream.getTracks()[0].stop();
  console.log("video off");
})



























// second try


// const url = "http://localhost:9000"
// const socket = io(url)

// const $ = document.querySelector.bind(document)
// const $$ = document.querySelectorAll.bind(document)
// const roomName = $("#room-name");

// const call = $("#call")
// const localVideo = $("#local-video");
// const peerVideo = $("#peer-video");
// let localStream;
// let creator = false
// let rtc;
// let roomValue;


// var constraints = window.constraints = {audio: false,video: true};
// // Contains the stun server URL we will be using.
// let iceServers = {
//   mandatory: {
//     offerToReceiveAudio: true,
//     offerToReceiveVideo: true
//   },
//   iceServers: [{
//     'urls':'stun:stun.l.google.com:19302'
//   },{
//     'urls':'stun:stun1.l.google.com:19302'
//   },{
//     'urls':'stun:stun2.l.google.com:19302'
//   },{
//     'urls':'stun:stun3.l.google.com:19302'
//   },{
//     'urls':'stun:stun4.l.google.com:19302'
//   }]
// };



// call.addEventListener("click",()=>{
//   roomValue = roomName.value
//   if(roomValue.trim() == ""){
//     alert("Room value can't be empety")
//   }else{
//     console.log(roomValue)
//     socket.emit("join",roomValue)
//   }
// })


// socket.on("created", async ()=>{
//   creator = true
//   try{
//     let stream = await navigator.mediaDevices.getUserMedia(constraints)  
    
//     localStream = stream
//     console.log("socket Created --stream : ",stream)
//     if('srcObject' in localVideo){
//       localVideo.srcObject = stream
//     }else{
//       localVideo.src = URL.createObjectURL(stream)
//     }
//   }catch(err){
//     console.log("socket created err :",err)
//   }
// })



// socket.on("joined",async ()=>{
//   creator = false
//   console.log("joined : " ,roomValue)
//   try{
//     let stream = await navigator.mediaDevices.getUserMedia(constraints)  
    
//     localStream = stream
//     console.log("socket joined --stream : ",stream)
//     if('srcObject' in localVideo){
//       localVideo.srcObject = stream
//     }else{
//       localVideo.src = URL.createObjectURL(stream)
//     }
//     socket.emit("ready",roomValue)
//   }catch(err){
//     console.log("socket joined err : " ,err)
//   }
// })



// socket.on("full",()=>{
//   alert("socket Full")
// })





// // Main RTC handling


// socket.on("ready",()=>{
//   if(creator){
//       rtc = new RTCPeerConnection(iceServers)

//       rtc.createOffer().then(offer=>{
//          console.log("socket ready createOffer() ",offer)
//          rtc.setLocalDescription(new RTCSessionDescription(offer))
//          socket.emit("offer",offer,roomValue)
//       }).catch(err=>{
//         alert("ready : createOffer Offer : ",err)
//       })
//       localStream.getTracks().forEach(track=>{
//         rtc.addTrack(track,localStream)
//       })
//       rtc.onicecandidate = onicecandidateFunction
//       rtc.ontrack = ontrackFunction
//   }
// })




// socket.on("offer",(offer)=>{
//   if(!creator){
//       rtc = new RTCPeerConnection(iceServers)
//       rtc.setRemoteDescription(offer)
//       rtc.createAnswer().then(answer=>{
//         console.log("socket offer : createAnswer() ",answer)
//         rtc.setLocalDescription(answer)
//         socket.emit("answer",answer,roomValue)
//       }).catch(err=>{
//         alert("ready : createAnswer answer : ",err)
//       })
//       localStream.getTracks().forEach(track=>{
//         rtc.addTrack(track,localStream)
//       })
//       rtc.onicecandidate = onicecandidateFunction
//       rtc.ontrack = ontrackFunction
//   }
//   console.log("RTC",rtc)
// })



// socket.on("answer",(answer)=>{
//   console.log("socket answer : ",answer)
//   rtc.setRemoteDescription(answer)
//   console.log("RTC",rtc)
// })




// let  onicecandidateFunction = (event)=>{
//   console.log("onicecandidateFunction :" ,event)
//   if(event.candidate){
//    socket.emit("candidate",event.candidate,roomName)
//   }
// }

// let ontrackFunction = (event)=>{
//   console.log("onicecandidateFunction :" ,event)
//   peerVideo = event.streams[0];
// }



// $("#leave").addEventListener("click",()=>{
//    localVideo.pause();
//    localVideo.src = "";
//    localStream.getTracks()[0].stop();
//    console.log("Video Off");
// })







// first try


// const url = "http://localhost:9000"
// const socket = io(url)
// const $ = document.querySelector.bind(document)
// const $$ = document.querySelectorAll.bind(document)
// const roomName = $("#room-name");

// const call = $("#call")
// const localVideo = $("#local-video");
// const peerVideo = $("#peer-video");
// let localStream;
// let creator = false
// let rtc;
// let roomValue;
// var constraints = window.constraints = {audio: false,video: true};
// // Contains the stun server URL we will be using.
// let iceServers = {
//   mandatory: {
//     offerToReceiveAudio: true,
//     offerToReceiveVideo: true
//   },
//   iceServers: [
//     { urls: "stun:stun.services.mozilla.com" },
//     { urls: "stun:stun.l.google.com:19302" },
//   ],
// };




// call.addEventListener("click",()=>{
//   roomValue = roomName.value
//   if(roomValue == ""){
//     alert("Room Name can't be empety")
//   }else{
//   call.style ="display:none"
//     roomName.setAttribute("readOnly",true);
//     socket.emit("join",roomValue)
//   }
// })





// socket.on("created",async ()=>{
//     creator = true
//      console.log("created")
//    //  try{
 
//    //   const stream = await navigator.mediaDevices.getUserMedia(constraints)

//    //    stream.onremovetrack = ()=>{ 
//    //       console.log("Tracked Removed")
//    //    }

//    //    localVideo.srcObject = stream
//    //    localStream = stream

//    //    localVideo.onloadedmetadata = function (e) {
//    //      localVideo.play();
//    //    }
      
//    // }catch(err){
//    //    console.log("RTC error :",err)
//    // }

  


//    /**  navigator.getUserMedia()**/ 
    
//    // navigator.getUserMedia(constraints,stream=>{
//    //   localVideo.srcObject = stream
//    //   localVideo.onloadedmetadata = ()=>localVideo.play();
//    //   localStream = stream
//    // },err=> alert("created :",err))


  
//   /**  navigator.mediaDevices.getUserMedia()**/ 
   
//   navigator.mediaDevices.getUserMedia(constraints)
//   .then(stream=>{
//     localVideo.srcObject = stream
//     localStream = stream
//   })
//   .catch(err=> alert("Created",err))


// })

// socket.on("joined",async ()=>{
//      creator=false
//      console.log("Joined")

//      //  try{
//      //      const stream = await navigator.mediaDevices.getUserMedia(constraints)
        

//      //      localVideo.srcObject = stream
//      //      localStream = stream
          
//      //      localVideo.onloadedmetadata = function (e) {
//      //        localVideo.play();
//      //      };

//      //      socket.emit("ready",roomValue)
       
//      // }catch(err){ 
//      //      console.log(err)
//      // }
  



//         /**  navigator.getUserMedia()**/ 

//      // navigator.getUserMedia(constraints,stream=>{
//      //   localVideo.srcObject = stream
//      //   localVideo.onloadedmetadata = (e)=> localVideo.play();
//      //   localStream = stream
//      //   window.stream = stream
//      //   socket.emit("ready",roomValue)
//      // },()=> alert("Joined :",err))



//   /**  navigator.mediaDevices.getUserMedia()**/ 

//   navigator.mediaDevices.getUserMedia(constraints)
//   .then(stream=>{
//     localVideo.srcObject = stream
//     localStream = stream

//     socket.emit("ready", roomValue);
//   })
//   .catch(err=> alert("Created",err))

// })



// socket.on("full",(room)=>{
//   console.log(room)
//   alert(`${room} room is full`)
// })






// socket.on("ready",(roomName)=>{
//    console.log("ready")
//   if(creator){
//     rtc = new RTCPeerConnection(iceServers)
//     rtc.onicecandidate = onicecandidateFunction
//     rtc.ontrack = ontrackFunction 
//     console.log(localStream.getTracks[0],localStream)
//     console.log(localStream.getTracks[1],localStream)

//     rtc.addTrack(localStream) //video
//     // rtc.addTrack(localStream) //audio
    
//     // Create Offer
//     rtc.createOffer().then((offer)=>{
//       rtc.setLocalDescription(offer)
//       socket.emit("offer",offer,roomValue)
//     }).catch((err)=> alert("createOffer : ",err))
//   }
// })


// socket.on("candidate",(candidate)=>{
//   console.log("candidate : ",candidate)
//   let icecandidate = new RTCIceCandidate(candidate)
//   rtc.addIceCandidate(icecandidate)
// })


// socket.on("offer",(offer)=>{
//   if(!creator){
//     rtc = new RTCPeerConnection(iceServers)
//     rtc.onicecandidate = onicecandidateFunction
//     rtc.ontrack = ontrackFunction

//     console.log(aaa)
//     rtc.addTrack(localStream.getTracks[0],localStream)
//     rtc.addTrack(localStream.getTracks[1],localStream)

//     rtc.setRemoteDescription(offer)

//     rtc.createAnswer().then((answer)=>{
//       rtc.setLocalDescription(answer);
//       socket.emit("answer",answer,roomValue)
//     }).catch(err=>alert("createAnswer :",err))
//   }
// })
// socket.on("answer",(answer)=>{
//   rtc.setRemoteDescription(answer)
// })

// const onicecandidateFunction = (event)=>{
//   console.log("onicecandidateFunction :" ,event)
//   if(event.candidate){
//     socket.emit("candidate",event.candidate,roomValue)
//   }
// }

// const ontrackFunction = (event)=>{
//   peerVideo.srcObject = event.streams[0];
//   peerVideo.onloadedmetadata = ()=>{
//     peerVideo.play();
//   }
// }




// $("#leave").addEventListener("click",()=>{
//    localVideo.pause();
//    localVideo.src = "";
//    localStream.getTracks()[0].stop();
//    console.log("Video Off");
// })



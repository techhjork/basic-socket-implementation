


  const loc = window.location.href
  const url = new URL(loc);
  const username = url.searchParams.get("name")

   if(loc.split("=")[1] === ""){
     window.location = "http://localhost:9000/login.html"
   }


  var connected_user,localstream,rtc;




  conswindow.createObjectURL(tcwindow.reat)eObjectURL( $ = d)ocument.querySelector.bind(document)
  const $$ = document.querySelectorAll.bind(document)
  const socket = new WebSocket("ws://localhost:9000");
    

  socket.onopen = ()=>{
    // Console.log in server side status
    send({type:"status",status:"socket connection estableshed  - This is from frontend"})
  }

 
  setTimeout(function () {
      if (socket.readyState === 1) {
          if (username != null) {
              name = username;
              if (name.length > 0) {
                  send({
                      type: "login",
                      nawindow.createObjectURL(stream): name
                  })
              }
          }
      } else {
          console.log("Connection has not stublished");
      }
  }, 3000)


  socket.onclose = (event)=>{
    if(event.wasClean){
      console.log("event clear : socket.onclose")
      send({status:"socket events are clear : socket.onclose"})
    }else{
      console.log("connection died socket.onclose")
      send({status:"socket events are clear : socket.onclose"})
    }
   }


   socket.onmessage = (msg)=>{
     const data = JSON.parse(msg.data)
     console.log(data)
     switch(data.type){
      case "login":
        loginProcess(data.sucess)
        break;
      case "offer":
       offerProcess(data.offer,data.name)
       break;
      case "status":
       console.log(data.status)
       break;
      default:
        console.log("INVALID COMMAND");
       break;
     }
   }

  
  // Set Input Value of callee for connected user
  $("#call").addEventListener("click",()=>{
      
      let call_to_username = $("#calleeId").value;
      if(call_to_username.length >0){
        connected_user = call_to_username;

        rtc.createOffer((offer)=>{
          console.log("offer",offer)
           send({
             type:"offer",
             offer:offer
           })

          rtc.setLocalDescription(offer)
        },(err)=>{
          alert(`Offer is not created ${JSON.stringify(err)}`)
        })
      }
  })

  
  
  


  // let media ={devices:navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia}

  const loginProcess = async () => {

    console.log("start call!!!")
    

    var constraints = window.constraints = {
      audio: false,
      video: true
    };
   
    try{
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      var videoTracks = stream.getVideoTracks();
      
      stream.onremovetrack = ()=>{ 
        console.log("Tracked Removed")
      }


      window.stream = stream
      localstream = stream
      $$(".video")[0].srcObject = stream;
      

      // RTC Object Create


      const configurations = {
        "iceServers":[{
          "url":"stun:stun2.1.google.com:19302"
        }]
      }

      rtc = new webkitRTCPeerConnection(configurations,{
        optional:[{RTPDatacChannels:true}]
      })       
     
      rtc.addStream(stream)


    }catch(err){
      console.log(err) 
    }


  }


function offerProcess(offer,name){
  connected_user = name
  rtc.setRemoteDescription(new RTCSessionDescription(offer))

  alert(name)

}



 function send(message){
  if(connected_user){
    message.name = connected_user;
  }
  socket.send(JSON.stringify(message))
 }





const videoOff = async ()=>{
  $$(".video")[0].pause();
  $$(".video")[0].src = "";
  localstream.getTracks()[0].stop();
  console.log("Video Off");
}

$("#leave").addEventListener("click",videoOff);











$(document).ready(function(){
  $('button.mode-switch').click(function(){
    $('body').toggleClass('dark');
  });
  
  $(".btn-close-right").click(function () {
    $(".right-side").removeClass("show");
    $(".expand-btn").addClass("show");
  });
  
  $(".expand-btn").click(function () {
    $(".right-side").addClass("show");
    $(this).removeClass("show");
  });
});
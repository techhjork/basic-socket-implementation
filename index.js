const express = require("express")
const app = express()
const socket = require("socket.io")
const port = process.env.PORT || 9000
const server = app.listen(port,console.log("localhost:9000"))
const io = socket(server,{
   cors:"*"
})
let connectedUsers = []
let otherUsers = []

io.on('connection',(socket)=>{
   let id = socket.id

  // Main Things
  socket.on("new-user",(username)=>{
     connectedUsers.push({
       id,
       username
     })
   
    otherUsers = connectedUsers.filter(otherUser=> id !== otherUser.id )
    console.log("connectedUsers :- ",connectedUsers,"otherUsers :-" , otherUsers)
    socket.broadcast.to(id).emit("other-user",otherUsers)
  })

  socket.on("disconnect",()=>{
   connectedUsers = connectedUsers.filter(connectedUser =>  id === connectedUser.id)
   console.log("user leave",connectedUsers)
  })
})





// const express = require("express")
// const app = express()
// const socket = require("socket.io")
// const port = process.env.PORT || 9000
// app.use(express.static(__dirname + "/public"))


// const server = app.listen(port,()=>console.log(`localhost:${port}`))
// const io = socket(server)

// let connectedUser = []
 

// io.on("connection",(socket)=>{
//    if(connectedUser.length<=2){
//      connectedUser.push(socket.id)
//      console.log("socket id :-",socket.id,"socket Array :-",connectedUser)
//    }else{
//    	console.log("FULL Room")
//    }	
   
  
//    const otherUser = connectedUser.filter(socketId=> socket.id != socketId)
//    socket.emit("other-user",otherUser) 
   
//    socket.on("offer",(socketId,description)=>{
//    	  console.log("offer",socketId)
//       socket.to(socketId).emit("offer",socket.id,description)
//    })
  
//    socket.on("answer",(description,socketId)=>{
//    	console.log("answer",description)
//       socket.to(socketId).emit('answer',description)
//    })

//    socket.on("candidate",(candidate,socketId)=>{
//    	  console.log("candidate",socketId)
//    	 socket.to(socketId).emit("candidate",candidate);
//    })


//    socket.on("disconnect",()=>{
//    	connectedUser = connectedUser.filter(socketId => socketId !== socket.id);
//    })
// })























// const express = require("express")
// const app = express();
// const socket = require("socket.io")
// const port = process.env.PORT || 9000
// app.use(express.static(__dirname + "/public"))





// const server = app.listen(port,()=> console.log(`http://localhost:${port}`));

// const io = socket(server);


// io.on("connection",(socket)=>{ 
//   console.log("connected socket id :",socket.id);

//   socket.on("join",(roomName)=>{
//     let rooms = io.sockets.adapter.rooms
//     let room = rooms.get(roomName)
    
//     if(room == undefined){
//       console.log("created :",roomName)
//      socket.join(roomName);
//      socket.emit("created")
//     }else if(room.size == 1){
//       console.log("joined :",roomName)
//       socket.join(roomName)
//       socket.emit("joined")
//     }else{
//       console.log("Room full :", roomName)
//       socket.emit("full",roomName);
//     }
//     console.log(rooms)
//   })


//   socket.on("ready",(roomName)=>{
//     console.log("Ready",roomName)
//     socket.broadcast.to(roomName).emit("ready")
//   })

  
//   socket.on("candidate",(candidate,roomName)=>{
//     console.log("candidate :",candidate)
//      socket.broadcast.to(roomName).emit("candidate",candidate);
//   })

//   socket.on("offer",(offer,roomName)=>{
//     console.log("Offer",roomName)
//     socket.broadcast.to(roomName).emit("offer",offer)
//   })

//   socket.on("answer",(answer,roomName)=>{
//     console.log("answer",roomName)
//     socket.broadcast.to(roomName).emit("answer",answer)
//   }) 

// })
























// // const express = require("express")
// // const app = express()


// // const { createServer } = require("http")

// // const webSocket = require("ws")

// // app.use(express.json({extended:false}))
// // app.use(express.static(__dirname + "/public"))
// // const port = process.env.port || 9000

// // const server = createServer(app)

// // server.listen(port,()=> console.log(`PORT is open http://localhost:9000`));


// // app.get("/app",(req,res)=>{
// //   res.send("Example of webSocket server");
// // })

// // const wss = new webSocket.Server({server})

// // let users = []
 
// // wss.on("connection",(ws)=>{

// // 	// Console.log in client side status
// // 	ws.send(JSON.stringify({type:"status",status:"socket connection estableshed  - This is from backend"}))


// // 	ws.onmessage = (msg)=>{

// // 		try{
// //            data = JSON.parse(msg.data)
	       	   
// // 		}catch(err){
// // 		   console.log('Invalid JSON',err)
// // 		   data = {}
// // 		}


// // 		console.log(`data : ${data.type},users :${users[data.name]}`)
// // 		switch(data.type){
// //            case "login":
// //             if(users[data.name]){
// // 	            sendToOtherUser(ws,{
// // 	             	type:"login",
// // 	             	success: false
// // 	            })
// //             }else{
// //                 users[data.name] = ws
// //                 ws.name = data.name
// //                 console.log(users)
// // 	            sendToOtherUser(ws,{
// // 	             	type:"login",
// // 	             	success: true
// // 	            })
// //             }
// //             break;
// //            case "offer":
// //                var connect = users[data.name];
// //                console.log("offer",data.offer,connect)
// //                if(connect != null){
// //                	 ws.otherUser = data.name

// //                	 sendToOtherUser(ws,{
// //                	 	type:"offer",
// //                	 	offer:data.offer,
// //                	 	name: ws.name
// //                	 })
// //                }
// //            case "status":
// //              console.log(data.status)
// //             break;
// // 		}
// // 	}
	 
   
	
    

    
// //     ws.on("close",()=>{
// //     	console.log("socket is close")
// //     })

// // })


// // const sendToOtherUser = (connection,msg)=>{
// //     connection.send(JSON.stringify(msg))
// // }

// /*            if(users[data.name]){
//                sendToOtherUser(ws,{
//             	type:"login",
//             	sucess:false
//               })
//             }else{
//              users[data.name] = ws
              
//              ws.name = data.name
               

//               sendToOtherUser(ws,{
//             	type:"login",
//             	sucess:true
//               })
//             }
//             */
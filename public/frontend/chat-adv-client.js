document.addEventListener("DOMContentLoaded", function () {
 

  const socket = io()
  socket.on("message",message=>{
    outputMesage(message)
   
  })

  
  socket.on("userList", userList=>{
    console.log("userlist",userList)
    if (userList!= null){
      document.querySelector('#users ul').innerHTML = '';
      userList.forEach((data)=>{
        console.log(data)
        console.log("printing")
        printData(data)
      })
    }
  })
  
  // get user name and then tell the server
  let username = prompt('What\'s your username?'); 
  socket.emit("username", username) 
  let text = document.createTextNode(" [ "+username+" ] ")
  document.querySelector(".messages-header > h3").appendChild(text)
  if(username!=null){
    socket.emit("addUser", username)
  }
 

  /* This user is sending a new chat message */
  document.querySelector("#chatForm").addEventListener('submit', e => {
    e.preventDefault();
    const message = document.querySelector("#entry").value;
    //emitting message to server
    
    console.log("sending: ", message)
    socket.emit('chatMessage',message)
    const form = document.querySelector('#chatForm')
    form.reset();
  });

  /* User has clicked the leave button */
  document.querySelector("#leave").addEventListener('click', e => {
    e.preventDefault();
    
	
  });  
  function printData(data){
    const partyList = document.querySelector('#users ul');
    
    const listItem = document.createElement('li');
    
    const img = document.createElement("img")
    img.src = data.img
    img.alt= "avatar"

    const name = document.createElement("div")
    name.classList.add("name")

    const nameParagraph = document.createElement("p");
    nameParagraph.textContent = data.name;
    name.appendChild(nameParagraph);

    const statusParagraph = document.createElement("p");
    statusParagraph.textContent = "online";
    name.appendChild(statusParagraph);

    listItem.appendChild(img);
    listItem.appendChild(name);

    partyList.appendChild(listItem);
  }

  function outputMesage(msg){
    console.log(msg)
    const messagesBody = document.querySelector('.messages-body ul');

    // create a new list item
    const newMessage = document.createElement('li');
    newMessage.classList.add('message-sent');

    // create the message data element
    const messageData = document.createElement('p');
    messageData.classList.add('message-data');
    messageData.innerHTML = `${username} <span>Today</span>`;

    // create the message text element
    const messageText = document.createElement('p');
    messageText.classList.add('message-text');
    messageText.textContent = msg;

    // append the message data and text elements to the new list item
    newMessage.appendChild(messageData);
    newMessage.appendChild(messageText);

    // append the new list item to the messages body
    messagesBody.appendChild(newMessage);
  }


  

});


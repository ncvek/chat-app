const channel_id = 'gc8edFH10kjRhSCf';
const marvelNames = ["Iron Man", "Ant-Man", "Black Widow", "Thor Odinson", "War Machine", "Hawkeye", "Captain America", "The Hulk", "Captain Marvel", "Falcon", "Black Panther", "Star Lord", "Gamora", "Groot", "Rocket", "Doctor Strange", "Scarlet Witch", "Vision", "Loki", "Nebula", "Spider-Man", "Wong", "Winter Soldier"];
const roomName = 'marvel-chat-room';
const roomId = `observable-${roomName}`;

function getRandomCharacter() {
  const character = marvelNames[Math.floor(Math.random() * marvelNames.length)]
  return character;
 }

const drone = new ScaleDrone (channel_id, {
  data:{
    name: getRandomCharacter(),
  }
});

drone.on('open', error => {
  if (error) {
    return console.error(error);
    }
    console.log('Connected to Scaledrone.');

  const room = drone.subscribe(roomId);
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });
 
  room.on('data', (data, user) => {
      if(user){
        addMessageToListDOM(data, user);
      }else{
        
      }
  });
});

const DOM = {
  messages: document.querySelector('.messages-container'),
  form: document.querySelector('.form-container'),
  input: document.querySelector('.content'),
}

DOM.form.addEventListener('submit', () => {
  const value = DOM.input.value;
  if(value === ''){
    alert('Type a message');
    return;
  }
  DOM.input.value = '';
  drone.publish({
    room: roomId,
    message: value
  })
});  

const createUserElement = ((user) => {
  const name = user.clientData.name;
  const userElement = document.createElement('div');
  userElement.appendChild(document.createTextNode(name));
  userElement.className='user';
  return userElement;
})  

const createMessageElement = ((text, user) => {
  const messageElement = document.createElement('div');
  const userElement = createUserElement(user);
  messageElement.appendChild(userElement);
  messageElement.appendChild(document.createTextNode(text));
  messageElement.className='message';
  return messageElement;
})  

const addMessageToListDOM = (text, user) => {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, user));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}  


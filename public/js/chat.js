const socket = io();

// Elements
const $messageForm = document.querySelector('#messageform');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocation =  document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//OPTIONS
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix : true});

const autoScroll = () => {
    // New Message 
    const newMessage = $messages.lastElementChild;

    // Height of the new message(
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);

    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled
    const scrollOffSet = $messages.scrollTop + visibleHeight ;

    if(containerHeight - newMessageHeight <= scrollOffSet){
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message',(message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('MMMM Do YYYY, hh:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
});

socket.on('locationMessage',(message)=>{
    const html = Mustache.render(locationMessageTemplate,{
        username : message.username,
        url : message.url,
        createdAt : moment(message.createdAt).format('MMMM Do YYYY, hh:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
});

socket.on('roomdata',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled','disabled');

    const message = e.target.elements.message.value;

    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';

        $messageFormInput.focus();

        if(error){
            return console.log(error);
        }

        console.log('Message Delivered');
    });
});

//FUNCTION
$sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }

    $sendLocation.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },()=>{
            $sendLocation.removeAttribute('disabled');
            console.log('Location Shared');
        });
    });
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href = '/';
    }
});
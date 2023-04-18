// import React, { useEffect, useState } from 'react'
// import axios from 'axios'

// const Chat = () => {

//     const [chats, setChats] = useState([])

//     const fetchChats = async () => {
//         const {data} = await axios.get('http://localhost:8080/api/chats');
//         console.log(data);
//         setChats(data)
//     }
//     useEffect(() => {
//         fetchChats();
//     }, [])
//     return (
//         <div>
//             {chats.map(((chat,index) => { return (<div key={index} > {chat.users[0].name} </div>) }))}
//         </div>
//     )
// }

// export default Chat
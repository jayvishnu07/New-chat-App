import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'

const chatContext = createContext();

const ChatContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState({});
    const [selectedChat, setSelectedChat] = useState({});
    const [currentChat, setCurrentChat] = useState([]);
    useEffect(() => {
        if (!user) { navigate('/auth') }
    }, [navigate])
    return (
        <chatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, currentChat, setCurrentChat }}>{children}</chatContext.Provider>
    )
}

export const EntireChatState = () => {
    return useContext(chatContext);
}


export default ChatContextProvider;
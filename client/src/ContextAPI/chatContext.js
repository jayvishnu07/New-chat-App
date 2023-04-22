import { createContext, useContext, useEffect, useState } from "react";

const chatContext = createContext();

const ChatContextProvider=({children})=>{

    const [user , setUser] = useState({});
    useEffect(()=>{
        const result = JSON.parse(localStorage.getItem('userInfo'))
        setUser(result)
    },[localStorage])
    return(
        <chatContext.Provider value={{ user ,setUser }}>{children}</chatContext.Provider>
    )
}

export const EntireChatState=()=>{
    return useContext(chatContext);
}


export default ChatContextProvider;
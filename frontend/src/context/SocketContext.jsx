import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocketContext=()=>{
    return useContext(SocketContext);
}

export const SocketContextProvider=({children})=>{
    const [socket , setSocket]= useState(null);
    const [onlineUser,setOnlineUser]=useState([]);
    const [profilePicUpdated, setProfilePicUpdated] = useState(null);
    const {authUser} = useAuth();
    useEffect(()=>{
        if(authUser){
            const socketUrl = import.meta.env.MODE === 'production' 
                ? 'https://slrtech-chatapp.onrender.com/' 
                : 'http://localhost:3000/';
            const socket = io(socketUrl,{
                query:{
                    userId:authUser?._id,
                }
            })
            socket.on("getOnlineUsers",(users)=>{
                setOnlineUser(users)
            });
            
            // listen for profile picture updates from other users
            socket.on("profilePicUpdated",(data)=>{
                console.log('profile pic updated via socket:', data);
                setProfilePicUpdated(data);
            });
            
            setSocket(socket);
            return()=>socket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null); 
            }
        }
    },[authUser]);
    return(
    <SocketContext.Provider value={{socket , onlineUser, profilePicUpdated}}>
        {children}
    </SocketContext.Provider>
    )
}
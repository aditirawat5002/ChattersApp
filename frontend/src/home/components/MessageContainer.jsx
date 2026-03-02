import React, { useEffect, useState,useRef  } from 'react'
import userConversation from '../../Zustans/useConversation';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import axios from 'axios';
import { useSocketContext } from '../../context/SocketContext';
import notify from '../../assets/sound/notification.mp3';

const MessageContainer = ({ onBackUser }) => {
    const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
    const {socket} = useSocketContext();
    const { authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sending , setSending] = useState(false);
    const [sendData , setSnedData] = useState("")
    const lastMessageRef = useRef();

    useEffect(()=>{
      if(!socket) return;
      
      const handleNewMessage = (newMessage) => {
        const sound = new Audio(notify);
        sound.play();
        setMessage((prevMessages) => [...prevMessages, newMessage])
      };

      socket.on("newMessage", handleNewMessage);

      return ()=> socket.off("newMessage", handleNewMessage);
    },[socket])

    useEffect(()=>{
        setTimeout(()=>{
            lastMessageRef?.current?.scrollIntoView({behavior:"smooth"})
        },100)
    },[messages])

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const get = await axios.get(`/api/message/${selectedConversation?._id}`);
                const data = await get.data;
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                }
                setLoading(false);
                setMessage(data);
            } catch (error) {
                setLoading(false);
                console.log(error);

            }
        }

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessage])

    const handelMessages=(e)=>{
        setSnedData(e.target.value)
      }

    const handelSubmit=async(e)=>{
        e.preventDefault();
        setSending(true);
        try {
            const res =await axios.post(`/api/message/send/${selectedConversation?._id}`,{messages:sendData});
            const data = await res.data;
            if (data.success === false) {
                setSending(false);
                console.log(data.message);
            }
            setSending(false);
            setSnedData('')
            setMessage([...messages,data])
        } catch (error) {
            setSending(false);
            console.log(error);
        }
    }

    return (
        <div className='w-full h-full flex flex-col bg-gradient-to-b from-white/5 to-white/5'>
        {selectedConversation === null ? (
          <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center flex flex-col items-center gap-4'>
              <TiMessages className='text-7xl text-indigo-400' />
              <p className='text-3xl font-bold text-white'>
                Welcome back, <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>{authUser.username}</span>!
              </p>
              <p className="text-lg text-slate-300">Select a conversation to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/10 to-purple-600/10'>
              <button 
                onClick={() => onBackUser(true)}
                className='md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors'
              >
                <IoArrowBackSharp size={24} className='text-white' />
              </button>
              <div className='flex items-center gap-3 flex-1 md:flex-none'>
                <img 
                  className='w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-indigo-500' 
                  src={selectedConversation?.profilepic}
                  alt={selectedConversation?.username}
                />
                <div className='text-left'>
                  <p className='text-white font-semibold text-lg'>
                    {selectedConversation?.username}
                  </p>
                  <p className='text-slate-400 text-xs'>
                    {selectedConversation?.fullname}
                  </p>
                </div>
              </div>
            </div>
      
            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto scrollbar p-4 md:p-6 space-y-4'>
              {loading && (
                <div className="flex w-full h-full flex-col items-center justify-center">
                  <div className="loading loading-spinner text-indigo-500 text-5xl"></div>
                  <p className='text-slate-300 mt-4'>Loading messages...</p>
                </div>
              )}
              {!loading && messages?.length === 0 && (
                <div className='flex items-center justify-center h-full'>
                  <div className='text-center'>
                    <TiMessages className='text-6xl mb-4 text-slate-500 mx-auto' />
                    <p className='text-slate-300'>No messages yet. Say hi! 👋</p>
                  </div>
                </div>
              )}
              {!loading && messages?.length > 0 && messages?.map((message) => (
                <div 
                  key={message?._id} 
                  ref={lastMessageRef}
                  className={`flex ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl break-words ${
                    message.senderId === authUser._id 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none' 
                      : 'bg-white/15 text-white rounded-bl-none border border-white/20'
                  }`}>
                    <p className='text-sm'>{message?.message}</p>
                    <p className={`text-xs mt-1.5 opacity-70 ${
                      message.senderId === authUser._id ? 'text-white/60' : 'text-slate-300'
                    }`}>
                      {new Date(message?.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handelSubmit} className='px-4 md:px-6 py-4 border-t border-white/10'>
              <div className='flex gap-3 items-center'>
                <input 
                  value={sendData} 
                  onChange={handelMessages} 
                  required 
                  id='message' 
                  type='text' 
                  placeholder='Type a message...'
                  className='flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                />
                <button 
                  type='submit'
                  disabled={sending}
                  className='p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105'
                >
                  {sending ? (
                    <div className='loading loading-spinner loading-sm'></div>
                  ) : (
                    <IoSend size={20} />
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    )
}

export default MessageContainer
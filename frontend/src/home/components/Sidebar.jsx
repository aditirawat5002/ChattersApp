import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../Zustans/useConversation';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const {messages , setMessage, selectedConversation ,  setSelectedConversation} = userConversation();
    const { onlineUser , socket, profilePicUpdated} = useSocketContext();

    const nowOnline = chatUser.map((user)=>(user._id));
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
            setNewMessageUsers(newMessage)
        })
        return ()=> socket?.off("newMessage");
    },[socket,messages])

    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)

            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [authUser])
    
    // refetch user data when profile pic is updated
    useEffect(() => {
        if (profilePicUpdated) {
            setChatUser(prev => 
                prev.map(user => 
                    user._id === profilePicUpdated.userId 
                        ? { ...user, profilepic: profilePicUpdated.profilepic }
                        : user
                )
            );
            setSearchuser(prev =>
                prev.map(user =>
                    user._id === profilePicUpdated.userId
                        ? { ...user, profilepic: profilePicUpdated.profilepic }
                        : user
                )
            );
        }
    }, [profilePicUpdated])
    
    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            setLoading(false)
            if (data.length === 0) {
                toast.info("User Not Found")
            } else {
                setSearchuser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSetSelectedUserId(user._id);
        setNewMessageUsers('')
    }

    const handSearchback = () => {
        setSearchuser([]);
        setSearchInput('')
    }

    const handelLogOut = async () => {
        const confirmlogout = window.prompt(`Type '${authUser.username}' to logout`);
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout', {}, { withCredentials: true })
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log(data?.message);
                }
                toast.info(data?.message)
                localStorage.removeItem('chatapp')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        } else {
            toast.info("Logout cancelled")
        }
    }

    return (
        <div className='h-full w-full flex flex-col p-4 bg-gradient-to-b from-white/10 to-white/5'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white'>Messages</h2>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='h-12 w-12 rounded-full hover:scale-110 cursor-pointer border-2 border-indigo-500 transition-transform' 
                    alt='profile'
                />
                {/* always show logout icon next to avatar */}
                <button
                    onClick={handelLogOut}
                    disabled={loading}
                    className='ml-2 p-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-full transition-colors'
                    title='Logout'
                >
                    <BiLogOut size={20} />
                </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handelSearchSubmit} className='mb-6'>
                <div className='relative'>
                    <FaSearch className='absolute left-3 top-3.5 text-slate-400 text-sm' />
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        placeholder='Search users...'
                        className='w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                    />
                </div>
            </form>

            {/* User List */}
            {searchUser?.length > 0 ? (
                <>
                    <div className="flex-1 overflow-y-auto scrollbar space-y-2 mb-4">
                        {searchUser.map((user, index) => (
                            <div
                                key={user._id}
                                onClick={() => handelUserClick(user)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-102
                                    ${selectedUserId === user?._id 
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg' 
                                        : 'bg-white/10 hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                <div className='relative'>
                                    <img 
                                        src={user.profilepic} 
                                        alt={user.username}
                                        className='w-10 h-10 rounded-full object-cover'
                                    />
                                    {isOnline[index] && (
                                        <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                                    )}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='font-semibold text-white truncate'>{user.username}</p>
                                    <p className='text-xs text-slate-300'>{user.fullname}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={handSearchback}
                        className='flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all'>
                        <IoArrowBackSharp size={18} />
                        <span className='text-sm font-medium'>Back</span>
                    </button>
                </>
            ) : (
                <>
                    {loading ? (
                        <div className='flex-1 flex items-center justify-center'>
                            <div className='text-center'>
                                <div className='loading loading-spinner text-indigo-500 mb-2'></div>
                                <p className='text-slate-300 text-sm'>Loading chats...</p>
                            </div>
                        </div>
                    ) : chatUser.length === 0 ? (
                        <div className='flex-1 flex items-center justify-center'>
                            <div className='text-center'>
                                <p className='text-3xl mb-2'>👋</p>
                                <p className='text-white font-semibold mb-2'>No conversations yet</p>
                                <p className='text-slate-300 text-sm'>Search for users to start chatting</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto scrollbar space-y-2 mb-4">
                                {chatUser.map((user, index) => (
                                    <div
                                        key={user._id}
                                        onClick={() => handelUserClick(user)}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-102
                                            ${selectedUserId === user?._id 
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg' 
                                                : 'bg-white/10 hover:bg-white/20 border border-white/10'
                                            }`}
                                    >
                                        <div className='relative'>
                                            <img 
                                                src={user.profilepic} 
                                                alt={user.username}
                                                className='w-10 h-10 rounded-full object-cover'
                                            />
                                            {isOnline[index] && (
                                                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                                            )}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-semibold text-white truncate'>{user.username}</p>
                                            <p className='text-xs text-slate-300'>{user.fullname}</p>
                                        </div>
                                        {newMessageUsers.reciverId === authUser._id && newMessageUsers.senderId === user._id && (
                                            <div className='flex-shrink-0'>
                                                <div className='bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center'>+1</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={handelLogOut}
                                disabled={loading}
                                className='flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 font-semibold disabled:opacity-50'
                            >
                                <BiLogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Sidebar
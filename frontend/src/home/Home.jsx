import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {

  const [selectedUser , setSelectedUser] = useState(null);
  const [isSidebarVisible , setIsSidebarVisible]= useState(true);

  const handelUserSelect=(user)=>{
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  const handelShowSidebar=()=>{
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }
  return (

    <div className='flex items-center justify-center min-h-screen w-full p-4'>
      <div className='w-full max-w-6xl h-[95vh] rounded-2xl overflow-hidden
        shadow-2xl border border-white/20 glass-effect flex'>
        
        {/* Sidebar */}
        <div className={`w-full md:w-80 h-full border-r border-white/20 
          ${isSidebarVisible ? 'block' : 'hidden md:block'} 
          overflow-hidden flex flex-col bg-white/5`}>
          <Sidebar onSelectUser={handelUserSelect}/>
        </div>
        
        {/* Message Container */}
        <div className={`flex-1 h-full 
          ${selectedUser ? 'block' : 'hidden md:flex md:flex-col'} 
          bg-white/5`}>
          {selectedUser ? (
            <MessageContainer onBackUser={handelShowSidebar} />
          ) : (
            <div className='hidden md:flex items-center justify-center w-full h-full'>
              <div className='text-center'>
                <div className='text-6xl mb-4'>💬</div>
                <h2 className='text-2xl font-bold text-white mb-2'>Welcome to Chatter's</h2>
                <p className='text-slate-300'>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;


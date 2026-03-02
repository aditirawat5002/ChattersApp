import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { IoMail, IoLockClosed, IoPersonCircle } from 'react-icons/io5';

const Register = () => {
    const navigate = useNavigate()
    const {setAuthUser} = useAuth();
    const [loading , setLoading] = useState(false);
    const [inputData , setInputData] = useState({})

    const handelInput=(e)=>{
        setInputData({
            ...inputData , [e.target.id]:e.target.value
        })
    }

    const selectGender=(selectGender)=>{
        setInputData((prev)=>({
            ...prev , gender:selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handelSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true)
        if(inputData.password !== inputData.confpassword?.toLowerCase()){
            setLoading(false)
            return toast.error("Passwords don't match")
        }
        try {
            const register = await axios.post(`/api/auth/register`,inputData, { withCredentials: true });
            const data = register.data;
            if(data.success === false){
                setLoading(false)
                toast.error(data.message)
                console.log(data.message);
                return;
            }
            toast.success(data?.message)
            localStorage.setItem('chatapp',JSON.stringify(data))
            setAuthUser(data)
            setLoading(false)
            navigate('/login')
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                        Join Chatter's
                    </h1>
                    <p className='text-slate-300 text-lg'>Start connecting with friends today</p>
                </div>

                {/* Register Card */}
                <div className='glass-effect p-8 mb-6'>
                    <form onSubmit={handelSubmit} className='space-y-4'>
                        {/* Full Name */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white'>
                                Full Name
                            </label>
                            <div className='relative'>
                                <IoPersonCircle className='absolute left-3 top-3.5 text-slate-400 text-lg' />
                                <input
                                    id='fullname'
                                    type='text'
                                    onChange={handelInput}
                                    placeholder='John Doe'
                                    required
                                    className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white'>
                                Username
                            </label>
                            <div className='relative'>
                                <IoPersonCircle className='absolute left-3 top-3.5 text-slate-400 text-lg' />
                                <input
                                    id='username'
                                    type='text'
                                    onChange={handelInput}
                                    placeholder='johndoe'
                                    required
                                    className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <IoMail className='absolute left-3 top-3.5 text-slate-400 text-lg' />
                                <input
                                    id='email'
                                    type='email'
                                    onChange={handelInput}
                                    placeholder='you@example.com'
                                    required
                                    className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white'>
                                Password
                            </label>
                            <div className='relative'>
                                <IoLockClosed className='absolute left-3 top-3.5 text-slate-400 text-lg' />
                                <input
                                    id='password'
                                    type='password'
                                    onChange={handelInput}
                                    placeholder='Enter password'
                                    required
                                    className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white'>
                                Confirm Password
                            </label>
                            <div className='relative'>
                                <IoLockClosed className='absolute left-3 top-3.5 text-slate-400 text-lg' />
                                <input
                                    id='confpassword'
                                    type='password'
                                    onChange={handelInput}
                                    placeholder='Confirm password'
                                    required
                                    className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                                />
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white'>
                                Gender
                            </label>
                            <div className='flex gap-4'>
                                <label className='flex items-center gap-2 cursor-pointer text-white hover:text-indigo-300 transition-colors'>
                                    <input 
                                        onChange={()=>selectGender('male')}
                                        checked={inputData.gender === 'male'}
                                        type='radio' 
                                        name='gender'
                                        className='w-4 h-4 accent-indigo-500'
                                    />
                                    <span className='text-sm font-medium'>Male</span>
                                </label>
                                <label className='flex items-center gap-2 cursor-pointer text-white hover:text-indigo-300 transition-colors'>
                                    <input 
                                        checked={inputData.gender === 'female'}
                                        onChange={()=>selectGender('female')}
                                        type='radio'
                                        name='gender'
                                        className='w-4 h-4 accent-indigo-500'
                                    />
                                    <span className='text-sm font-medium'>Female</span>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type='submit'
                            disabled={loading}
                            className='w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className='flex items-center my-6'>
                        <div className='flex-1 border-t border-white/20'></div>
                        <span className='px-3 text-slate-400 text-sm'>Already have an account?</span>
                        <div className='flex-1 border-t border-white/20'></div>
                    </div>

                    {/* Login Link */}
                    <Link to='/login'>
                        <button type='button' className='w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-all duration-200'>
                            Login Here
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register
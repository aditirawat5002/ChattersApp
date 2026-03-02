import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoMail, IoLockClosed } from 'react-icons/io5';

const Login = () => {

    const navigate = useNavigate();
    const {setAuthUser} = useAuth();

    const [userInput, setUserInput] = useState({});
    const [loading, setLoading] = useState(false)

    const handelInput = (e) => {
        setUserInput({
            ...userInput, [e.target.id]: e.target.value
        })
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const login = await axios.post(`/api/auth/login`, userInput);
            const data = login.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            toast.success(data.message)
            localStorage.setItem('chatapp',JSON.stringify(data));
            setAuthUser(data)
            setLoading(false)
            navigate('/')
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
                        Chatter's
                    </h1>
                    <p className='text-slate-300 text-lg'>Connect with friends instantly</p>
                </div>

                {/* Login Card */}
                <div className='glass-effect p-8 mb-6'>
                    <form onSubmit={handelSubmit} className='space-y-5'>
                        {/* Email Field */}
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

                        {/* Password Field */}
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
                                    placeholder='Enter your password'
                                    required
                                    className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all' 
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type='submit'
                            disabled={loading}
                            className='w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className='flex items-center my-6'>
                        <div className='flex-1 border-t border-white/20'></div>
                        <span className='px-3 text-slate-400 text-sm'>Don't have an account?</span>
                        <div className='flex-1 border-t border-white/20'></div>
                    </div>

                    {/* Register Link */}
                    <Link to='/register'>
                        <button className='w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-all duration-200'>
                            Create New Account
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
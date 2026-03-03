import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';
import axios from 'axios';
import { IoArrowBack, IoMailSharp, IoPersonSharp, IoCamera } from 'react-icons/io5';
import { toast } from 'react-toastify';

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const { profilePicUpdated } = useSocketContext();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/users/profile/${id}`, {
                    withCredentials: true
                });
                setUser(response.data);
                setIsOwnProfile(authUser?._id === id);
            } catch (error) {
                console.log('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id, authUser]);

    // listen for profile picture updates and refresh if this is the updated user
    useEffect(() => {
        if (profilePicUpdated && user && profilePicUpdated.userId === user._id) {
            setUser(prev => ({
                ...prev,
                profilepic: profilePicUpdated.profilepic
            }));
        }
    }, [profilePicUpdated, user]);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target?.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadProfilePic = async () => {
        if (!previewImage) {
            toast.error('Please select an image first');
            return;
        }

        setUploading(true);
        try {
            const response = await axios.post('/api/user/update-profile-pic', 
                { profilepic: previewImage },
                { withCredentials: true }
            );

            if (response.data.success) {
                setUser(response.data.user);
                setPreviewImage(null);
                
                // Update auth context
                const updatedAuthUser = { ...authUser, profilepic: response.data.user.profilepic };
                setAuthUser(updatedAuthUser);
                localStorage.setItem('chatapp', JSON.stringify(updatedAuthUser));
                
                toast.success('Profile picture updated successfully!');
            }
        } catch (error) {
            console.log('Error uploading profile pic:', error);
            toast.error(error?.response?.data?.message || 'Failed to update profile picture');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='loading loading-spinner text-indigo-500 text-5xl mb-4'></div>
                    <p className='text-slate-300'>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className='min-h-screen flex items-center justify-center p-4'>
                <div className='text-center'>
                    <p className='text-3xl mb-4 text-slate-300 font-bold'>User not found</p>
                    <button 
                        onClick={() => navigate('/')}
                        className='px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all'
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/')}
                    className='flex items-center gap-2 mb-6 text-slate-300 hover:text-white transition-colors'
                >
                    <IoArrowBack size={20} />
                    <span>Back</span>
                </button>

                {/* Profile Card */}
                <div className='glass-effect p-8 rounded-2xl'>
                    {/* Profile Image */}
                    <div className='flex justify-center mb-6'>
                        <div className='relative'>
                            <img 
                                src={previewImage || user.profilepic} 
                                alt={user.fullname}
                                className='w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-xl'
                            />
                            {isOwnProfile && (
                                <label className='absolute bottom-0 right-0 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg'>
                                    <IoCamera size={20} className='text-white' />
                                    <input 
                                        type='file' 
                                        accept='image/*' 
                                        onChange={handleImageSelect}
                                        className='hidden'
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Upload Preview and Button */}
                    {isOwnProfile && previewImage && (
                        <div className='mb-6 p-4 bg-white/10 border border-white/20 rounded-lg'>
                            <p className='text-slate-300 text-sm mb-3'>Preview of new image</p>
                            <button
                                onClick={handleUploadProfilePic}
                                disabled={uploading}
                                className='w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {uploading ? 'Uploading...' : 'Save Profile Picture'}
                            </button>
                            <button
                                onClick={() => setPreviewImage(null)}
                                disabled={uploading}
                                className='w-full mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-semibold transition-all disabled:opacity-50'
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* User Info */}
                    <div className='text-center mb-8'>
                        <h2 className='text-3xl font-bold text-white mb-2'>{user.fullname}</h2>
                        <p className='text-indigo-400 text-lg font-semibold mb-4'>@{user.username}</p>
                        
                        {/* Details */}
                        <div className='space-y-3 text-left bg-white/5 p-4 rounded-lg border border-white/10'>
                            <div className='flex items-center gap-3 text-slate-300'>
                                <IoMailSharp className='text-indigo-500 flex-shrink-0' size={20} />
                                <span className='break-all'>{user.email}</span>
                            </div>
                            <div className='flex items-center gap-3 text-slate-300'>
                                <IoPersonSharp className='text-indigo-500 flex-shrink-0' size={20} />
                                <span className='capitalize'>{user.gender || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                        {!isOwnProfile && (
                            <button 
                                onClick={() => navigate(`/?chat=${id}`)}
                                className='flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105'
                            >
                                Send Message
                            </button>
                        )}
                        <button 
                            onClick={() => navigate('/')}
                            className={`px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold transition-all duration-200 ${!isOwnProfile ? '' : 'flex-1'}`}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

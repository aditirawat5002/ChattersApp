import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/users/profile/${id}`, {
                    withCredentials: true
                });
                setUser(response.data);
            } catch (error) {
                console.log('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id]);

    if (loading) {
        return <div className='flex items-center justify-center h-screen'>Loading...</div>;
    }

    if (!user) {
        return <div className='flex items-center justify-center h-screen'>User not found</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-base-200 p-4'>
            <div className='card w-96 bg-base-100 shadow-xl'>
                <figure className='px-10 pt-10'>
                    <img 
                        src={user.profilepic} 
                        alt={user.fullname}
                        className='rounded-full w-32 h-32 object-cover'
                    />
                </figure>
                <div className='card-body items-center text-center'>
                    <h2 className='card-title'>{user.fullname}</h2>
                    <p className='text-sm text-gray-500'>@{user.username}</p>
                    <p className='text-sm'>{user.email}</p>
                    <p className='text-sm capitalize'>{user.gender}</p>
                    
                    <div className='card-actions justify-end mt-4'>
                        {authUser?._id !== id && (
                            <button 
                                className='btn btn-primary'
                                onClick={() => navigate(`/?chat=${id}`)}
                            >
                                Send Message
                            </button>
                        )}
                        <button 
                            className='btn btn-ghost'
                            onClick={() => navigate('/')}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

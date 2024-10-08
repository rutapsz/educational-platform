import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ token }) => {
    const [profile, setProfile] = useState({ login: '', email: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user-profile/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [token]);

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Login:</strong> {profile.login}</p>
            <p><strong>Email:</strong> {profile.email}</p>
        </div>
    );
};

export default Profile;

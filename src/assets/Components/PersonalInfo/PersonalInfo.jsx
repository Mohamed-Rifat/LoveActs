import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

export default function PersonalInfo() {
    const [userData, setUserData] = useState({
        name: "User",
        email: "User",
        phone: "User",
    });
    function UserAvatar({ name }) {
        const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
        return (
            <div className="w-24 h-24 rounded-full bg-[#FDE9EE] flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
                {firstLetter}
            </div>
        );
    }

    useEffect(() => {
        try {
            const user = localStorage.getItem("user");
            if (user) {
                const parsedUser = JSON.parse(user);
                setUserData({
                    name: parsedUser.name || "User",
                    email: parsedUser.email || "User",
                    phone: parsedUser.phone || "User",
                    role: parsedUser.role
                });
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }, []);

    const InfoItem = ({ title, value }) => (
        <div className='flex flex-col gap-2 p-4 border-b last:border-b-0'>
            <p className='text-lg font-semibold text-gray-800'>{title}</p>
            <p className='text-sm text-gray-600'>{value}</p>
        </div>
    );


    return (
        <div className='container mx-auto '>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>

                <div className='px-6 py-8 border-b border-gray-100 flex flex-col items-center'>
                    <div className='relative mb-4'>
                        <UserAvatar name={userData.name} />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-800'>{userData.name}</h3>
                    <p className={`${userData.role?.toLowerCase() === "admin" ? "text-yellow-500 font-semibold" : "text-gray-500"}`}>
                        {userData.role?.toLowerCase() === "admin" ? "Premium Admin" : userData.role ? "Member Client" : ""}
                    </p>
                </div>


                <div className='divide-y divide-gray-100'>
                    <InfoItem
                        title="Full Name"
                        value={userData.name}
                        icon={FiUser}
                        editable={true}
                    />
                    <InfoItem
                        title="Email Address"
                        value={userData.email}
                        icon={FiMail}
                        editable={true}
                    />
                    <InfoItem
                        title="Phone Number"
                        value={userData.phone}
                        icon={FiPhone}
                        editable={true}
                    />
                </div>

            </div>

            <div className='mt-6 p-5 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3'>
                <div className='p-2 bg-yellow-100 rounded-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-9a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h4 className='font-medium text-yellow-800'>Security Note</h4>
                    <p className='text-yellow-700 text-sm mt-1'>Your personal information is encrypted and securely stored. We never share your data with third parties.</p>
                </div>
            </div>
        </div>
    );
};
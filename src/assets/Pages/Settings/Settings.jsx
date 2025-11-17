import { CiDeliveryTruck } from 'react-icons/ci'
import { FaRegUser } from 'react-icons/fa'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import { NavLink, Outlet } from 'react-router-dom'
import { useToken } from './../../Context/TokenContext/TokenContext';

export default function Settings() {
  const { token, user } = useToken();
  const linkClasses = ({ isActive }) =>
    `flex gap-2 items-center border-b rounded transition-all duration-200 p-2 ${isActive ? 'bg-[#FDE9EE]' : 'bg-transparent hover:bg-gray-100'
    } cursor-pointer`

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className="flex flex-col md:flex-row justify-center items-start gap-5">
        <div className='w-full md:w-1/5 border rounded-md p-3'>
          <ul className='text-lg'>
            <NavLink to={''} end className={linkClasses}>
              <FaRegUser />
              <p>Personal information</p>
            </NavLink>
           {user?.role === "User" && (
            <NavLink to={'privacy'} className={linkClasses}>
              <MdOutlinePrivacyTip />
              <p>Privacy</p>
            </NavLink>
            )}
          {user?.role === "User" && (
            <NavLink to={'orders'} className={linkClasses}>
              <CiDeliveryTruck />
              <p>Orders</p>
            </NavLink>
            )}
          </ul>
        </div>

        <div className='w-full md:w-4/5'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

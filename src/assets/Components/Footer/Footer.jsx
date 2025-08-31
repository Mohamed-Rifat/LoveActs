import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-[#FDE6F0]">
      <div className="mx-auto p-6 lg:py-8 container px-4">
        <div className="md:flex md:justify-between md:items-start gap-12">
          <div className="flex justify-center md:justify-start mb-6 md:mb-0">
            <a href="/">
              <img src="./Logo.PNG" className="h-32 w-auto" alt="Love Acts Logo" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">  
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-black">Follow us</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-2">
                <li><a href="https://www.tiktok.com/@loveacts.co" target="_blank" className="hover:underline">Tiktok</a></li>
                <li><a href="https://www.instagram.com/loveacts.co" target="_blank" className="hover:underline">Instagram</a></li>
                <li><a href="https://www.facebook.com/share/1C97Fizo2P" target="_blank" className="hover:underline">Facebook</a></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-black">Legal</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-2">
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms &amp; Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-400" />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left space-y-3 sm:space-y-0">
          <span className="text-sm text-gray-500">
            © {new Date().getFullYear()} LoveActs™. All Rights Reserved.
          </span>
          <span className="text-sm text-gray-500">
            Designed By <a href="https://mohamed-refaat.vercel.app/" target="_blank" className="hover:text-pink-500">Mohamed Refaat</a>
          </span>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useContext, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BurgerIcon from './BurgerIcon'
import { AuthContext } from '../context/authContext'
import Switch from './Switch'

const Navbar: React.FC = () => {
  const { isAdmin, setIsAdmin } = useContext(AuthContext)

  const [menuOpen, setMenuOpen] = useState(false)
  const [isHomePage, setIsHomePage] = useState(null)
  const switchRef = useRef<HTMLInputElement>(null)

  const pathname = usePathname()

  useEffect(() => {
    setIsHomePage(pathname === '/')
  }, [pathname])

  const handleToggle = () => {
    setMenuOpen(!menuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    setIsAdmin(false)
    setMenuOpen(false)
  }

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  const handleEditModeClick = () => {
    if (switchRef.current) {
      switchRef.current.click()
    }
  }

  return (
    <nav className="h-20 fixed w-full flex justify-between items-center z-50">
      <div></div>
      <Link href="./">
        <h1
          className={`${
            isHomePage ? 'text-white' : 'text-gray-500'
          } text-3xl cursor-pointer`}
          onClick={handleLinkClick}
        >
          RAMA GAGO
        </h1>
      </Link>
      <BurgerIcon
        menuOpen={menuOpen}
        handleToggle={handleToggle}
        isHomePage={isHomePage}
      />
      <div
        className={`fixed inset-0 bg-white z-40 flex flex-col justify-center items-center transition-opacity ${
          menuOpen
            ? 'opacity-100 pointer-events-auto duration-700'
            : 'opacity-0 pointer-events-none duration-300'
        }`}
      >
        <Link
          href="/fashion"
          className="text-6xl my-2 hover:text-gray-300 focus:text-gray-300 active:text-gray-500"
          onClick={handleLinkClick}
        >
          FASHION
        </Link>
        <Link
          href="/wedding"
          className="text-6xl my-2 hover:text-gray-300 focus:text-gray-300 active:text-gray-500"
          onClick={handleLinkClick}
        >
          WEDDING
        </Link>
        <Link
          href="/home-decor"
          className="text-6xl my-2 hover:text-gray-300 focus:text-gray-300 active:text-gray-500"
          onClick={handleLinkClick}
        >
          HOME & DECOR
        </Link>
        <Link
          href="/lifestyle"
          className="text-6xl my-2 hover:text-gray-300 focus:text-gray-300 active:text-gray-500"
          onClick={handleLinkClick}
        >
          LIFESTYLE
        </Link>
        <Link
          href="/#contact"
          className="text-6xl my-2 hover:text-gray-300 focus:text-gray-300 active:text-gray-500"
          onClick={handleLinkClick}
        >
          CONTACT
        </Link>
        {isAdmin && (
          <div className="flex items-center">
            <button
              className="text-6xl mb-2 mt-16 hover:text-gray-300 active:text-gray-500"
              onClick={handleEditModeClick}
            >
              EDIT MODE
            </button>
            <Switch ref={switchRef} />
          </div>
        )}
        {isAdmin && (
          <button
            onClick={handleLogout}
            className="text-6xl my-2 hover:text-gray-300 focus:text-gray-300 active:text-gray-500"
          >
            LOG OUT
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar

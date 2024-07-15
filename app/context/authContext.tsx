'use client'
import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      setIsAdmin(true)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAdmin, setIsAdmin, editMode, setEditMode }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

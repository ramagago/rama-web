'use client'
import { createContext, useState, useEffect, ReactNode } from 'react'

export interface AuthContextProps {
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  isPhotoDetail: boolean | null
  setIsPhotoDetail: (isPhotoDetail: boolean) => void
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isPhotoDetail, setIsPhotoDetail] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      setIsAdmin(true)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
        editMode,
        setEditMode,
        isPhotoDetail,
        setIsPhotoDetail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

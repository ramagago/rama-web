import React, { forwardRef, useContext } from 'react'
import { AuthContext } from '../context/authContext'

const Switch = forwardRef<HTMLInputElement>((props, ref) => {
  const { editMode, setEditMode } = useContext(AuthContext)

  const handleChange = () => {
    setEditMode(!editMode)
    console.log('Edit mode:', !editMode)
  }

  return (
    <div className="inline-flex items-center mt-12 ml-10">
      <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
        <input
          id="switch-component"
          type="checkbox"
          className="absolute w-16 h-8 transition-colors duration-300 bg-gray-400 rounded-full appearance-none cursor-pointer peer bg-blue-gray-100 checked:bg-gray-900 peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
          ref={ref}
          {...props}
          checked={editMode}
          onChange={handleChange}
        />
        <label
          htmlFor="switch-component"
          className="before:content[''] absolute top-2/4 -left-1 h-8 w-8 -translate-y-2 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-10 peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
        >
          <div
            className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
            data-ripple-dark="true"
          ></div>
        </label>
      </div>
    </div>
  )
})

// Agregar displayName al componente
Switch.displayName = 'Switch'

export default Switch

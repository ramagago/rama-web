import React from 'react'

interface BurgerIconProps {
  menuOpen: boolean
  handleToggle: () => void
  isHomePage: boolean
}

const BurgerIcon: React.FC<BurgerIconProps> = ({
  menuOpen,
  handleToggle,
  isHomePage,
}) => {
  const handleColorChange = (defaultColor: string) => {
    if (menuOpen) return 'bg-black'
    if (isHomePage) return 'bg-white'
    return defaultColor
  }

  return (
    <div
      className={`relative flex justify-center items-center w-20 h-20 cursor-pointer transition-all duration-300 z-50`}
      onClick={handleToggle}
    >
      <div className="w-12 h-12 relative z-50">
        <div
          className={`w-full h-0.5 rounded-full shadow-md transition-all duration-500 ${handleColorChange(
            'bg-gray-500'
          )} ${
            menuOpen ? 'rotate-45 translate-y-6 bg-black mb-1' : 'mb-3 mt-2 '
          }`}
        ></div>
        <div
          className={`w-full h-0.5 rounded-full shadow-md transition-all duration-500 ${handleColorChange(
            'bg-gray-500'
          )} ${menuOpen ? 'opacity-0 -translate-x-2 translate-y-4' : 'mb-3'}`}
        ></div>
        <div
          className={`w-full h-0.5  rounded-full shadow-md transition-all duration-500 ${handleColorChange(
            'bg-gray-500'
          )} ${menuOpen ? '-rotate-45 translate-y-4 bg-black mb-1' : 'mb-0'}`}
        ></div>
      </div>
    </div>
  )
}

export default BurgerIcon

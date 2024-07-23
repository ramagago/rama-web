import { useEffect, FC, useState, FormEvent } from 'react'

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  imageId: string // Añadimos el id de la imagen a editar
  currentDescription: string // Añadimos la descripción actual de la imagen
}

const EditDescriptionModal: FC<ModalProps> = ({
  isVisible,
  onClose,
  imageId,
  currentDescription,
}) => {
  const [showAnimation, setShowAnimation] = useState(false)
  const [description, setDescription] = useState(currentDescription)

  const handleChangeDescription = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:3001/images/description', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, id: imageId }),
      })

      if (!response.ok) {
        throw new Error('Error updating description')
      }

      onClose() // Cerrar el modal después de actualizar la descripción
    } catch (error) {
      console.error('Failed to update description:', error)
    }
  }

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
      setShowAnimation(true)
      setDescription(currentDescription) // Actualiza la descripción cuando el modal se hace visible
    } else {
      setShowAnimation(false)
      document.body.style.overflow = 'auto'
    }
  }, [isVisible, currentDescription])

  if (!isVisible && !showAnimation) return null

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-black bg-opacity-10 flex items-center justify-center">
      <div
        className={`bg-white w-full xs:w-3/4 lg:w-1/2 rounded-lg p-6 relative flex flex-col items-center justify-center transition-transform duration-300 ${
          showAnimation ? 'animate-scale-up-in' : ''
        }`}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 p-2 rounded-full"
          onClick={onClose}
        >
          X
        </button>
        <form
          onSubmit={handleChangeDescription}
          className="w-full flex flex-col items-center"
        >
          <div className="relative h-11 w-5/6 xs:w-3/4 lg:w-3/5 my-6">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Add or change photo info.
            </label>
          </div>
          <input
            type="submit"
            value="Save"
            className="cursor-pointer p-2 text-sm hover:text-gray-300"
          />
        </form>
      </div>
    </div>
  )
}

export default EditDescriptionModal

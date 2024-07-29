// components/ModalAddFiles.tsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useDropzone } from 'react-dropzone'

interface ModalAddFilesProps {
  isOpen: boolean
  onClose: () => void
  categoryId: string
}

const ModalAddFiles: React.FC<ModalAddFilesProps> = ({
  isOpen,
  onClose,
  categoryId,
}) => {
  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
    },
  })

  const getFileType = (file: File): string => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'heif']
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'm4v'] // Añadido 'm4v' aquí

    const extension = file.name.split('.').pop()?.toLowerCase()

    if (extension && imageExtensions.includes(extension)) {
      return 'image'
    } else if (extension && videoExtensions.includes(extension)) {
      return 'video'
    } else {
      return 'unknown' // Puedes manejar otros tipos si es necesario
    }
  }

  const handleSubmit = async () => {
    const imageData = files.map(async (file, index) => {
      const response = await fetch('http://localhost:3001/upload/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: file.name }),
      })

      const { uploadUrl, key } = await response.json()

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
      })

      const fileType = getFileType(file) // Utilizar la función aquí

      return {
        description: '',
        category: categoryId,
        order: index + 1,
        url: `https://ramawebsite.s3.amazonaws.com/${key}`,
        type: fileType, // Añadir type aquí
      }
    })

    const imageDataArray = await Promise.all(imageData)

    try {
      const response = await fetch('http://localhost:3001/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: imageDataArray }),
      })

      if (response.ok) {
        console.log('Files uploaded and data saved successfully')
        onClose()
      } else {
        console.error('Failed to upload files and save data')
      }
    } catch (error) {
      console.error('Error uploading files and saving data', error)
    }
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Upload Files</h2>
        <div
          {...getRootProps({
            className: 'border-dashed border-2 border-gray-400 p-6 text-center',
          })}
        >
          <input {...getInputProps()} />
          <p>Drag & drop some files here, or click to select files</p>
        </div>
        <ul className="mt-4">
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ModalAddFiles

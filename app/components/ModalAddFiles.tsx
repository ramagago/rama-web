// components/ModalAddFiles.js
import { useState } from 'react'
import ReactDOM from 'react-dom'
import { useDropzone } from 'react-dropzone'

const ModalAddFiles = ({ isOpen, onClose, categoryId }) => {
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles)
    },
  })

  const handleSubmit = async () => {
    const formData = new FormData()
    const imageData = files.map((file, index) => ({
      description: '',
      category: categoryId,
      order: index + 1,
    }))

    files.forEach((file) => {
      formData.append('files', file)
    })
    formData.append('imageData', JSON.stringify(imageData))

    try {
      const response = await fetch('http://localhost:3001/images', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        console.log('Files uploaded successfully')
        onClose()
      } else {
        console.error('Failed to upload files')
      }
    } catch (error) {
      console.error('Error uploading files', error)
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
            <li key={file.path}>{file.path}</li>
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

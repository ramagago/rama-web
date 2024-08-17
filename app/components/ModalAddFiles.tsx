import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'

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
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'm4v']

    const extension = file.name.split('.').pop()?.toLowerCase()

    if (extension && imageExtensions.includes(extension)) {
      return 'image'
    } else if (extension && videoExtensions.includes(extension)) {
      return 'video'
    } else {
      return 'unknown'
    }
  }

  const compressImage = async (
    file: File,
    maxSizeMB: number,
    maxWidthOrHeight: number,
    useWebWorker: boolean = true
  ) => {
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
    }
    return await imageCompression(file, options)
  }

  const uploadFile = async (compressedFile: File, suffix: string) => {
    const response = await fetch('http://localhost:3001/upload/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: `${compressedFile.name}-${suffix}` }),
    })

    const { uploadUrl, key } = await response.json()

    await fetch(uploadUrl, {
      method: 'PUT',
      body: compressedFile,
    })

    return `https://ramawebsite.s3.amazonaws.com/${key}`
  }

  const handleSubmit = async () => {
    const imageData = files.map(async (file, index) => {
      const fileType = getFileType(file)
      let lowQualityUrl, normalUrl, blurDataUrl, videoPreviewUrl

      if (fileType === 'image') {
        // Compresión para imágenes
        const lowQualityFile = await compressImage(file, 0.5, 1000)
        const normalFile = await compressImage(file, 1, 1000)

        // Generación de blurDataUrl
        blurDataUrl = await new Promise<string>(async (resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(await compressImage(file, 0.001, 50))
        })

        // Subida de imágenes a S3
        lowQualityUrl = await uploadFile(lowQualityFile, 'low-quality')
        normalUrl = await uploadFile(normalFile, 'normal')
      } else if (fileType === 'video') {
        normalUrl = await uploadFile(file, 'normal')
      }

      return {
        description: '',
        category: categoryId,
        order: index + 1,
        lowQualityUrl, // Solo para imágenes
        normalUrl,
        blurDataUrl, // Solo para imágenes
        videoPreviewUrl, // Solo para videos
        type: fileType,
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

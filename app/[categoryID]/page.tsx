'use client'
import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { MasonryGrid } from '../components/MasonryGrid'
import SwipeableEdgeDrawer from '../components/Drawer'
import { AuthContext } from '../context/authContext'
import ModalAddFiles from '../components/ModalAddFiles'
import { FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa6'

interface Photo {
  id: string
  blurDataUrl: string
  lowQualityUrl: string
  normalUrl: string
  selected: boolean
  order: number
  description: string
  type: string
  videoPreviewUrl: string
}

interface PhotoGalleryProps {
  params: {
    categoryID: string
    id?: string
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ params }) => {
  const categoryId = params.categoryID
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const { editMode } = useContext(AuthContext)
  const contexto = useContext(AuthContext)
  const editMode = contexto?.editMode
  const [items, setItems] = useState<Photo[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [isDraggable, setIsDraggable] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const isPhotoDetail = contexto?.isPhotoDetail

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/images?category=${categoryId}&page=${page}&limit=10`
        )
        const images: Photo[] = response.data
          .sort((a: Photo, b: Photo) => a.order - b.order)
          .map((image: any) => ({
            ...image,
            selected: false,
          }))

        setItems((prevItems) => [...prevItems, ...images])

        if (images.length < 10) {
          setHasMore(false)
        }
      } catch (error) {
        console.error('Failed to fetch images:', error)
      }
    }

    fetchImages()
    console.log('se ejecuto fetch')
  }, [categoryId, page])

  const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: {
    active: { id: UniqueIdentifier }
    over: { id: UniqueIdentifier } | null
  }) => {
    const { active, over } = event
    setActiveId(null)

    if (active && over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)

        // Update the order in the database
        axios
          .patch(
            `${apiUrl}/images/order`,
            newItems.map((item, index) => ({
              id: parseInt(item.id),
              order: index,
            }))
          )
          .then(() => console.log('Successfully updated image order'))
          .catch((error) =>
            console.error('Failed to update image order:', error)
          )

        return newItems
      })
    }
  }

  const handleDeletePhotos = async (selectedPhotos: string[]) => {
    try {
      // Delete photos in the backend
      const response = await axios.delete(`${apiUrl}/images/many`, {
        data: selectedPhotos, // Asegúrate de enviar el cuerpo en formato JSON
        headers: {
          'Content-Type': 'application/json', // Establece el tipo de contenido como JSON
        },
      })
      console.log('Successfully deleted photos')
      // Aquí deberías actualizar el estado local para reflejar los cambios
      setItems((prevItems) =>
        prevItems.filter((item) => !selectedPhotos.includes(item.id))
      )
      setSelectedPhotos([]) // Limpiar la selección
    } catch (error) {
      console.error('Failed to delete photos:', error)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSelectPhoto = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
    setSelectedPhotos((prevSelectedPhotos) => {
      const isSelected = prevSelectedPhotos.includes(id)
      const updatedSelectedPhotos = isSelected
        ? prevSelectedPhotos.filter((photoId) => photoId !== id)
        : [...prevSelectedPhotos, id]
      console.log('Selected photos:', updatedSelectedPhotos)
      return updatedSelectedPhotos
    })
  }

  const handleSelectButtonClick = () => {
    setIsDraggable((prev) => !prev)
    console.log('isDraggable:', !isDraggable)
    if (!isDraggable) {
      setSelectedPhotos([])
    }
  }

  const activeItem = items.find((item) => item.id === activeId)

  return (
    <div className="bg-white">
      <SwipeableEdgeDrawer />
      {!isPhotoDetail && (
        <nav className="bg-white w-screen h-12 flex justify-center border-gray-300 fixed top-20 z-40">
          <div className="cursor-pointer py-2 px-4">
            <Link href="/fashion">
              <div
                className={`transition-all duration-100 ${
                  categoryId === 'fashion' ? 'text-red-800' : 'text-gray-600'
                } hover:text-gray-400`}
              >
                Fashion
              </div>
            </Link>
          </div>
          <div className="cursor-pointer py-2 px-4">
            <Link href="/home">
              <div
                className={`transition-all duration-100 ${
                  categoryId === 'home' ? 'text-red-800' : 'text-gray-600'
                } hover:text-gray-400`}
              >
                Home
              </div>
            </Link>
          </div>
          <div className="cursor-pointer py-2 px-4">
            <Link href="/lifestyle">
              <div
                className={`transition-all duration-100 ${
                  categoryId === 'lifestyle' ? 'text-red-800' : 'text-gray-600'
                } hover:text-gray-400`}
              >
                Lifestyle
              </div>
            </Link>
          </div>
          <div className="cursor-pointer py-2 px-4">
            <Link href="/weddings">
              <div
                className={`transition-all duration-100 ${
                  categoryId === 'weddings' ? 'text-red-800' : 'text-gray-600'
                } hover:text-gray-400`}
              >
                Weddings
              </div>
            </Link>
          </div>
        </nav>
      )}
      {editMode && (
        <button
          onClick={handleSelectButtonClick}
          className=" fixed top-20 right-8 z-40 mb-4 p-2 h-10 w-24 bg-gray-400 hover:bg-gray-600 active:bg-gray-500 text-white rounded-full"
        >
          {!isDraggable ? 'Cancel' : 'Select'}
        </button>
      )}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <MasonryGrid
          items={items}
          editMode={editMode}
          onPhotoSelect={handleSelectPhoto}
          categoryId={categoryId}
          isDraggable={isDraggable}
          selectedPhotos={selectedPhotos}
          setSelectedPhotos={setSelectedPhotos}
          fetchMore={() => setPage((prevPage) => prevPage + 1)} // Añadido aquí
          hasMore={hasMore}
        />
        <DragOverlay>
          {activeItem ? (
            <div className="relative overflow-hidden post">
              <Image
                className="w-full grayscale-[50%] rounded-lg"
                src={activeItem.normalUrl} // Usa la URL de normal quality aquí
                placeholder="blur"
                blurDataURL={activeItem.blurDataUrl}
                alt={`Image ${activeItem.id}`}
                width={140}
                height={140}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-[#161616] flex items-center justify-center opacity-0 transition-opacity duration-300 overlay">
                <h3 className="text-white">{`Image ${activeItem.id}`}</h3>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {editMode && (
        <div className="flex space-x-2">
          <button
            onClick={handleOpenModal}
            className="fixed p-6 bg-sky-500 text-white bottom-48 right-24 rounded-full hover:bg-sky-200 active:bg-sky-700"
          >
            <FaPlus />
          </button>
          <button
            onClick={() => handleDeletePhotos(selectedPhotos)}
            className="fixed p-6 bg-red-900 text-white bottom-24 right-24 rounded-full hover:bg-red-300 active:bg-red-700"
          >
            <FaTrash />
          </button>
        </div>
      )}
      <Link className="fixed top-8 left-8 z-[1401]" href="/">
        <FaArrowLeft className="text-gray-400 text-2xl  hover:text-gray-600 active:text-gray-500" />
      </Link>
      <ModalAddFiles
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        categoryId={categoryId}
      />
    </div>
  )
}

export default PhotoGallery

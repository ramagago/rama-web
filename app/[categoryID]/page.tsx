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
import { AuthContext } from '../context/authContext'
import ModalAddFiles from '../components/ModalAddFiles'
import { FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'

interface Photo {
  id: string
  image: string
  selected: boolean
  order: number
}

interface PhotoGalleryProps {
  params: {
    categoryID: string
  }
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ params }) => {
  const categoryId = params.categoryID
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const { editMode } = useContext(AuthContext)
  const contexto = useContext(AuthContext)
  const editMode = contexto?.editMode
  const [items, setItems] = useState<Photo[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/images?category=${categoryId}`
        )
        const images: Photo[] = response.data
          .sort((a: Photo, b: Photo) => a.order - b.order)
          .map((image: any) => ({
            id: image.id.toString(),
            image: image.url,
            selected: false,
            order: image.order,
          }))
        setItems(images)
      } catch (error) {
        console.error('Failed to fetch images:', error)
      }
    }

    fetchImages()
  }, [categoryId])

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
            'http://localhost:3001/images/order',
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

  const handleDeletePhotos = () => {
    const photosToDelete = items.filter((item) => item.selected)
    const remainingPhotos = items.filter((item) => !item.selected)

    // Delete photos in the backend
    axios
      .post('http://localhost:3001/images/deleteMany', {
        ids: photosToDelete.map((item) => parseInt(item.id)),
      })
      .then(() => console.log('Successfully deleted photos'))
      .catch((error) => console.error('Failed to delete photos:', error))

    setItems(remainingPhotos)
    setSelectedPhotos([])
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

  const activeItem = items.find((item) => item.id === activeId)

  return (
    <div className="bg-white">
      <div className="m-2">
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
          />
          <DragOverlay>
            {activeItem ? (
              <div className="relative overflow-hidden post">
                <Image
                  className="w-full grayscale-[50%] rounded-lg"
                  src={activeItem.image}
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
      </div>
      {editMode && (
        <div className="flex space-x-2">
          <button
            onClick={handleOpenModal}
            className="fixed p-6 bg-sky-500 text-white bottom-48 right-24 rounded-full hover:bg-sky-200 active:bg-sky-700"
          >
            <FaPlus />
          </button>
          <button
            onClick={handleDeletePhotos}
            className="fixed p-6 bg-red-900 text-white bottom-24 right-24 rounded-full hover:bg-red-300 active:bg-red-700"
          >
            <FaTrash />
          </button>
        </div>
      )}
      <Link href="/">volver</Link>
      <ModalAddFiles
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        categoryId={categoryId}
      />
    </div>
  )
}

export default PhotoGallery

'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FaPen } from 'react-icons/fa6'
import EditDescriptionModal from './EditDescriptionModal'

interface Photo {
  id: string
  image: string
  description: string
}

interface MasonryGridProps {
  items: Photo[]
  editMode: boolean | undefined
  onPhotoSelect: (id: string) => void
  categoryId: string
  isDraggable: boolean
  selectedPhotos: string[]
  setSelectedPhotos: React.Dispatch<React.SetStateAction<string[]>>
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  items,
  editMode,
  selectedPhotos,
  setSelectedPhotos,
  categoryId,
  isDraggable,
}) => {
  const [columns, setColumns] = useState(2)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleOpenModal = () => {
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setColumns(2)
      } else if (window.innerWidth >= 600 && window.innerWidth < 920) {
        setColumns(3)
      } else if (window.innerWidth >= 920 && window.innerWidth < 1250) {
        setColumns(4)
      } else {
        setColumns(5)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const columnWrappers: { [key: string]: Photo[] } = {}
  for (let i = 0; i < columns; i++) {
    columnWrappers[`column${i}`] = []
  }

  items.forEach((item, i) => {
    const column = i % columns
    columnWrappers[`column${column}`].push(item)
  })

  const handlePhotoClick = (id: string) => {
    setSelectedPhotos((prevSelectedPhotos) => {
      const isSelected = prevSelectedPhotos.includes(id)
      const updatedSelectedPhotos = isSelected
        ? prevSelectedPhotos.filter((photoId) => photoId !== id)
        : [...prevSelectedPhotos, id]
      console.log('Selected photos:', updatedSelectedPhotos)
      return updatedSelectedPhotos
    })
  }

  const SortableItem: React.FC<{
    id: string
    children: React.ReactNode
    draggable: boolean
  }> = ({ id, children, draggable }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id,
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition || 'transform 250ms ease',
      zIndex: isDragging ? 50 : 'auto',
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...(draggable ? { ...attributes, ...listeners } : {})}
      >
        {children}
      </div>
    )
  }

  return (
    <div className="relative top-12 w-full flex gap-2 p-[100px_2vw]">
      {Object.keys(columnWrappers).map((columnKey, idx) => (
        <div key={idx} className="flex flex-1 flex-col gap-2">
          <SortableContext
            items={columnWrappers[columnKey]}
            strategy={horizontalListSortingStrategy}
          >
            {columnWrappers[columnKey].map((post) => {
              const isSelected = selectedPhotos.includes(post.id)

              return (
                <div
                  key={post.id}
                  className={`relative overflow-hidden post ${
                    isSelected ? 'opacity-40' : ''
                  }`}
                >
                  {!editMode ? (
                    <Link href={`/${categoryId}/${post.id}`}>
                      <Image
                        className="w-full grayscale-[50%] rounded-xl"
                        src={post.image}
                        alt={`Image ${post.id}`}
                        width={140}
                        height={140}
                      />
                    </Link>
                  ) : (
                    <>
                      <div className="relative overflow-hidden">
                        <SortableItem id={post.id} draggable={isDraggable}>
                          <Image
                            onClick={() => handlePhotoClick(post.id)}
                            className="w-full grayscale-[50%] rounded-xl"
                            src={post.image}
                            alt={`Image ${post.id}`}
                            width={140}
                            height={140}
                          />
                        </SortableItem>
                        {editMode && (
                          <FaPen
                            className="absolute cursor-pointer text-white text-3xl bottom-2 right-2 p-2 bg-gray-500 hover:bg-gray-200 active:bg-gray-700 rounded-full"
                            onClick={handleOpenModal} // Corregido aquí
                          />
                        )}
                        <EditDescriptionModal
                          isVisible={isModalVisible}
                          onClose={handleCloseModal}
                          imageId={post.id} // Pasar directamente post.id
                          currentDescription={post.description} // Pasar directamente post.description
                        />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </SortableContext>
        </div>
      ))}
    </div>
  )
}

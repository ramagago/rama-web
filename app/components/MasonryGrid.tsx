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
import InfiniteScroll from 'react-infinite-scroll-component'

interface Photo {
  id: string
  blurDataUrl: string
  lowQualityUrl: string
  normalUrl: string
  description: string
  type: string
  videoPreviewUrl: string
}

interface MasonryGridProps {
  items: Photo[]
  editMode: boolean | undefined
  onPhotoSelect: (id: string) => void
  categoryId: string
  isDraggable: boolean
  selectedPhotos: string[]
  setSelectedPhotos: React.Dispatch<React.SetStateAction<string[]>>
  fetchMore: () => void
  hasMore: boolean
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  items,
  editMode,
  selectedPhotos,
  setSelectedPhotos,
  categoryId,
  isDraggable,
  fetchMore,
  hasMore,
}) => {
  const [columns, setColumns] = useState(2)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedEditImageId, setSelectedEditImageId] = useState<string | null>(
    null
  )
  const [currentDescription, setCurrentDescription] = useState<string>('')

  const handleOpenModal = (imageId: string, description: string) => {
    setSelectedEditImageId(imageId)
    setCurrentDescription(description)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedEditImageId(null)
    setCurrentDescription('')
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
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<h4 className="text-center">Loading...</h4>}
      endMessage={<p className="relative text-center"></p>}
      className="mb-20"
    >
      <div className="relative top-12 w-full flex gap-2 px-2 pt-24 mb-24">
        {Object.keys(columnWrappers).map((columnKey, idx) => (
          <div key={idx} className="flex flex-1 flex-col gap-2">
            <SortableContext
              items={columnWrappers[columnKey]}
              strategy={horizontalListSortingStrategy}
            >
              {columnWrappers[columnKey].map((post) => {
                const isSelected = selectedPhotos.includes(post.id)

                console.log('post', post)
                return (
                  <div
                    key={post.id}
                    className={`relative overflow-hidden post ${
                      isSelected ? 'opacity-40' : ''
                    }`}
                  >
                    {!editMode ? (
                      <Link
                        href={{
                          pathname: `/${categoryId}/${post.id}`,
                        }}
                      >
                        {post.type === 'image' ? (
                          <Image
                            className="w-full grayscale-[50%] rounded-xl"
                            src={post.lowQualityUrl} // Cambia a lowQualityUrl
                            alt={`Image ${post.id}`}
                            width={140}
                            height={140}
                            placeholder="blur"
                            blurDataURL={post.blurDataUrl}
                          />
                        ) : (
                          <video
                            className="w-full grayscale-[50%] rounded-xl"
                            loop
                            muted
                            autoPlay
                            src={post.videoPreviewUrl} // Usa videoPreviewUrl para el video
                          ></video>
                        )}
                      </Link>
                    ) : (
                      <>
                        <div className="relative overflow-hidden">
                          <SortableItem id={post.id} draggable={isDraggable}>
                            {post.type === 'image' ? (
                              <Image
                                onClick={() => handlePhotoClick(post.id)}
                                className="w-full grayscale-[50%] rounded-xl"
                                src={post.lowQualityUrl} // Cambia a lowQualityUrl
                                alt={`Image ${post.id}`}
                                width={140}
                                height={140}
                                placeholder="blur"
                                blurDataURL={post.blurDataUrl}
                              />
                            ) : (
                              <video
                                className="w-full grayscale-[50%] rounded-xl"
                                muted
                                onClick={() => handlePhotoClick(post.id)}
                                src={post.videoPreviewUrl} // Usa videoPreviewUrl para el video
                              ></video>
                            )}
                          </SortableItem>
                          {editMode && (
                            <FaPen
                              className="absolute cursor-pointer text-white text-3xl bottom-2 right-2 p-2 bg-gray-500 hover:bg-gray-200 active:bg-gray-700 rounded-full"
                              onClick={() =>
                                handleOpenModal(post.id, post.description)
                              }
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </SortableContext>
          </div>
        ))}
        <EditDescriptionModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          imageId={selectedEditImageId ?? ''}
          currentDescription={currentDescription}
        />
      </div>
    </InfiniteScroll>
  )
}

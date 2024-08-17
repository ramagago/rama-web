'use client'
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import fashionDesign2 from '../../img/text-design/2.png'
import fashionDesign1 from '../../img/text-design/1.png'
import fashionDesign3 from '../../img/text-design/3.png'
import fashionDesign4 from '../../img/text-design/4.png'
import fashionDesign5 from '../../img/text-design/5.png'
import fashionDesign6 from '../../img/text-design/6.png'
import fashionDesign7 from '../../img/text-design/7.png'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo, useContext } from 'react'
import { AuthContext } from '@/app/context/authContext'
import PhotoGallery from '../page'
import VideoComponent from '../../components/VideoComponent'

const PhotoDetails: React.FC<{
  params: { id: string; categoryID: string }
}> = ({ params }) => {
  const searchParams = useSearchParams()

  const description = searchParams.get('description') || ''
  const imageUrl = searchParams.get('image') || ''
  const type = searchParams.get('type') || 'image'

  const [imageDimensions, setImageDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  const [designImage, setDesignImage] = useState<StaticImageData | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'AuthContext is undefined. Make sure your component is wrapped with AuthProvider.'
    )
  }

  const { setIsPhotoDetail } = context

  useEffect(() => {
    setIsPhotoDetail(true)

    return () => {
      setIsPhotoDetail(false)
    }
  }, [setIsPhotoDetail])

  const imagesArray = useMemo(
    () => [
      fashionDesign1,
      fashionDesign2,
      fashionDesign3,
      fashionDesign4,
      fashionDesign5,
      fashionDesign6,
      fashionDesign7,
    ],
    []
  )

  useEffect(() => {
    const calculateImageDimensions = () => {
      const img = new window.Image()
      img.src = imageUrl

      img.onload = () => {
        const aspectRatio = img.width / img.height
        const screenWidth = window.innerWidth

        let dynamicWidth

        if (aspectRatio > 1) {
          if (screenWidth < 640) {
            dynamicWidth = screenWidth //
          } else if (screenWidth < 960) {
            dynamicWidth = screenWidth * 0.45
          } else {
            dynamicWidth = screenWidth * 0.5 //
          }
        } else {
          if (screenWidth < 640) {
            dynamicWidth = screenWidth
          } else if (screenWidth < 780) {
            dynamicWidth = 270
          } else if (screenWidth < 960) {
            dynamicWidth = 300
          } else {
            dynamicWidth = Math.min(screenWidth * 0.8, 400)
          }
        }

        setImageDimensions({
          width: dynamicWidth,
          height: dynamicWidth / aspectRatio,
        })
      }
    }

    calculateImageDimensions()

    const handleResize = () => {
      calculateImageDimensions()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [imageUrl])

  useEffect(() => {
    const designNumber = Math.floor(Math.random() * imagesArray.length)
    setDesignImage(imagesArray[designNumber])
    console.log(designNumber)
  }, [imagesArray])

  useEffect(() => {
    if (designImage) {
      const img = new window.Image()
      img.src = designImage.src
      img.onload = () => setIsImageLoaded(true)
    }
  }, [designImage])

  return (
    <div>
      <div className="relative xs:top-24 flex justify-center items-start min-h-[300px]">
        <div
          className={`flex flex-col sm:flex-row shadow-2xl xs:rounded-3xl w-full ${
            type === 'video' ? 'xs:w-7/12 sm:w-3/4' : 'xs:w-3/4'
          } `}
        >
          {type === 'image' ? (
            imageDimensions ? (
              <Image
                src={imageUrl}
                quality={80}
                placeholder="empty"
                alt={description}
                width={imageDimensions.width}
                height={imageDimensions.height}
                className="xs:rounded-t-2xl  sm:rounded-l-3xl object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                Loading...
              </div>
            )
          ) : (
            <VideoComponent videoUrl={imageUrl} />
          )}
          <div className="p-4 flex flex-col justify-start sm:justify-between items-center relative w-full">
            <div className="hidden sm:block h-8 w-full"></div>
            {isImageLoaded && designImage && (
              <div className="hidden sm:flex sm:items-center">
                <Image
                  src={designImage}
                  width={350}
                  className="m-2"
                  alt="descripcion diseño"
                />
              </div>
            )}
            <p className=" p-2 sm:top-auto sm:bottom-2 italic text-[10px] md:text-[12px] text-center">
              Salon de Yoga del edificio Surfside. Constructora echeverrito.
              {description}
            </p>
          </div>
        </div>
      </div>
      <PhotoGallery params={params} />
    </div>
  )
}

export default PhotoDetails

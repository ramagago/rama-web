import Image from 'next/image'
import fashionBeautyCover from '../img/category-banner/fashion-beauty-cover-11.jpeg'
import homeDecorCover from '../img/category-banner/home-decor-cover-4.jpeg'
import lifestyleCover from '../img/category-banner/lifestyle-14.jpeg'
import Link from 'next/link'

const PhotoCategory = () => {
  return (
    <div className=" w-screen flex flex-col lg:flex-row bg-black ">
      <Link href={'/fashion'} className="lg:w-1/3 relative group">
        <Image
          alt="fashion and beauty category"
          src={fashionBeautyCover}
          className="h-screen w-screen cursor-pointer hover:opacity-85 object-cover  transition ease-in-out duration-300"
        />
        <h2 className="absolute bottom-32 right-24 p-6 text-white text-xl lg:hidden group-hover:block  transition ease-in-out duration-300">
          Fashion & Beauty
        </h2>
      </Link>
      <Link href={'/home'} className="lg:w-1/3 relative group">
        <Image
          alt="home and decor category"
          src={homeDecorCover}
          className="h-screen w-screen cursor-pointer hover:opacity-65 object-cover  opacity-85 transition ease-in-out duration-300"
        />
        <h2 className="absolute bottom-32 right-24 p-6 text-white text-xl lg:hidden group-hover:block  transition ease-in-out duration-300">
          Home & Decor
        </h2>
      </Link>
      <Link href={'/lifestyle'} className="lg:w-1/3 relative group">
        <Image
          alt="lifestyle category"
          src={lifestyleCover}
          className="h-screen w-screen cursor-pointer hover:opacity-85 object-cover  transition ease-in-out duration-300"
        />
        <h2 className="absolute bottom-32 right-24 p-6 text-white text-xl lg:hidden group-hover:block  transition ease-in-out duration-300">
          Lifestyle
        </h2>
      </Link>
    </div>
  )
}

export default PhotoCategory

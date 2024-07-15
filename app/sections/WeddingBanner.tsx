import Link from 'next/link'
import weddingReel from '../img/wedding-banner/wedding-reel.mov'
const WeddingBanner = () => {
  return (
    <div className="bg-black">
      <Link href={'./weddings'} className=" group relative">
        <video
          src={weddingReel}
          autoPlay
          loop
          muted
          className="opacity-85 hover:cursor-pointer hover:opacity-65 transition ease-in-out duration-300"
        ></video>
        <h2 className="absolute bottom-36 right-24 p-6 text-white text-xl lg:hidden group-hover:block  transition ease-in-out duration-300">
          Weddings
        </h2>
      </Link>
    </div>
  )
}

export default WeddingBanner

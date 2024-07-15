import Contact from './sections/Contact'
import PhotoCategory from './sections/PhotoCategory'
import WeddingBanner from './sections/WeddingBanner'

export default function Home() {
  return (
    <main className="">
      <PhotoCategory />
      <WeddingBanner />
      <Contact />
    </main>
  )
}

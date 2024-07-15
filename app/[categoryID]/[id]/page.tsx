interface PhotoDetailsProps {
  params: {
    categoryID: string
  }
}

const PhotoDetails: React.FC<PhotoDetailsProps> = ({ params }) => {
  const photoId = params.categoryID
  return <div>PhotoDetails: photo: {photoId}</div>
}

export default PhotoDetails

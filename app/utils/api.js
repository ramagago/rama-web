// utils/api.js
export const fetchImages = async (token) => {
  const response = await fetch('http://localhost:3000/images', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.json()
}

export const updateImages = async (images, token) => {
  const response = await fetch('http://localhost:3000/images', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(images),
  })
  return response.json()
}

export const addImage = async (image, token) => {
  const response = await fetch('http://localhost:3000/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(image),
  })
  return response.json()
}

export const deleteImage = async (id, token) => {
  await fetch(`http://localhost:3000/images/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

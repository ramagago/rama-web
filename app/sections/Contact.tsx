'use client'
import { FormEvent, useState } from 'react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const Contact = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const contactInfo = {
      mail: email,
      message,
    }

    try {
      const response = await fetch(`${apiUrl}/customer/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      console.log('Message sent successfully:', contactInfo)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div
      className="w-full bg-white text-gray-500 flex flex-col justify-center items-center"
      id="contact"
    >
      <h1 className="mt-12 text-xl">Contact</h1>
      <form
        onSubmit={handleSubmit}
        className="w-1/2 sm:w-1/2 flex justify-center items-center flex-col lg:flex-row my-12"
      >
        <div className="relative w-full min-w-[250px]">
          <input
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
          />
          <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Email
          </label>
        </div>
        <div className="relative h-11 w-full min-w-[250px] my-12 mx-36 sm:my-16 lg:my-0">
          <input
            placeholder=""
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
          />
          <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            How can I help you?
          </label>
        </div>
        <input
          type="submit"
          name="submit"
          value="Send"
          className="cursor-pointer p-2 text-sm hover:text-gray-300"
        />
      </form>
      <a
        className="mb-20 text-sm p-2 hover:text-gray-300"
        href="https://www.instagram.com/ramagago"
        target="blank"
      >
        Follow me
      </a>
    </div>
  )
}

export default Contact

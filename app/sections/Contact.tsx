'use client'
import { FormEvent, useState } from 'react'

const Contact = () => {
  const [email, setEmail] = useState('')
  const [help, setHelp] = useState('')
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const contactInfo = {
      email,
      help,
    }
    console.log('Contact Info:', contactInfo)
  }
  return (
    <div
      className="w-screen bg-white text-gray-500 flex flex-col justify-center items-center"
      id="contact"
    >
      <h1 className="mt-12 text-xl">Contact</h1>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center flex-col lg:flex-row my-12"
      >
        <div className="relative h-11 w-full min-w-[250px]">
          <input
            placeholder=""
            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
          />
          <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Email
          </label>
        </div>
        <div className="relative h-11 w-full min-w-[250px] mx-36 my-24 lg:my-0">
          <input
            placeholder=""
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
        className="mb-12 text-sm p-2 hover:text-gray-300"
        href="https://www.instagram.com/ramagago"
        target="blank"
      >
        Follow me
      </a>
    </div>
  )
}

export default Contact

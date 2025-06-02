import { useState } from "react";

const ContactFooter = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    question: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div  id="contact" className="text-white   pt-14 pb-6">
      <h2 className="text-5xl text-textYellow text-center font-bold mb-6">Contact Us</h2>
      <div className="md:max-w-4xl 2xl:mx-auto md:mx-16 px-4">
        <div className="pb-5">
          <p className="text-2xl font-bold">We’re a pretty friendly bunch.</p>
          <p className="text-lg leading-tight">
            Reach out to us and we’ll happily answer any questions you may have.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name & Company */}
          <div className="flex flex-col lg:flex-row gap-4 mb-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Your Question */}
          <div className="mb-6">
            <textarea
              rows="4"
              name="question"
              placeholder="Your Question"
              value={formData.question}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-bgYellow hover:bg-opacity-80 text-black text-lg font-semibold px-5 py-2 rounded-full transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFooter;

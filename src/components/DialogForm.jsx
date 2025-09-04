import React, { useEffect, useRef, useState } from "react";
import "../index.css";


// Form fields configuration


const DialogForm = ({ tag, visible, onClose, fields, onConfirm }) => {
  if (!visible) return null;
  const [formData, setFormData] = useState({})

  useEffect(() => {
  const initialData = fields.reduce((acc, current) => {
    acc[current.name] = current.value ? current.value : "";
    return acc;
  }, {});
  setFormData(initialData);
}, [fields]);


  // Initialize form data from fields   

  const onChange = (e)=>{
    const {name, value} = e.target
    setFormData((prev => ({
      ...prev,
      [name]: value
    })))
  }
  
  return (
    <div className="backdrop-blur-xs fixed top-0 left-0 w-[100vw] h-[100vh] flex flex-col justify-center items-center z-20 bg-gray-700/40" onClick={onClose}  >
      <div
        className="h-[50%] md:h-[90%] w-[80%] md:w-[50%] flex flex-col items-center bg-black text-white rounded-lg gap-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <header className=" p-2">
          <h2 className="text-2xl font-medium top-0">
            <span className="text-pink-100">V</span>
            <span className="text-pink-200">i</span>
            <span className="text-pink-300">b</span>
            <span className="text-pink-400">e</span>
            <span className="text-pink-500">N</span>
            <span className="text-pink-600">e</span>
            <span className="text-pink-700">s</span>
            <span className="text-pink-800">t</span>
          </h2>
        </header>

        <form className="overflow-y-auto overflow-x-hidden mt-2 w-[80%] h-full">
          <p className="text-3xl font-bold opacity-75">{tag}</p>
        {
          fields.map((item, index) => {
            return (
              <div key={index} className="m-2 md:m-5 flex flex-col">
                <label htmlFor={index} className="text-xs font-medium ">
                  {item.label} {item.required && <span className="text-red-600 text-sm">*</span>}
                </label>
                <input
                  type={item.type}
                  name={item.name}
                  placeholder={item.placeholder}
                  required={item.required}
                  className=" border-gray-600 border overflow-auto your-container p-2 required"
                  value = {formData[item.name]}
                  onChange={onChange}
                  disabled={item.disabled ? item.disabled :  false}
                ></input>
              </div>
            );
          })
        }
        </form>
        <footer className="mb-4 flex gap-4 p-2 w-full">
          <button className="p-2 w-full border border-white rounded-full hover:bg-white hover:text-black transition duration-300 ease-in-out" onClick={()=>{
            onConfirm(formData)
          }}>Next</button>
          <button className="p-2 w-full border border-white rounded-full hover:bg-white hover:text-black transition duration-300 ease-in-out" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default DialogForm;
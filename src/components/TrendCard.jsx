import { Children, useEffect, useState } from "react";
import DialogForm from "./DialogForm";

function TrendCard({trend}) {

  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const onClose = ()=>{
    setIsDialogVisible(false)
  }

  const displayTag = `#${trend.tag}`; // Add # for display

  const fields = [{
    type: "text",
    name: `${displayTag}`,
    placeholder: "Enter the tag name...",
    required: "true",
    label: `Write ${displayTag} for adding your impression` 
  }]

  const onConfirm = async (formData)=>{ // Handle form submission
    if(formData[displayTag] !== displayTag)
      alert("Enter correct trend tag")
    else {
      const response = await fetch(`http://localhost:5000/v1/trending/impression/${trend._id}`, {method: "POST"})
      if(!response.ok)
        alert("Request Cannot be completed")
      alert("Impression Added")
      trend.impressions += 1

      onClose()
    }
  }

  return (
    <div className="flex justify-between items-center rounded-lg bg-gray-900 hover:bg-gray-800 p-2 min-h-15">
      <DialogForm tag="Add Impression" visible={isDialogVisible} onClose={onClose} fields={fields} onConfirm={onConfirm}/>
      <div className="flex flex-col">
          <p className="font-medium">{displayTag}</p> {/* Show tag with # */}
          <p className="text-sm text-gray-400">{trend.impressions} impressions</p>
      </div>
      
      <button className="text-sm text-amber-400 hover:text-amber-500 cursor-pointer" onClick={()=>{
        alert("Button Clicked")
        setIsDialogVisible(true)
      }}>
        Add
      </button>
    </div>
  )
}

export { TrendCard }
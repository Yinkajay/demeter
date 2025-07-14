import React, { useState } from 'react'
import { BiPencil } from 'react-icons/bi'

const EditableField = ({ label, value, onSave, type = "text" }) => {
    const [editing, setEditing] = useState(false)
    const [input, setInput] = useState(value)

    const handleSave = () => {
        onSave(input)
        setEditing(false)
    }
    return (
        <div>
            <label className='block font-medium'>{label}</label>

            {editing
                ? (
                    <div className="">
                        {type === 'textarea'
                            ? (
                                <textarea onChange={e => setInput(e.target.value)} value={input} />
                            )
                            : (
                                
                                <input type={label === 'Email'? 'email': 'text'} className='border' onChange={e => setInput(e.target.value)} value={input} />
                            )}
                        <button onClick={handleSave}>Save</button>
                    </div>
                )
                : (
                    <div className="flex justify-between items-center w-max gap-8">
                        <p>{value || <span>Not yet set</span>}</p>
                        <button onClick={() => setEditing(true)}>
                            <BiPencil />
                        </button>
                    </div>
                )}
        </div>
    )
}

export default EditableField

import React, { useState } from 'react';
import Modal from './modal';

export default function Presentation(
    { database }
) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [title, setTitle] = useState('')
  return (
    <div className='presentation-main'>
        <h1>Google Slides</h1>
        <button className='add-presentation' onClick={handleOpen}>
            Add a presentation
        </button>
        <Modal open={open} setOpen={setOpen} title={title} setTitle={setTitle}/>
    </div>
  )
}
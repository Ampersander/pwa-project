import React, { useState, useEffect, useRef } from 'react';
import Modal from './modal';
import { addPres, collection, onSnapshot } from 'firebase/firestore';

export default function Presentation(
    { database }
) {
  const [open, setOpen] = React.useState(false);
  const isMounted = useRef()
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = useState('');
  const [presData, setPresData] = useState([]);
  const collectionRef = collection(database, 'presData')
  const addData = () => {
        addPres(collectionRef, {
            title: title,
            presDesc: ''
        })
            .then(() => {
                alert('Data Added');
                handleClose()
            })
            .catch(() => {
                alert('Cannot add data')
            })
    }
    const getData = () => {
        onSnapshot(collectionRef, (data) => {
            setPresData(data.pres.map((pres) => {
                return { ...pres.data(), id: pres.id }
            }))
        })
    }
  useEffect(() => {
        if(isMounted.current){
            return 
        }

        isMounted.current = true;
        getData()
    }, [])

  return (
    <div className='presentation-main'>
        <h1>Google Slides</h1>  
        <button className='add-presentation' onClick={handleOpen}>
            Add a presentation
        </button>
        <div className='grid-main'>
                {presData.map((pres) => {
                    return (
                        <div className='grid-child' onClick={() => getID(pres.id)}>
                            <p>{pres.title}</p>
                            <div dangerouslySetInnerHTML={{ __html: pres.presDesc }} />
                        </div>
                    )
                })}
            </div>
        <Modal open={open} setOpen={setOpen} title={title} setTitle={setTitle} addData={addData}/>
    </div>
  )
}
import React from 'react'
import { useParams } from 'react-router-dom'
const EditFile = () => {
  
  const { id } = useParams();
  
  return (
    <div>{id}</div>
  )
}

export default EditFile
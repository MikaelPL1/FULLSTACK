import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = (e) => setValue(e.target.value)
  const reset = () => setValue('')
  return { inputProps: { type, value, onChange }, reset }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(baseUrl)
        setResources(res.data)
      } catch {
        setResources([])
      }
    }
    fetchAll()
  }, [baseUrl])

  const create = async (resource) => {
    const res = await axios.post(baseUrl, resource)
    setResources(prev => prev.concat(res.data))
    return res.data
  }

  return [resources, { create }]
}
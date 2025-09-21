import axios from 'axios'

const baseUrl = '/api/persons'

// Haetaan kaikki henkilöt
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)  // Poistettu concat, suoraan palautetaan response.data
}

// Luodaan uusi henkilö
const create = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then((response) => response.data)
}

// Päivitetään olemassa oleva henkilö
const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then((response) => response.data)
}

export default { getAll, create, update }

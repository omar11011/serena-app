const axios = require("axios")
const { message } = require('./colors')

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    withCredentials: true,
})

const getData = async url => {
    try {
        const { data } = await instance.get(url)
        return data
    }
    catch(err) {
        message(`Error en la BBDD: ${err.message}`, 'r')
        return { error: true }
    }
}

const createData = async (url, props) => {
    try {
        const { data } = await instance.post(url, {
            apiKey: process.env.DB_APIKEY,
            ...props,
        })
        return data
    }
    catch(err) {
        message(`Error en la BBDD: ${err.message}`, 'r') 
        return { error: true }
    }
}

const updateData = async (url, props) => {
    try {
        const { data } = await instance.put(url, {
            apiKey: process.env.DB_APIKEY,
            ...props,
        })
        return data
    }
    catch(err) {
        message(`Error en la BBDD: ${err.message}`, 'r')
        return { error: true }
    }
}

const deleteData = async (url, props) => {
    try {
        const { data } = await instance.delete(url, {
            data: {
                apiKey: process.env.DB_APIKEY,
                ...props,
            }
        })
        return data
    }
    catch(err) {
        message(`Error en la BBDD: ${err.message}`, 'r')
        return { error: true }
    }
}

module.exports = {
    get: getData,
    create: createData,
    update: updateData,
    delete: deleteData,
}
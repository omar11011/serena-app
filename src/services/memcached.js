const Memcached = require('memcached')
const memcached = new Memcached('localhost:11211')

const getData = async key => {
    if (!key) return { error: 'No especificaste la clave.' }

    return new Promise((resolve, reject) => {
        memcached.get(key, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

const createData = async ({ key, data, time }) => {
    if (!key) return { error: 'No se especificó la clave.' }
    if (!data) return { error: 'No proporcionaste datos.' }
    if (!time) time = 2592000

    return new Promise((resolve, reject) => {
        memcached.set(key, data, time, err => {
            if (err) reject(err)
            else {
                getData(key)
                    .then(createdData => resolve(createdData))
                    .catch(reject)
            }
        })
    })
}

const updateData = async ({ key, data, time }) => {
    if (!key) return { error: 'No se especificó la clave.' }
    if (!data) return { error: 'No proporcionaste nuevos datos.' }
    if (!time) time = 2592000

    return new Promise((resolve, reject) => {
        memcached.replace(key, data, time, err => {
            if (err) reject(err)
            else {
                getData(key)
                    .then(updatedData => resolve(updatedData))
                    .catch(reject)
            }
        })
    })
}

const deleteData = async key => {
    if (!key) return { error: 'No se especificó la clave.' }

    return new Promise((resolve, reject) => {
        memcached.del(key, err => {
            if (err) reject(err)
            else resolve({ success: true })
        })  
    })
}

const deleteCache = () => {
    memcached.flush(err => {
        if (err) {
            console.error('Error al vaciar el caché:', err);
        } else {
            console.log('Caché de Memcached reseteado exitosamente.')
        }
    })
}

module.exports = {
    getData,
    createData,
    updateData,
    deleteData,
    deleteCache,
}
const generateMesaage = (text) => {
    return {
        text,
        createdAt : new Date().getTime()
    }
}

const generateLocationMesaage = (url) => {
    return {
        url,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMesaage,
    generateLocationMesaage
}
const generateMesaage = (username,text) => {
    return {username,text,createdAt : new Date().getTime()}
}

const generateLocationMesaage = (username,url) => {
    return {username,url,createdAt : new Date().getTime()}
}

module.exports = {
    generateMesaage,
    generateLocationMesaage
}
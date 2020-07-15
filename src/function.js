function filenameFromUrl(url) {
    return url.substr(url.lastIndexOf('/') + 1)
}

module.exports = {
    filenameFromUrl
}
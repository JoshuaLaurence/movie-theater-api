//Middleware function to create change a word to Title Case
function toTitleCase(request, response, next) {
    const allLowerCase = request.params.genre.toLowerCase()
    request.params.genre = allLowerCase
        .split()
        .map(
            function (string) {
                return (string.charAt(0).toUpperCase() + string.slice(1));
            }
        )
        .join("")
    next()
}

module.exports = toTitleCase

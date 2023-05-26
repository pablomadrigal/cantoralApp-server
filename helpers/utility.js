exports.randomNumber = function (length) {
  let text = ''
  const possible = '123456789'
  for (let i = 0; i < length; i++) {
    const sup = Math.floor(Math.random() * possible.length)
    text += i > 0 && sup == i ? '0' : possible.charAt(sup)
  }
  return Number(text)
}

exports.getDate = function () {
  const today = new Date()
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
}

exports.getStringArray = function (stringData) {
  try {
    const array = JSON.parse(stringData)
    if (!Array.isArray(array)) return []
    return array.filter((item) => typeof item === 'string')
  } catch (error) {
    return []
  }
}

import fs from "fs";

const randomStringGenerator = (length = 100) => {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const len = chars.length
  let random = ''

  for(let i = 1; i <= length; i++){
    const posn = Math.ceil(Math.random() * (len-1))
    random += chars[posn]
  }

  return random
}

const deleteFile = (filePath) =>{
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath)
    }
}

const ucFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const showPrice = (number) => {
  return new Intl.NumberFormat("np", {style: "currency", currency: "npr", currencySign: "standard"}).format(+number)
}

export {
  randomStringGenerator,
  deleteFile,
  ucFirst,
  showPrice
}
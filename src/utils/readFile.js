const readFile = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.onload = (ev) => {
      resolve(ev.target?.result)
    }
    reader.readAsBinaryString(file)
  })
}

export default readFile

const imageDimensions = file => new Promise((resolve, reject) => {
    const img = new Image()

    // the following handler will fire after the successful loading of the image
    img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img
        resolve({ width, height })
    }

    // and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
    img.onerror = () => {
        reject('There was some problem with the image.')
    }
    
    img.src = URL.createObjectURL(file)
})

export const getInfo = async ({ target: { files } }) => {
    const [file] = files
 
    try {
        // const dimensions = await imageDimensions(file)
        // console.log(dimensions)

        // const dimensions = await imageDimensions(file)
        // dimensions.then(res=>{
        //     return res
        // })
        return await imageDimensions(file)

    } catch(error) {
        console.error(error)
    }
}

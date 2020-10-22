export default (file)=>{
       return new Promise((resolve, reject)=>{

         let imageUri 
         console.log(file)
         const data = new FormData()
         data.append("file",file)
         data.append("upload_preset","inscatgram")
         data.append("cloud_name","smilj4npj4nic")
         fetch("https://api.cloudinary.com/v1_1/smilj4npj4nic/image/upload",{
            method:"post",
            body:data
         })
         .then(res=>res.json())
         .then(data=>{
            imageUri = data.url
            console.log(imageUri)
            return resolve(imageUri)
         })
         .catch(err=>{
            return reject(err)
         })    



       })
    }



      //  let imageUri 
      //  console.log(file)
      //  const data = new FormData()
      //  data.append("file",file)
      //  data.append("upload_preset","inscatgram")
      //  data.append("cloud_name","smilj4npj4nic")
      //  fetch("https://api.cloudinary.com/v1_1/smilj4npj4nic/image/upload",{
      //      method:"post",
      //      body:data
      //  })
      //  .then(res=>res.json())
      //  .then(data=>{
      //     imageUri = data.url
      //     console.log(imageUri)
      //     return imageUri
      //  })
      //  .catch(err=>{
      //     return
      //  })    

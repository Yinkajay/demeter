export const uploadToCloudinary = async (file) => {
    const formdata = new FormData()
    formdata.append('file', file)
    formdata.append('upload_preset', 'ml_default')
    formdata.append('cloud_name', 'dwwu8z0ay')

    const response = await fetch('https://api.cloudinary.com/v1_1/dwwu8z0ay/image/upload',{
        method:'POST',
        body: formdata
    })

    const data = await response.json()
    console.log(data)
    return data.secure_url
}
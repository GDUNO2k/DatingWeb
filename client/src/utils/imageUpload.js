import axios from "axios"

export const checkImage = (file) => {
    let err = ""
    if (!file) return err = "File does not exist."

    if (file.size > 1024 * 1024) // 1mb
        err = "The largest image size is 1mb."

    if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        err = "Image format is incorrect."

    return err;
}


export const imageUpload = async (images) => {
    let imgArr = [];
    for (const item of images) {
        const form = new FormData()

        if (item.camera) {
            form.append("image", item.camera)
        } else {
            form.append("image", item)
        }

        const res = await axios.post("https://api.imgbb.com/1/upload?key=5171d149a0d161db8c6896ec01dbbb5f", form)

        imgArr.push({ public_id: res.data.data.id, url: res.data.data.display_url })
    }
    return imgArr;
}
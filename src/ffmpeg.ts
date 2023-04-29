import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

const bitrateRegex = /(?<=(?:Audio|bitrate).*)\d+(?=\s*kb\/s)/

const ffmpeg = createFFmpeg({ log: false })

export const getBitrate = async (file: File) => {
  return new Promise<number>(async (resolve, reject) => {
    if (!ffmpeg.isLoaded()) await ffmpeg.load()
    let bitrate: number | undefined
    ffmpeg.setLogger(({ message }) => {
      const match = message.match(bitrateRegex)
      const newBitrate = match?.length ? +match[0] : undefined

      if (message.includes("Audio")) {
        ffmpeg.setLogging(false)
        const result = bitrate || newBitrate
        if (result) resolve(result)
        else reject("Could not find bitrate")
      } else {
        bitrate = newBitrate
      }
    })
    ffmpeg.FS("writeFile", file.name, await fetchFile(file))
    await ffmpeg.run("-i", file.name)
    ffmpeg.setLogging(true)
  })
}

export const adjustBitrate = async (file: File, bitrate: number) => {
  if (!ffmpeg.isLoaded()) await ffmpeg.load()

  ffmpeg.setProgress(({ ratio }) => {
    console.log("ratio", ratio)
  })

  const outputName = `output_${bitrate}.mp3`

  ffmpeg.FS("writeFile", file.name, await fetchFile(file))

  await ffmpeg.run("-i", file.name, "-b:a", `${bitrate}k`, outputName)

  const data = ffmpeg.FS("readFile", outputName)
  return URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }))
}

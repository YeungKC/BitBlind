import { Title } from "solid-start"
import { createEffect, createSignal } from "solid-js"
import { adjustBitrate, getBitrate } from "../ffmpeg"

export default function Home() {
  const [original, setOriginal] = createSignal<string>()
  const [half, setHalf] = createSignal<string>()

  const transcode = async ({ target: { files } }: { target: { files: FileList | null } }) => {
    if (!files?.length) return

    setOriginal(URL.createObjectURL(files[0]))

    const bitrate = await getBitrate(files[0])

    const foo = await adjustBitrate(files[0], bitrate)
    setHalf(foo)
  }

  return (
    <main>
      <Title>Hello World</Title>
      <input type="file" onchange={transcode} />
      {original() && <audio controls src={original()}></audio>}
      {half() && <audio controls src={half()}></audio>}
    </main>
  )
}

'use server'

import OpenAI from 'openai'

export const get_songs = async (count:string, statement:string) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const message = `Create a list of ${count} unique songs based off the following 
      statement: ${statement}. All songs on the list are very likely streamable on Spotify.
      Include "id", "title", "artist", "album" 
      and estimate "duration" in your response. An example response is: "
      [
        {
            "id": 1,
            "title": "Fade to Black",
            "artist": "Metallica",
            "album": "Ride the Lightning",
            "duration": "6:57"
        }
      ]".`

    console.log(message)

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output JSON.",
            },
            {   role: "user", content: message},
            ],
            model: "gpt-5-mini",
            response_format: { type: "json_object" },
        })

        const data = completion.choices[0].message.content
        console.log(data)
        return { success: true, songs: data}
      } catch (error) {
        console.log('Error getting songs from ChatGPT', error)
        return {success: false, message: 'Error getting songs from ChatGPT'}
      }
}
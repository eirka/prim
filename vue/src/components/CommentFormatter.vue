<script setup>
import { ref, onMounted } from 'vue'
import { emoticonSrv, tokenMap } from '@/composables/useEmoticons'

const props = defineProps({
  comment: { type: String, required: true }
})

const container = ref(null)

// URL regex from https://gist.github.com/dperini/729294
const urlRegex = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/gi
const emailRegex = /(\S{3,})@(\S*[^\s.;,(){}<>"\u201d\u2019])/i
const youtubeRegex = /(https?)?:\/\/(www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/i
const imageRegex = /(?:https?:\/\/|(?:www\.)|[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019](?:\/[^/#?]+)+\.(?:jpe?g|gif|png)/i
const boldRegex = /\*\*(.*?)\*\*/g
const italicRegex = /\*(.*?)\*/g
const emoticonRegex = /:([\w+-]+):/g

function formatComment(text) {
  // Collapse excessive newlines
  let result = text.replace(/(\n){3,}/g, '\n\n').trim()

  // Bold
  result = result.replace(boldRegex, '<strong>$1</strong>')
  // Italic (after bold to avoid conflicts)
  result = result.replace(italicRegex, '<em>$1</em>')

  // URLs - replace with links, embeds for images/youtube
  result = result.replace(urlRegex, (url) => {
    if (emailRegex.test(url)) {
      const match = emailRegex.exec(url)
      return `${match[1]} at ${match[2]}`
    }

    const youtubeMatch = youtubeRegex.exec(url)
    if (youtubeMatch) {
      return `<div class="auto-resizable-iframe"><div><iframe src="https://www.youtube.com/embed/${youtubeMatch[3]}" frameborder="0" allowfullscreen></iframe></div></div>`
    }

    if (imageRegex.test(url)) {
      return `<a href="${url}" target="_blank"><img src="${url}" class="external_image"></a>`
    }

    return `<a href="${url}" target="_blank">${url}</a>`
  })

  // Emoticons
  result = result.replace(emoticonRegex, (match, name) => {
    const token = tokenMap[name]
    if (token) {
      return `<img class="emoticon" title=":${token.text}:" src="${emoticonSrv}${token.image}">`
    }
    return match
  })

  // Convert newlines to <br>
  result = result.replace(/\n/g, '<br>')

  return result
}

const formattedHtml = ref('')

onMounted(() => {
  formattedHtml.value = formatComment(props.comment)
})
</script>

<template>
  <p ref="container" v-html="formattedHtml"></p>
</template>

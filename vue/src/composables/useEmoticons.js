import config from '@/config'

const tokens = [
  { text: 'smug', image: 'smug.gif' },
  { text: 'shepface', image: 'shepface.gif' },
  { text: 'byodood', image: 'byodood.gif' },
  { text: 'chord', image: 'chord.gif' },
  { text: 'coolspot', image: 'coolspot.gif' },
  { text: 'eyepop', image: 'eyepop.gif' },
  { text: 'frogcool', image: 'frogcool.gif' },
  { text: 'frogout', image: 'frogout.gif' },
  { text: 'getin', image: 'getin.gif' },
  { text: 'negative', image: 'negative.png' },
  { text: 'newlol', image: 'newlol.gif' },
  { text: 'owned', image: 'owned.gif' },
  { text: 'smugdog', image: 'smugdog.gif' },
  { text: 'smugmrgw', image: 'smugmrgw.png' },
  { text: 'coolsnake', image: 'coolsnake.gif' },
  { text: 'duck', image: 'duck.png' },
  { text: 'flower', image: 'flower.gif' },
  { text: 'goofy', image: 'goofy.gif' },
  { text: 'hand', image: 'hand.gif' },
  { text: 'hehe', image: 'hehe.gif' },
  { text: 'hmm', image: 'hmm.gif' },
  { text: 'milk', image: 'milk.gif' },
  { text: 'psyduck', image: 'psyduck.gif' },
  { text: 'squid', image: 'squid.gif' },
  { text: 'pacha', image: 'pacha.png' }
]

const tokenMap = {}
for (const token of tokens) {
  tokenMap[token.text] = token
}

export const emoticonSrv = config.img_srv + '/emoticons/'
export { tokenMap }

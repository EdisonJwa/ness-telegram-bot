module.exports = {
  error: '무엥',
  google: {
    emptyResponse: 'I cannot connect to the search engine!',
    resultsBelow: 'The search result is smaller than I expected!',
    question: 'Please enter what you want to search in Google!',
    changeKorean: 'I changed the results to Korean!'
  },
  get: {
    question: 'Please enter the message ID!',
    error: 'It is not a number, or exxeds the ID limit!',
    bring: '번 메시지 가져왔어요!',
    notFound: '번 메시지를 찾을 수 없어요!'
  },
  image: {
    question: 'Please enter an image search query!',
    error: 'Oops! I cannot find the image!'
  },
  ping: {
    question: 'I can ping!\nPlease enter an IP or a Domain!',
    error: 'It is neither an IPv4 nor  a Domain!'
  },
  calc: {
    question: 'Please enter the expression!',
    error: 'Something is wrong with the result!'
  },
  dday: {
    question: 'Please enter the date as below!\nex) <code>2018 01 01</code>',
    error: 'Looks like it\'s not a date!',
    today: 'It\'s today!',
    past: 'day(s) have past!',
    future: 'day(s) left!'
  },
  currency: {
    help: 'Please command with the name of currency and the multiple!\nex) /currency KRW 10000',
    errorUnit: 'The currency code is not correct!',
    errorMultiple: 'Please enter the correct multiple!'
  },
  translate: {
    question: 'Please enter the sentences you want to translate!',
    error: 'No translation results!'
  },
  admins: {
    error: 'You can only use it in a group!'
  },
  ratio: {
    question: 'Please enter two numbers!',
    error: 'Something is wrong!',
    errorLimit: 'The number exceeds the calculation limit!'
  },
  dice: {
    question: 'Please enter two or more words! 🎲'
  },
  pick: {
    question: 'Please enter two or more words!',
    error: 'Please enter two or more words!'
  },
  map: {
    questionAddr: 'Please enter an address!',
    questionPlace: 'Please enter a place!',
    errorAddr: 'I cannot find the address!',
    errorCoord: 'I cannot find the coorsinate!',
    errorPlace: 'I cannot find the place!',
    errorLocation: 'I cannot find the GPS signal!'
  },
  weather: {
    question: 'Please enter the address!',
    error: 'No result. If the place is outside Korea, please enter the name in English!',
    errorRequest: 'I cannot connect to the weather server!'
  },
  contact: {
    found: ''
  },
  leave: {
    bye: 'Bye!',
    permission: 'Permission denied.'
  },
  length: {
    question: 'Please enter a string you want to measure!',
    error: 'I cannot measure the length!'
  },
  html: {
    question: 'Please enter the <a href="https://core.telegram.org/bots/api#html-style">HTML</a> code!',
    error: 'the tag is not supported!\nPlease check if it\'s in the<a href="https://core.telegram.org/bots/api#html-style">list of tags</a> and it\'s not duplicated.'
  },
  markdown: {
    question: 'Please enter the <a href="https://core.telegram.org/bots/api#markdown-style">Markdown</a>!'
  },
  youtube: {
    question: 'Please enter a video search query!',
    error: 'I cannot find the video!'
  },
  papago: {
    question: 'Please enter the sentences you want to translate!',
    error: 'No translation results!'
  },
  code: {
    question: 'Please enter the code!',
    error: '',
    onlyText: 'Only texts are supported!'
  },
  enko: {
    question: 'Please enter a string to convert!',
    onlyText: 'Only texts are supported!'
  },
  koen: {
    question: 'Please enter a string to convert!',
    errorInput: 'Please enter Korean only with a form of choseong+jungseong or choseong+jungseong+jongseong!'
  },
  decode: {
    question: 'Please enter a string to decode!'
  },
  search: {
    notSupport: 'This type is not yet supported!',
    replyOnly: 'This command is for reply only! Please write it on a reply!'
  }
}

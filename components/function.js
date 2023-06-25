export function wrapHashtagsInText(text,id) {
    const words = text.split(' ');
    const processedWords = words.map((word) => {
        const isHashTag = word.startsWith('#');
  
        if (!isHashTag) {
            return word;
        }
  
        const hasWordPunctuationMarks = word.includes('?') || word.includes('!') || word.includes('.') || word.includes(',');
  
        if (!hasWordPunctuationMarks) {
            return `<a class="tag" href="${word}" data-id="${id}" data-tag="${word}">${word}</a>`;
        }
  
        const punctuationMarkIndex = word.split('').findIndex((letter) => '?!,.'.includes(letter));
        const firstPartOfWord = word.slice(0, punctuationMarkIndex);
        const lastPartOfWord = word.slice(punctuationMarkIndex);
  
        return `<span>${firstPartOfWord}</span>${lastPartOfWord}`;
    });
  
    return processedWords.join(' ');
  }
  
  export function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

export function htmlSpecialChars(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
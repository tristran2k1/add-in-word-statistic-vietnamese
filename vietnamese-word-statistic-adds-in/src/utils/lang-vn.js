import { loadDict } from './loadDict';
export const VNDICT = loadDict();

import Tokenizer from './tokenizer';
const tokenizer = new Tokenizer();

export function preprocessing(paragraphs) {
  let tokenizedParagraph = [];
  for (const paragraph of paragraphs) {
    tokenizedParagraph.push(tokenizer.tokenize(paragraph.text));
  }
  return tokenizedParagraph;
}

export function tokenizeSentence(tokenizedParagraph) {
  let tokenizedSentence = [];
  for (let token of tokenizedParagraph) {
    const len = token.length;
    let start = 0;
    for (let i = 0; i < len; i++) {
      if (token[i] === '.' || token[i] === '?' || token[i] === '!') {
        tokenizedSentence.push(token.slice(start, i + 1));
        start = i + 1;
      } else if (i === len - 1) {
        tokenizedSentence.push(token.slice(start, len));
      }
    }
  }
  return tokenizedSentence;
}

export function countPunctuationMark(bodyText) {
  const match = bodyText.match(/[,."!?'”“]/g);
  return match ? match.length : 0;
}

const regexSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const LONGEST_WORD_LENGTH = 9; // Based on VNDICT
export function getWord(sentToken) {
  let words = [];
  let len = sentToken.length;
  let tokens = [...sentToken];
  let flags = Array(len).fill(0);
  let currentWordRange = len < LONGEST_WORD_LENGTH ? len : LONGEST_WORD_LENGTH;

  while (currentWordRange !== 0) {
    let i = 0;
    while (i + currentWordRange <= len) {
      if (!tokenUsed(flags, i, i + currentWordRange)) {
        const curTokens = tokens.slice(i, i + currentWordRange);
        const currentWord = curTokens.join(' ').toLowerCase().trim();
        if (VNDICT.indexOf(currentWord) !== -1 || (currentWordRange === 1 && !regexSpecialChar.test(currentWord[0]))) {
          words.push(currentWord);
          flagTokens(flags, i, i + currentWordRange);
        }
      } 
      i++;
    }
    currentWordRange--;
  }
  return words;
}

function flagTokens(arr, start, end) {
  for (let i = start; i < end; i++) {
    arr[i] = 1;
  }
}

function tokenUsed(arr, start, end) {
  for (let i = start; i < end; i++) {
    return arr[i] === 1;
  }
  return false;
}

const regexWhiteSpace = /\s+/g;
const regexDashedWhitespace = /[-\s+]/g
export function analyzeWord(words) {
  let letter_count = 0;
  let syllable_count = 0;
  for (const word of words) {
    const spaces = word.match(regexDashedWhitespace);
    syllable_count += spaces ? spaces.length + 1 : 1;
    const wordWithoutSpace = word.replace(regexWhiteSpace, '');
    letter_count += wordWithoutSpace.length;
  }
  return { letter_count, syllable_count };
}

export function getUniqueWords(words) {
  return [...new Set(words)];
}
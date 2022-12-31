import { preprocessing, tokenizeSentence, countPunctuationMark, getWord, getUniqueWords, analyzeWord } from '../utils/lang-vn';

function analyze(paragraphs) {
  const tokenizedParagraph = preprocessing(paragraphs); 
  const tokenizedSentence = tokenizeSentence(tokenizedParagraph);
  let words = [];
  
  for (const token of tokenizedSentence) {
    words.push(...getWord(token));
  }

  const { letter_count, syllable_count } = analyzeWord(words);
  const word_count = words.length;
  const sentence_count = tokenizedSentence.length;
  let character_count = 0;
  for (let paragraph of paragraphs) {
    character_count += paragraph.text.length;
  }
  return {letter_count, character_count, syllable_count, word_count, sentence_count, words};
}

self.addEventListener('message', e => {
  const { paragraphs, text } = JSON.parse(e.data);
  let total_letter_count = 0;
  let total_char_count = 0;
  let total_syllable_count = 0;
  let total_word_count = 0;
  let total_sentence_count = 0;
  let total_punctuation_mark_count = countPunctuationMark(text);
  let total_paragraph_count = paragraphs.length;
  let unique_word_count = 0;
  for (let i = 0; i < total_paragraph_count; i += 10) {
    const {letter_count, character_count, syllable_count, word_count, sentence_count, words} = analyze(paragraphs.slice(i, i + 10));

    total_letter_count += letter_count;
    total_char_count += character_count;
    total_syllable_count += syllable_count;
    total_word_count += word_count;
    total_sentence_count += sentence_count;

    if (i + 10 >= total_paragraph_count) {
      unique_word_count += getUniqueWords(words).length;
    }

    self.postMessage({
      total_letter_count, 
      total_char_count, 
      total_syllable_count, 
      total_punctuation_mark_count, 
      total_word_count, 
      unique_word_count, 
      total_sentence_count, 
      total_paragraph_count,
      words 
    });
  }
});
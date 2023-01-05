/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

import Worker from 'worker-loader!../worker/worker'
import { preprocessing, tokenizeSentence, countPunctuationMark, getWord, getUniqueWords, analyzeWord } from '../utils/lang-vn';
import analyze from "../worker/worker";
let worker;
Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run").onclick = run;
    worker = new Worker();
  }
});

function runWorker(data, dom) {
  worker.postMessage(JSON.stringify(data));
  worker.onmessage = e => {
    const { total_letter_count, total_char_count, total_syllable_count, total_punctuation_mark_count, total_word_count, unique_word_count, total_sentence_count, total_paragraph_count } = e.data;

    dom.getElementById('letters').innerText = total_letter_count;
    dom.getElementById('chars').innerText = total_char_count;
    dom.getElementById('words').innerText = total_word_count;
    dom.getElementById('unique').innerText = unique_word_count;
    dom.getElementById('sentences').innerText = total_sentence_count;
    dom.getElementById('paragraphs').innerText = total_paragraph_count;
    dom.getElementById('punc').innerText = total_punctuation_mark_count;
    dom.getElementById('sen-per-para').innerText = total_sentence_count / total_paragraph_count;
    dom.getElementById('word-per-para').innerText = total_word_count / total_sentence_count;
    dom.getElementById('letter-per-word').innerText = total_letter_count / total_word_count;
    dom.getElementById('syllables').innerText = total_syllable_count;
    dom.getElementById('syllables-per-word').innerText = total_syllable_count / total_word_count;
    // dom.getElementById('word').innerText = words;
    // dom.getElementById('readability').innerText = readabilityLevel;

  };
}

export async function run() {
  return Word.run(async context => {
    const docBody = context.document.body;
    context.load(docBody, ['text', 'paragraphs']);

    return context.sync().then(() => {
      const paragraphs = docBody.paragraphs.items;
      const text = docBody.text;
      runWorker({paragraphs, text}, document);

      return context.sync();
    });
  });
}
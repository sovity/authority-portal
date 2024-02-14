import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sentenceCase',
})
export class SentenceCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    const sentences = value.toLowerCase().split('_');
    const sentenceCaseText = sentences.map((sentence) => {
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    });
    return sentenceCaseText.join('. ');
  }
}

import { generateWordObject, generateWordList } from './wordUtils';
import { UserWordType } from '../types/types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => '1234-5678-9101'),
}));

describe('wordUtils', () => {
  describe('generateWordObject', () => {
    it('should generate a word object with the given word and owner type', () => {
      const newWord = 'test';
      const ownerType = 'user';
      const expected: UserWordType = {
        word: newWord,
        uuid: '1234-5678-9101',
        owner: ownerType,
      };

      const result = generateWordObject(newWord, ownerType);

      expect(result).toEqual(expected);
    });
  });

  describe('generateWordList', () => {
    it('should generate a list of word objects with the given words and owner type', () => {
      const words = ['test1', 'test2'];
      const ownerType = 'platform';
      const expected: UserWordType[] = [
        { word: 'test1', uuid: '1234-5678-9101', owner: ownerType },
        { word: 'test2', uuid: '1234-5678-9101', owner: ownerType },
      ];

      const result = generateWordList(words, ownerType);

      expect(result).toEqual(expected);
    });
  });

  // describe('speak', () => {
  //   it('should call speechSynthesis.speak with the given word', () => {
  //     const word = 'hello';
  //     const speakMock = jest.fn();
  //     window.speechSynthesis.speak = speakMock;

  //     speak(word);

  //     expect(speakMock).toHaveBeenCalledWith(expect.objectContaining({ text: word }));
  //   });

  //   it('should create a SpeechSynthesisUtterance with the correct text', () => {
  //     const word = 'hello';
  //     const utteranceMock = jest.fn().mockImplementation(() => ({ text: '' }));
  //     window.SpeechSynthesisUtterance = utteranceMock;

  //     speak(word);

  //     expect(utteranceMock).toHaveBeenCalled();
  //     expect(utteranceMock.mock.instances[0].text).toBe(word);
  //   });
  // });
});

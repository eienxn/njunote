import { describe, it, expect } from 'vitest';
import { extractHashtags, extractMentions, parseContent } from '../../../src/utils/textParser';

describe('textParser', () => {
  describe('extractHashtags', () => {
    it('should extract single hashtag', () => {
      const text = '今天学习了 #typescript 很有收获';
      const tags = extractHashtags(text);
      expect(tags).toEqual(['typescript']);
    });

    it('should extract multiple hashtags', () => {
      const text = '周末去了 #旅行 拍了很多照片 #摄影 #手账';
      const tags = extractHashtags(text);
      expect(tags).toEqual(['旅行', '摄影', '手账']);
    });

    it('should handle hashtags with English and Chinese', () => {
      const text = '#JavaScript学习 #前端开发 #WebDev';
      const tags = extractHashtags(text);
      expect(tags).toEqual(['JavaScript学习', '前端开发', 'WebDev']);
    });

    it('should return empty array when no hashtags', () => {
      const text = '这是一段普通文本';
      const tags = extractHashtags(text);
      expect(tags).toEqual([]);
    });
  });

  describe('extractMentions', () => {
    it('should extract single mention', () => {
      const text = '感谢 @张三 的帮助';
      const mentions = extractMentions(text);
      expect(mentions).toEqual(['张三']);
    });

    it('should extract multiple mentions', () => {
      const text = '@Alice @Bob 你们看看这个 @Charlie';
      const mentions = extractMentions(text);
      expect(mentions).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should return empty array when no mentions', () => {
      const text = '这是一段普通文本';
      const mentions = extractMentions(text);
      expect(mentions).toEqual([]);
    });
  });

  describe('parseContent', () => {
    it('should parse both hashtags and mentions', () => {
      const text = '今天和 @Bob 一起学习 #typescript #react 很开心';
      const result = parseContent(text);
      expect(result.hashtags).toEqual(['typescript', 'react']);
      expect(result.mentions).toEqual(['Bob']);
    });

    it('should handle empty text', () => {
      const text = '';
      const result = parseContent(text);
      expect(result.hashtags).toEqual([]);
      expect(result.mentions).toEqual([]);
    });
  });
});

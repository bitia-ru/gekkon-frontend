import { wrapHashtagsInText } from '../text_processors';

describe('Function wrapHashtagsInText', () => {
  const path = {
    pathname: '/spots/1/sectors/1/routes/33',
    search: '?foo=baz',
    hash: '#foobaz',
  };
  test('should return array', () => {
    const text = ['Some text'];
    expect(Array.isArray(wrapHashtagsInText(path, text))).toBe(true);
  });
  test('should return array with length equal 1', () => {
    const text = ['Some text'];
    expect(wrapHashtagsInText(path, text).length).toBe(1);
  });
  test('should return array with length equal 1', () => {
    const text = ['http://example.com?foo=bar&baz=test#hash'];
    expect(wrapHashtagsInText(path, text).length).toBe(1);
  });
  test('should return array with length equal 4', () => {
    const text = ['Some text #hashtag', 'http://example.com?foo=bar&baz=test#hash'];
    expect(wrapHashtagsInText(path, text).length).toBe(4);
  });
  test('should return array with wrapped hashtag', () => {
    const text = ['#hashtag'];
    expect(typeof wrapHashtagsInText(path, text)[1]).toBe('object');
    expect(wrapHashtagsInText(path, text).length).toBe(3);
  });
  test('should return array with 1 wrapped hashtag', () => {
    const text = ['#hashtag#hashtag'];
    expect(typeof wrapHashtagsInText(path, text)[1]).toBe('object');
    expect(wrapHashtagsInText(path, text).length).toBe(3);
  });
});

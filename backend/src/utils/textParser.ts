/**
 * 从文本中提取所有 #标签
 * @param text 原始文本
 * @returns 标签数组（不含#符号）
 */
export function extractHashtags(text: string): string[] {
  // 匹配 # 后跟中文、英文、数字、下划线的组合
  const regex = /#([一-龥a-zA-Z0-9_]+)/g;
  const matches = text.matchAll(regex);
  const tags: string[] = [];
  
  for (const match of matches) {
    tags.push(match[1]);
  }
  
  return tags;
}

/**
 * 从文本中提取所有 @提及
 * @param text 原始文本
 * @returns 被提及的昵称数组（不含@符号）
 */
export function extractMentions(text: string): string[] {
  // 匹配 @ 后跟中文、英文、数字、下划线的组合
  const regex = /@([一-龥a-zA-Z0-9_]+)/g;
  const matches = text.matchAll(regex);
  const mentions: string[] = [];
  
  for (const match of matches) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

/**
 * 解析文本内容，提取标签和提及
 * @param text 原始文本
 * @returns 包含标签和提及的对象
 */
export function parseContent(text: string): {
  hashtags: string[];
  mentions: string[];
} {
  return {
    hashtags: extractHashtags(text),
    mentions: extractMentions(text)
  };
}

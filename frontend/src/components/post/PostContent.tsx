import React from 'react';
import { Link } from 'react-router-dom';

interface PostContentProps {
  content: string;
}

export const PostContent: React.FC<PostContentProps> = ({ content }) => {
  // 解析内容，将 #标签 和 @提及 转换为链接
  const parseContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // 匹配 #标签 和 @提及
    const regex = /(#[一-龥a-zA-Z0-9_]+)|(@[一-龥a-zA-Z0-9_]+)/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // 添加普通文本
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const matchedText = match[0];
      
      if (matchedText.startsWith('#')) {
        // 标签链接
        const tagName = matchedText.substring(1);
        parts.push(
          <Link
            key={match.index}
            to={`/tags/${encodeURIComponent(tagName)}`}
            className="text-blue-600 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {matchedText}
          </Link>
        );
      } else if (matchedText.startsWith('@')) {
        // @提及链接（暂时只高亮，不跳转）
        parts.push(
          <span
            key={match.index}
            className="text-blue-600 font-medium"
          >
            {matchedText}
          </span>
        );
      }
      
      lastIndex = regex.lastIndex;
    }
    
    // 添加剩余文本
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };

  return (
    <div className="whitespace-pre-wrap break-words">
      {parseContent(content)}
    </div>
  );
};

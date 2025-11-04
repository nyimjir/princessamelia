import React from 'react';

interface ChatBubbleProps {
  message: {
    role: 'user' | 'model';
    text: string;
  };
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Function to parse markdown-like features: **bold**, [link](url), and newlines
  const renderTextWithMarkdown = (text: string) => {
    // Split by newlines first to preserve them
    return text.split('\n').map((line, lineIndex) => {
      // Regex to find **bold** and [link](url)
      const markdownRegex = /(\*\*.*?\*\*)|(\[.*?\]\(.*?\))/g;
      const parts = line.split(markdownRegex).filter(part => part);

      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, index) => {
            // Check for bold text: **text**
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
            }
            // Check for links: [text](url)
            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
              const [, linkText, linkUrl] = linkMatch;
              return (
                <a
                  key={index}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#6ee7b7] underline transition-opacity hover:opacity-80"
                >
                  {linkText}
                </a>
              );
            }
            // Regular text
            return <span key={index}>{part}</span>;
          })}
          {lineIndex < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#6bb1ff] flex items-center justify-center font-bold text-[#042029] text-sm flex-shrink-0">
          A
        </div>
      )}
      <div
        className={`rounded-2xl py-2.5 px-4 max-w-sm md:max-w-md break-words ${
          isUser
            ? 'bg-gradient-to-r from-[#6ee7b7] to-[#6bb1ff] text-[#042029] rounded-br-lg'
            : 'bg-[#0f1114] rounded-bl-lg'
        }`}
      >
        <div className="whitespace-pre-wrap">{renderTextWithMarkdown(message.text)}</div>
      </div>
    </div>
  );
};

export default ChatBubble;
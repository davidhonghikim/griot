import React from 'react';

interface IFrameViewProps {
  src: string;
  title: string;
}

export const IFrameView: React.FC<IFrameViewProps> = ({ src, title }) => {
  if (!src) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-text-primary">No Service URL</h2>
          <p>The URL for this service is missing or invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={src}
        title={title}
        className="w-full h-full border-0"
        allow="clipboard-write; camera; microphone; geolocation"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  );
}; 
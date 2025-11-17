
import React from 'react';

export const FileIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export const FolderIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" />
  </svg>
);

const IconWrapper: React.FC<{ color: string, children: React.ReactNode }> = ({ color, children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" className={color}>
        <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path fill="rgba(255,255,255,0.2)" d="M14 2v6h6L14 2z"/>
        {children}
    </svg>
);

export const PdfIcon: React.FC = () => (
    <IconWrapper color="text-red-500">
        <text x="6" y="17" fill="white" fontSize="5" fontWeight="bold">PDF</text>
    </IconWrapper>
);
export const DocxIcon: React.FC = () => (
    <IconWrapper color="text-blue-600">
         <text x="7" y="17" fill="white" fontSize="7" fontWeight="bold">W</text>
    </IconWrapper>
);
export const XlsxIcon: React.FC = () => (
    <IconWrapper color="text-green-600">
        <text x="7" y="17" fill="white" fontSize="7" fontWeight="bold">X</text>
    </IconWrapper>
);
export const JpgIcon: React.FC = () => (
    <IconWrapper color="text-yellow-500">
        <circle cx="8.5" cy="13.5" r="1.5" fill="white" />
        <path d="M18 17l-5-5-4 4-2-2-3 3v2h14v-2z" fill="white" opacity="0.8" />
    </IconWrapper>
);
export const PngIcon: React.FC = () => (
     <IconWrapper color="text-purple-500">
        <circle cx="8.5" cy="13.5" r="1.5" fill="white" />
        <path d="M18 17l-5-5-4 4-2-2-3 3v2h14v-2z" fill="white" opacity="0.8" />
    </IconWrapper>
);
export const ZipIcon: React.FC = () => (
    <IconWrapper color="text-gray-500">
        <path d="M9 8h2v2H9z M11 10h2v2h-2z M9 12h2v2H9z M11 14h2v2h-2z M13 6h2v2h-2z M13 8h2v2h-2z M13 10h2v2h-2z" fill="white"/>
    </IconWrapper>
);

export const LinkIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
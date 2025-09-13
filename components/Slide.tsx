
import React from 'react';
import type { SlideContent } from '../types.ts';
import Spinner from './Spinner.tsx';

interface SlideProps {
  slideContent: SlideContent | null;
  slideNumber: number;
  totalSlides: number;
  isLoading: boolean;
  error: string | null;
  topic: string;
}

const Slide: React.FC<SlideProps> = ({ slideContent, slideNumber, totalSlides, isLoading, error, topic }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Spinner />
        <p className="mt-4 text-lg text-gray-400">יוצר שקופית בנושא:</p>
        <p className="mt-1 text-xl text-cyan-400 font-semibold">{topic}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-red-400">
        <h2 className="text-2xl font-bold mb-4">אופס, משהו השתבש</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!slideContent) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-gray-500">מוכן להתחיל...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto relative">
      <div className="absolute top-4 left-4 text-sm font-mono text-gray-500">{slideNumber} / {totalSlides}</div>
      <h2 className="text-3xl font-bold text-cyan-400 mb-6 pb-2 border-b-2 border-cyan-700">{slideContent.title}</h2>
      
      <div className={`flex-grow ${slideContent.code ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : ''}`}>
        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-ul:text-gray-300">
          <ul className="space-y-4 text-lg list-disc pr-6">
            {slideContent.content.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {slideContent.code && (
          <div className="bg-gray-900 rounded-md p-4 flex flex-col">
            <div className="text-sm text-gray-400 mb-2 font-mono flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              C# Code
            </div>
            <pre className="text-sm text-left whitespace-pre-wrap flex-grow bg-transparent text-yellow-300 font-mono" dir="ltr">
              <code>{slideContent.code.trim()}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slide;
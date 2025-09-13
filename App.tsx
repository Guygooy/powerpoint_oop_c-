
import React, { useState, useCallback } from 'react';
import type { SlideContent, LessonTopic } from './types.ts';
import { LESSON_PLAN } from './constants.ts';
import { generateSlideContent } from './services/geminiService.ts';
import { exportToPptx } from './services/powerpointService.ts';
import Slide from './components/Slide.tsx';
import Controls from './components/Controls.tsx';
import Welcome from './components/Welcome.tsx';

const App: React.FC = () => {
  const [slides, setSlides] = useState<Array<SlideContent | null>>(new Array(LESSON_PLAN.length).fill(null));
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const generateSlide = useCallback(async (index: number) => {
    if (index < 0 || index >= LESSON_PLAN.length || slides[index]) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const topic: LessonTopic = LESSON_PLAN[index];
      const content = await generateSlideContent(topic);
      setSlides(prevSlides => {
        const newSlides = [...prevSlides];
        newSlides[index] = content;
        return newSlides;
      });
    } catch (err) {
      console.error("Error generating slide:", err);
      setError("שגיאה ביצירת השקופית. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  }, [slides]);

  const handleStart = useCallback(() => {
    setCurrentSlideIndex(0);
    if (!slides[0]) {
      generateSlide(0);
    }
  }, [generateSlide, slides]);

  const handleNext = useCallback(() => {
    const nextIndex = currentSlideIndex + 1;
    if (nextIndex < LESSON_PLAN.length) {
      setCurrentSlideIndex(nextIndex);
      if (!slides[nextIndex]) {
        generateSlide(nextIndex);
      }
    }
  }, [currentSlideIndex, generateSlide, slides]);

  const handlePrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [currentSlideIndex]);

  const handleExport = useCallback(async () => {
    const generatedSlides = slides.filter((s): s is SlideContent => s !== null);
    if (generatedSlides.length === 0) {
        setExportMessage("יש ליצור לפחות שקופית אחת כדי לייצא.");
        setTimeout(() => setExportMessage(null), 3000);
        return;
    }

    setIsExporting(true);
    setExportMessage("מכין את המצגת לייצוא...");
    try {
        await exportToPptx(generatedSlides, "C# OOP Presentation");
        setExportMessage("המצגת יוצאה בהצלחה!");
    } catch (err) {
        console.error("Error exporting to PowerPoint:", err);
        setExportMessage("אירעה שגיאה בייצוא המצגת.");
    } finally {
        setTimeout(() => {
            setIsExporting(false);
            setExportMessage(null);
        }, 3000);
    }
  }, [slides]);

  const currentSlide = currentSlideIndex >= 0 ? slides[currentSlideIndex] : null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <header className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-4xl font-bold text-cyan-400">מחולל מצגות: תכנות מונחה עצמים ב-C#</h1>
        <p className="text-lg text-gray-400 mt-2">יחידה 5 לפי תכנית הלימודים של משרד החינוך</p>
      </header>
      
      <main className="w-full max-w-5xl h-[60vh] flex flex-col bg-gray-800 shadow-2xl shadow-cyan-500/10 rounded-lg border border-gray-700">
        {currentSlideIndex === -1 ? (
          <Welcome onStart={handleStart} />
        ) : (
          <Slide 
            slideContent={currentSlide} 
            slideNumber={currentSlideIndex + 1} 
            totalSlides={LESSON_PLAN.length}
            isLoading={isLoading} 
            error={error} 
            topic={LESSON_PLAN[currentSlideIndex].topic}
          />
        )}
      </main>
      
      {currentSlideIndex !== -1 && (
        <footer className="w-full max-w-5xl mt-6">
          <Controls 
            onNext={handleNext}
            onPrev={handlePrev}
            isNextDisabled={isLoading || currentSlideIndex >= LESSON_PLAN.length - 1}
            isPrevDisabled={isLoading || currentSlideIndex <= 0}
            isLoading={isLoading}
            onExport={handleExport}
            isExporting={isExporting}
            isExportDisabled={isLoading || slides.every(s => s === null)}
          />
           {exportMessage && (
            <p className="text-center text-sm text-cyan-300 mt-3 h-4">{exportMessage}</p>
          )}
        </footer>
      )}
    </div>
  );
};

export default App;
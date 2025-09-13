import PptxGenJS from 'pptxgenjs';
import type { SlideContent } from '../types';

// A. Define layout constants for positioning elements on the slide
// All units are in inches. Standard widescreen slide is 10" x 5.625"
const TITLE_OPTS = {
  x: 0.5,
  y: 0.25,
  w: 9,
  h: 1,
  fontSize: 32,
  bold: true,
  align: 'right' as const,
  fontFace: 'Arial',
  color: '0088CC', // A shade of cyan
};

const CONTENT_OPTS = {
  x: 5.0,
  y: 1.5,
  w: 4.5,
  h: 3.8,
  fontSize: 16,
  bullet: { type: 'bullet' as const, code: '25CF' },
  align: 'right' as const,
  fontFace: 'Arial',
  paraSpaceAfter: 10,
};

const CODE_OPTS = {
  x: 0.5,
  y: 1.5,
  w: 4.3,
  h: 3.8,
  fontSize: 12,
  fontFace: 'Courier New',
  fill: { color: 'F5F5F5' },
  color: '333333',
  align: 'left' as const,
  lineSpacing: 18,
};

const SINGLE_COL_CONTENT_OPTS = {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 3.8,
  fontSize: 18,
  bullet: { type: 'bullet' as const, code: '25CF' },
  align: 'right' as const,
  fontFace: 'Arial',
  paraSpaceAfter: 10,
};

export const exportToPptx = async (slides: SlideContent[], presentationTitle: string): Promise<void> => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    pptx.author = 'AI Presentation Generator';
    pptx.title = presentationTitle;

    for (const slideContent of slides) {
        const slide = pptx.addSlide();
        
        // Background and footer
        slide.background = { color: '1A202C' }; // Dark gray to match app
        slide.addText(`© ${new Date().getFullYear()} C# OOP Presentation`, {
            x: 0.5, y: 5.1, w: 9, h: 0.4, align: 'center', color: 'CCCCCC', fontSize: 10
        });

        // Add title (handles RTL)
        slide.addText(slideContent.title, { ...TITLE_OPTS, color: '38BDF8' }); // Light cyan
        
        const contentText = slideContent.content.map(point => ({ text: point, options: { breakLine: true } }));
        
        if (slideContent.code) {
             // Two-column layout: Code on the left, Content on the right
            slide.addText(slideContent.code, CODE_OPTS);
            slide.addText(contentText, { ...CONTENT_OPTS, color: 'FFFFFF' }); // White text
        } else {
            // Full-width layout
            slide.addText(contentText, { ...SINGLE_COL_CONTENT_OPTS, color: 'FFFFFF' });
        }
    }

    await pptx.writeFile({ fileName: `${presentationTitle.replace(/\s/g, '_')}.pptx` });
};

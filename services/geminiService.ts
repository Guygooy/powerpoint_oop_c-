
import { GoogleGenAI, Type } from "@google/genai";
import type { SlideContent, LessonTopic } from '../types.ts';
import { LESSON_PLAN } from '../constants.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (topic: LessonTopic): string => {
  const baseInstructions = `נושא השקופית הוא: "${topic.topic}".`;
  
  switch (topic.type) {
    case 'title':
      return `${baseInstructions} זוהי שקופית הפתיחה של המצגת. צור כותרת מרשימה ו-2-3 נקודות המציגות את הנושאים שיילמדו.`;
    case 'toc':
      // Skip Title, TOC itself, and the final Q&A slide.
      const topicsForToc = LESSON_PLAN.slice(2, -1).map(t => t.topic); 
      return `זוהי שקופית "תוכן עניינים". הכותרת צריכה להיות "${topic.topic}". התוכן צריך להיות רשימת נקודות (bullets) של הנושאים הבאים. הצג כל נושא כנקודה נפרדת ברשימה. אל תוסיף קוד. הנושאים הם: ${topicsForToc.join('; ')}.`;
    case 'concept':
      return `${baseInstructions} זהו שקף הסבר. אנא ספק כותרת ברורה, מספר נקודות (bullets) המסבירות את המושג, ודוגמת קוד קצרה ורלוונטית ב-C# אם מתאים.`;
    case 'exercise':
      return `${baseInstructions} זהו שקף תרגיל. אנא ספק כותרת "תרגיל:", ותיאור ברור של משימה שהתלמידים צריכים לבצע במחשב שלהם. אם נדרש, כלול קוד התחלתי או דוגמת פלט רצוי.`;
    case 'summary':
      return `${baseInstructions} זהו שקף סיכום. סכם את הנקודות המרכזיות שנלמדו עד כה או הצג רעיון לפרויקט מסכם.`;
    case 'qa':
      return `${baseInstructions} זוהי שקופית הסיום. צור שקופית פשוטה של "שאלות ותשובות" המעודדת דיון.`;
    default:
      return baseInstructions;
  }
};

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { 
      type: Type.STRING, 
      description: "כותרת השקופית בעברית." 
    },
    content: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "התוכן המרכזי של השקופית. יכול להיות רשימת נקודות להסבר, או תיאור מפורט של תרגיל. כל פריט במערך הוא פסקה או נקודה."
    },
    code: {
      type: Type.STRING,
      description: "קטע קוד רלוונטי ב-C#. אם לא נדרש קוד, השאר מחרוזת ריקה."
    }
  },
  required: ['title', 'content']
};


export const generateSlideContent = async (topic: LessonTopic): Promise<SlideContent> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set");
    return {
      title: "שגיאה: מפתח API חסר",
      content: ["נראה שמפתח ה-API של Gemini אינו מוגדר.", "אנא ודא שהגדרת את מפתח ה-API בסביבת הפרויקט שלך ורענן את הדף."],
    };
  }

  const prompt = generatePrompt(topic);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "אתה מורה מומחה למדעי המחשב המתמחה בשפת C# ובתכנות מונחה עצמים. המשימה שלך היא ליצור תוכן לשקופית אחת במצגת המיועדת לתלמידי כיתה י'-יא' בישראל, בהתאם לתכנית הלימודים של משרד החינוך (יחידה 5). השתמש בעברית פשוטה וברורה להסברים. כל דוגמאות הקוד חייבות להיות ב-C#. התוכן צריך להיות תמציתי ומתאים לשקופית בודדת.",
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    // It's good practice to parse in a try-catch, even with schema enforcement
    const parsedContent = JSON.parse(jsonString) as SlideContent;
    return parsedContent;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Fallback in case of API or parsing error
    return {
      title: "שגיאה ביצירת התוכן",
      content: ["אירעה שגיאה בעת יצירת תוכן השקופית.", "אנא בדוק את חיבור הרשת ואת מפתח ה-API ונסה שוב."],
    };
  }
};

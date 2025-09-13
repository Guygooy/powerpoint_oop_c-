export interface SlideContent {
  title: string;
  content: string[];
  code?: string;
}

export interface LessonTopic {
  topic: string;
  type: 'title' | 'concept' | 'exercise' | 'summary' | 'qa' | 'toc';
}
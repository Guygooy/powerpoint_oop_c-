
import React from 'react';

interface WelcomeProps {
    onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-4xl font-bold text-white mb-4">ברוכים הבאים למחולל המצגות</h2>
            <p className="text-xl text-gray-300 max-w-2xl mb-8">
                אפליקציה זו תיצור עבורכם מצגת שלב-אחר-שלב כדי ללמד את יסודות תכנות מונחה עצמים בשפת C#,
                בדיוק לפי תכנית הלימודים. לחצו על הכפתור כדי להתחיל וליצור את השקופית הראשונה.
            </p>
            <button
                onClick={onStart}
                className="px-10 py-4 text-xl font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400"
            >
                התחל ביצירת המצגת
            </button>
        </div>
    );
};

export default Welcome;

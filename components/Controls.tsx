import React from 'react';

interface ControlsProps {
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
  isLoading: boolean;
  onExport: () => void;
  isExporting: boolean;
  isExportDisabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onNext, 
  onPrev, 
  isNextDisabled, 
  isPrevDisabled, 
  isLoading,
  onExport,
  isExporting,
  isExportDisabled,
}) => {
  const baseButtonClasses = "px-6 py-3 text-lg font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50";
  const disabledClasses = "bg-gray-600 cursor-not-allowed text-gray-400";

  return (
    <div className="flex justify-center items-center w-full gap-4">
        <button
            onClick={onPrev}
            disabled={isPrevDisabled || isExporting}
            className={`${baseButtonClasses} ${isPrevDisabled || isExporting ? disabledClasses : 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500'}`}
            aria-label="Previous Slide"
        >
            הקודם
        </button>
        <button
            onClick={onNext}
            disabled={isNextDisabled || isExporting}
            className={`${baseButtonClasses} ${isNextDisabled || isExporting ? disabledClasses : 'bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-400 text-white'}`}
            aria-label="Next Slide"
        >
            {isLoading ? 'יוצר...' : 'הבא'}
        </button>
        <button
            onClick={onExport}
            disabled={isExportDisabled || isExporting}
            className={`${baseButtonClasses} ${isExportDisabled || isExporting ? disabledClasses : 'bg-green-600 hover:bg-green-500 focus:ring-green-400 text-white'}`}
            aria-label="Export to PowerPoint"
        >
            {isExporting ? 'מייצא...' : 'ייצא ל-PowerPoint'}
        </button>
    </div>
  );
};

export default Controls;
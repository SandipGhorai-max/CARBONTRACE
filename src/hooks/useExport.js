import { useCallback } from 'react';
import { generateCSV, generateJSON } from '../utils/formatters';

/**
 * Custom hook providing export functionality for carbon activities.
 * @returns {Object} { exportData } function.
 */
export const useExport = () => {
  const exportData = useCallback((activities, format) => {
    try {
      const dataStr = format === 'CSV' ? generateCSV(activities) : generateJSON(activities);
      const mimeType = format === 'CSV' ? 'text/csv' : 'application/json';
      const fileExt = format === 'CSV' ? 'csv' : 'json';

      const blob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carbon_history.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  return { exportData };
};

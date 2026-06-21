import React, { useState, useEffect } from 'react';
import { CO2_GREEN_MAX, CO2_AMBER_MAX, TIMINGS, INSIGHT_MESSAGES, LEVEL_STYLES } from '../../constants';
import { AIInsightProps } from '../../types/propTypes';
import { Badge } from '../ui/Badge';

/**
 * AIInsight component.
 * Provides feedback based on projected annual emissions.
 * @param {Object} props Component props.
 * @returns {JSX.Element|null}
 */
export const AIInsight = ({ projectedAnnualTons }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  let level = 'green';
  if (projectedAnnualTons > CO2_AMBER_MAX) level = 'red';
  else if (projectedAnnualTons > CO2_GREEN_MAX) level = 'amber';

  const fullText = INSIGHT_MESSAGES[level];
  const styles = LEVEL_STYLES[level] || LEVEL_STYLES.green;

  useEffect(() => {
    if (projectedAnnualTons === 0) {
      setDisplayText('');
      return;
    }

    let i = 0;
    setIsTyping(true);
    setDisplayText('');

    const timer = setInterval(() => {
      setDisplayText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, TIMINGS.TYPEWRITER_CHAR_DELAY);

    return () => clearInterval(timer);
  }, [projectedAnnualTons, fullText]);

  if (projectedAnnualTons === 0) return null;

  return (
    <section aria-label="AI Generated Insight" className={`bg-slate-900 border ${styles.border} p-6 rounded-xl shadow-lg transition-colors`}>
      <div className="flex items-center gap-3 mb-4">
        <Badge level={level}>AI INSIGHT</Badge>
      </div>
      <p className={`text-sm ${styles.text} font-mono leading-relaxed h-12`}>
        {displayText}
        {isTyping && (
          <span className={`inline-block w-2 h-4 ml-1 align-middle animate-blink ${styles.bg}`} aria-hidden="true" />
        )}
      </p>
    </section>
  );
};

AIInsight.propTypes = AIInsightProps;

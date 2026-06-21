import PropTypes from 'prop-types';

export const ActivityShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  co2: PropTypes.number.isRequired,
});

export const CarbonFormProps = {
  onLiveCo2Change: PropTypes.func.isRequired,
};

export const CarbonSummaryProps = {
  liveCo2: PropTypes.number.isRequired,
};

export const AIInsightProps = {
  projectedAnnualTons: PropTypes.number.isRequired,
};

export const ErrorBoundaryProps = {
  children: PropTypes.node.isRequired,
};

export const CarbonProviderProps = {
  children: PropTypes.node.isRequired,
};

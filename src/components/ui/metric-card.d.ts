import { FunctionComponent } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  color?: string;
  unit?: string;
  delay?: number;
  className?: string;
  description?: string;
}

declare const MetricCard: FunctionComponent<MetricCardProps>;
export default MetricCard;


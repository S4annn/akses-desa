import { complaintStatusColor, serviceStatusColor, aidStatusColor, urgencyColor } from '../../utils/statusColors';
import type { AidStatus, ComplaintStatus, ServiceStatus, Urgency } from '../../types/app';

type StatusKind = 'service' | 'complaint' | 'aid' | 'urgency';

interface Props {
  kind: StatusKind;
  value: ServiceStatus | ComplaintStatus | AidStatus | Urgency;
  className?: string;
}

export function StatusBadge({ kind, value, className = '' }: Props) {
  let color = '';
  if (kind === 'service') color = serviceStatusColor[value as ServiceStatus] ?? '';
  if (kind === 'complaint') color = complaintStatusColor[value as ComplaintStatus] ?? '';
  if (kind === 'aid') color = aidStatusColor[value as AidStatus] ?? '';
  if (kind === 'urgency') color = urgencyColor[value as Urgency] ?? '';
  return (
    <span className={`chip border ${color} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {value}
    </span>
  );
}

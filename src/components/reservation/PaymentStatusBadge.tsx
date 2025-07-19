// components/PaymentStatusBadge.tsx
import React from 'react';
import { Clock, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: 'paid' | 'pending' | 'failed' | 'refunded' | 'partial_refund';
  method: 'card' | 'cash' | 'transfer' | 'pending';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, method }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          label: 'Paid',
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'failed':
        return {
          label: 'Failed',
          icon: AlertCircle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'refunded':
        return {
          label: 'Refunded',
          icon: RotateCcw,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200'
        };
      case 'partial_refund':
        return {
          label: 'Partial Refund',
          icon: RotateCcw,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Card';
      case 'cash': return 'Cash';
      case 'transfer': return 'Transfer';
      case 'pending': return 'On-site';
      default: return 'Unknown';
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
      <span className="text-xs text-gray-500">
        via {getMethodLabel(method)}
      </span>
    </div>
  );
};
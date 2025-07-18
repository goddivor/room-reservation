// src/components/rooms/rooms-overview-cards.tsx
import {
  Buildings2,
  TickSquare,
  Calendar,
  MoneyRecive,
  TrendUp,
  TrendDown,
} from "iconsax-react";
import type { RoomStats } from "@/types/room.types";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  description?: string;
  color?: string;
}

function MetricCard({
  title,
  value,
  change,
  icon,
  trend,
  description,
  color = "#1D4ED8",
}: MetricCardProps) {
  const showTrend = change !== undefined && trend;
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";
  const trendBg = trend === "up" ? "bg-green-100" : "bg-red-100";
  const TrendIcon = trend === "up" ? TrendUp : TrendDown;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}15` }}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        {showTrend && (
          <div
            className={`flex items-center space-x-1 px-3 py-1 rounded-full ${trendBg}`}
          >
            <TrendIcon
              size={14}
              color={trend === "up" ? "#16A34A" : "#DC2626"}
            />
            <span className={`text-sm font-medium ${trendColor}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface RoomsOverviewCardsProps {
  stats: RoomStats;
  trends?: {
    totalRooms?: number;
    availableRooms?: number;
    occupancyRate?: number;
    averageRate?: number;
  };
}

export default function RoomsOverviewCards({
  stats,
  trends,
}: RoomsOverviewCardsProps) {
  const occupancyRate = stats.totalRooms > 0 
    ? ((stats.occupiedRooms + stats.reservedRooms) / stats.totalRooms) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Rooms"
        value={stats.totalRooms.toLocaleString()}
        change={trends?.totalRooms}
        trend={trends?.totalRooms && trends.totalRooms >= 0 ? "up" : "down"}
        icon={<Buildings2 size={24} color="#1D4ED8" variant="Bold" />}
        description="All registered rooms"
        color="#1D4ED8"
      />

      <MetricCard
        title="Available Rooms"
        value={stats.availableRooms.toLocaleString()}
        change={trends?.availableRooms}
        trend={trends?.availableRooms && trends.availableRooms >= 0 ? "up" : "down"}
        icon={<TickSquare size={24} color="#059669" variant="Bold" />}
        description="Ready for booking"
        color="#059669"
      />

      <MetricCard
        title="Occupancy Rate"
        value={`${occupancyRate.toFixed(1)}%`}
        change={trends?.occupancyRate}
        trend={trends?.occupancyRate && trends.occupancyRate >= 0 ? "up" : "down"}
        icon={<Calendar size={24} color="#7C3AED" variant="Bold" />}
        description="Occupied + Reserved"
        color="#7C3AED"
      />

      <MetricCard
        title="Average Rate"
        value={`$${stats.averageRate.toFixed(0)}`}
        change={trends?.averageRate}
        trend={trends?.averageRate && trends.averageRate >= 0 ? "up" : "down"}
        icon={<MoneyRecive size={24} color="#F59E0B" variant="Bold" />}
        description="Per day"
        color="#F59E0B"
      />
    </div>
  );
}
// src/components/users/user-overview-cards.tsx
import {
  People,
  TickSquare,
  TrendUp,
  TrendDown,
  Eye,
  Login,
} from "iconsax-react";
import type { UserStats } from "@/types/user.types";

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

interface UserOverviewCardsProps {
  stats: UserStats;
  trends?: {
    totalUsers?: number;
    verifiedUsers?: number;
    onlineUsers?: number;
    loginActivity?: number;
  };
}

export default function UserOverviewCards({
  stats,
  trends,
}: UserOverviewCardsProps) {
  const verificationRate = stats.totalUsers > 0 
    ? ((stats.verifiedUsers / stats.totalUsers) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        change={trends?.totalUsers}
        trend={trends?.totalUsers && trends.totalUsers >= 0 ? "up" : "down"}
        icon={<People size={24} color="#1D4ED8" variant="Bold" />}
        description="All registered users"
        color="#1D4ED8"
      />

      <MetricCard
        title="Verified Users"
        value={`${stats.verifiedUsers} (${verificationRate.toFixed(0)}%)`}
        change={trends?.verifiedUsers}
        trend={trends?.verifiedUsers && trends.verifiedUsers >= 0 ? "up" : "down"}
        icon={<TickSquare size={24} color="#059669" variant="Bold" />}
        description="Email verified accounts"
        color="#059669"
      />

      <MetricCard
        title="Online Now"
        value={stats.onlineUsers.toLocaleString()}
        change={trends?.onlineUsers}
        trend={trends?.onlineUsers && trends.onlineUsers >= 0 ? "up" : "down"}
        icon={<Eye size={24} color="#7C3AED" variant="Bold" />}
        description="Currently active users"
        color="#7C3AED"
      />

      <MetricCard
        title="Login Activity"
        value={stats.loginActivityToday.toLocaleString()}
        change={trends?.loginActivity}
        trend={trends?.loginActivity && trends.loginActivity >= 0 ? "up" : "down"}
        icon={<Login size={24} color="#F59E0B" variant="Bold" />}
        description="Logins today"
        color="#F59E0B"
      />
    </div>
  );
}
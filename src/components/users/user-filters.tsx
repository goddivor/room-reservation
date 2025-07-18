// src/components/users/user-filters.tsx
import { Filter, SearchNormal1, CloseCircle, Calendar } from "iconsax-react";
import { Input } from "@/components/forms/Input";
import { CustomSelect } from "@/components/forms/custom-select";
import Button from "@/components/actions/button";
import type { UserFilters } from "@/types/user.types";

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export default function UserFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  onToggleFilters,
  showFilters,
}: UserFiltersProps) {
  const handleFilterChange = <K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Verified", value: "verified" },
    { label: "Pending Verification", value: "pending" },
    { label: "Suspended", value: "suspended" },
  ];

  const activeOptions = [
    { label: "All Users", value: "" },
    { label: "Active Only", value: "true" },
    { label: "Inactive Only", value: "false" },
  ];

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== null
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">User Filters</h2>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              Active filters
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
            >
              <CloseCircle size={16} color="currentColor" />
              <span>Clear All</span>
            </Button>
          )}
          <Button
            onClick={onToggleFilters}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} color="currentColor" />
            <span className="ml-2">{showFilters ? "Hide" : "Show"} Filters</span>
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <SearchNormal1
              size={18}
              color="#6B7280"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <Input
              placeholder="Search users..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status */}
          <CustomSelect
            options={statusOptions}
            value={filters.status || ""}
            onChange={(value) => handleFilterChange("status", value ? value as UserFilters["status"] : undefined)}
            placeholder="Select status"
          />

          {/* Active Status */}
          <CustomSelect
            options={activeOptions}
            value={filters.isActive !== undefined ? filters.isActive.toString() : ""}
            onChange={(value) => 
              handleFilterChange("isActive", value === "" ? undefined : value === "true")
            }
            placeholder="Select activity"
          />

          {/* Phone Filter */}
          <CustomSelect
            options={[
              { label: "All Users", value: "" },
              { label: "With Phone", value: "true" },
              { label: "Without Phone", value: "false" },
            ]}
            value={filters.hasPhone !== undefined ? filters.hasPhone.toString() : ""}
            onChange={(value) => 
              handleFilterChange("hasPhone", value === "" ? undefined : value === "true")
            }
            placeholder="Phone number"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-6 space-y-6">
          {/* Date Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Registration Date</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Calendar
                  size={18}
                  color="#6B7280"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  type="date"
                  placeholder="From date"
                  value={filters.createdAfter || ""}
                  onChange={(e) => handleFilterChange("createdAfter", e.target.value || undefined)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar
                  size={18}
                  color="#6B7280"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  type="date"
                  placeholder="To date"
                  value={filters.createdBefore || ""}
                  onChange={(e) => handleFilterChange("createdBefore", e.target.value || undefined)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Last Login Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Last Login</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Calendar
                  size={18}
                  color="#6B7280"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  type="date"
                  placeholder="Last login after"
                  value={filters.lastLoginAfter || ""}
                  onChange={(e) => handleFilterChange("lastLoginAfter", e.target.value || undefined)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Filters:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilterChange("status", "verified")}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-full"
              >
                Verified Only
              </Button>
              <Button
                onClick={() => handleFilterChange("status", "pending")}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full"
              >
                Pending Verification
              </Button>
              <Button
                onClick={() => handleFilterChange("isActive", true)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full"
              >
                Active Users
              </Button>
              <Button
                onClick={() => handleFilterChange("hasPhone", false)}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full"
              >
                Missing Phone
              </Button>
              <Button
                onClick={() => {
                  const today = new Date();
                  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  handleFilterChange("createdAfter", lastWeek.toISOString().split('T')[0]);
                }}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-full"
              >
                New This Week
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconColor?: string;
}

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  iconColor = "text-primary",
}: DashboardCardProps) => {
  return (
    <div className={cn(
      "glass-card p-6 rounded-xl hover:border-primary/30 transition-all duration-300 group",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2 font-display">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs",
              trend.isPositive ? "text-emerald-400" : "text-red-400"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors",
          iconColor
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  gradient?: string;
}

export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  gradient = "from-primary to-accent",
}: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="glass-card p-5 rounded-xl text-left hover:border-primary/30 transition-all duration-300 group w-full"
    >
      <div className={cn(
        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
        gradient
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  );
};

interface ActivityItemProps {
  title: string;
  time: string;
  icon: LucideIcon;
  iconColor?: string;
}

export const ActivityItem = ({
  title,
  time,
  icon: Icon,
  iconColor = "text-primary",
}: ActivityItemProps) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
      <div className={cn(
        "p-2 rounded-lg bg-white/5",
        iconColor
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};

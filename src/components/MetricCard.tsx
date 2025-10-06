import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  description?: string;
}
export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  description
}: MetricCardProps) => {
  return <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && <p className="text-xs text-accent font-medium">{trend}</p>}
        </div>
        
      </div>
    </Card>;
};
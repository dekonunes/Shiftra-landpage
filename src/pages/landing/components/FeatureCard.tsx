import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

/**
 * FeatureCard - Display a single feature with icon, title, and description
 *
 * Used in FeaturesSection to showcase worker and business features.
 * Built on shadcn/ui Card component with consistent styling.
 *
 * @example
 * <FeatureCard
 *   icon={Calendar}
 *   title="Shift calendar and reminders"
 *   description="Never miss a shift with automated notifications"
 * />
 */
export default function FeatureCard({
  icon: Icon,
  title,
  description,
  className = '',
}: FeatureCardProps) {
  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
      size="sm"
    >
      <CardHeader>
        {/* Icon container with theme-aware background */}
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-6" aria-hidden="true" />
        </div>

        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

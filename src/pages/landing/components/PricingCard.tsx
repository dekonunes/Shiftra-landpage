import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingFeature {
  id: string;
  labelKey: string;
  included: boolean;
  isBase?: boolean; // Base features shown on all cards
  isPlanSpecific?: boolean; // Plan-specific features (Worker discovery, Chat, Translation)
}

interface PricingCardProps {
  tier: 'free' | 'starter' | 'pro';
  titleKey: string;
  descriptionKey: string;
  price: string;
  billingKey: string;
  badgeKey?: string;
  ctaKey: string;
  features: PricingFeature[];
  recommended?: boolean;
  className?: string;
}

/**
 * PricingCard - Display pricing tier with features and CTA
 *
 * Used in PricingSection to showcase Free, Starter, and Pro tiers.
 * Supports tier-based styling with recommended badge and responsive layout.
 *
 * @example
 * <PricingCard
 *   tier="pro"
 *   titleKey="pricing.pro.title"
 *   price="$27"
 *   features={proFeatures}
 *   recommended={true}
 * />
 */
export default function PricingCard({
  tier,
  titleKey,
  descriptionKey,
  price,
  billingKey,
  badgeKey,
  ctaKey,
  features,
  recommended = false,
  className = '',
}: PricingCardProps) {
  return (
    <Card
      data-pricing-card={tier}
      className={cn(
        'group relative flex flex-col transition-all duration-300',
        recommended && 'ring-2 ring-primary shadow-xl scale-105',
        className
      )}
    >
      {/* Recommended badge */}
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md">
          Recommended
        </div>
      )}

      <CardHeader className="flex-grow">
        {/* Tier badge (e.g., "No credit card required" for Free tier) */}
        {badgeKey && (
          <div className="mb-2 inline-flex self-start rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {badgeKey}
          </div>
        )}

        {/* Tier name */}
        <h3 className="mb-2 text-xl font-bold">{titleKey}</h3>

        {/* Tier description */}
        <p className="mb-4 text-sm text-muted-foreground">{descriptionKey}</p>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-sm text-muted-foreground">/ {billingKey}</span>
          </div>
        </div>

        {/* Features list */}
        <ul className="space-y-3">
          {features.map((feature) => (
            <li
              key={feature.id}
              data-feature-type={
                feature.isBase ? 'base' : feature.isPlanSpecific ? `${tier}-exclusive` : 'standard'
              }
              className={cn(
                'flex items-start gap-3 text-sm',
                !feature.included && 'opacity-50'
              )}
            >
              {/* Icon: Check (included) or X (not included) */}
              <span
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                  feature.included
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
                aria-hidden="true"
              >
                {feature.included ? (
                  <Check className="size-3" strokeWidth={3} />
                ) : (
                  <X className="size-3" strokeWidth={2} />
                )}
              </span>

              {/* Feature label */}
              <span className={cn(!feature.included && 'line-through')}>{feature.labelKey}</span>
            </li>
          ))}
        </ul>
      </CardHeader>

      {/* CTA button */}
      <CardContent>
        <Button
          variant={recommended ? 'default' : 'outline'}
          size="lg"
          className="w-full"
          aria-label={`Choose ${titleKey} plan`}
        >
          {ctaKey}
        </Button>
      </CardContent>
    </Card>
  );
}

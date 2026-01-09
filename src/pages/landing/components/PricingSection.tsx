import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

export default function PricingSection() {
  const { t } = useTranslation();

  const pricingTiers = [
    {
      id: 'free',
      name: t('pricing.free.name'),
      price: t('pricing.free.price'),
      period: null,
      description: t('pricing.free.description'),
      badge: t('pricing.free.badge'),
      cta: t('pricing.free.cta'),
      baseFeatures: [
        t('pricing.features.base'),
        t('pricing.features.calendar'),
        t('pricing.features.hours'),
        t('pricing.features.payment'),
        t('pricing.features.invoice'),
      ],
      notIncluded: [t('pricing.features.discovery')],
    },
    {
      id: 'starter',
      name: t('pricing.starter.name'),
      price: t('pricing.starter.price'),
      period: t('pricing.starter.period'),
      description: t('pricing.starter.description'),
      cta: t('pricing.starter.cta'),
      baseFeatures: [
        t('pricing.features.base'),
        t('pricing.features.calendar'),
        t('pricing.features.hours'),
        t('pricing.features.payment'),
        t('pricing.features.invoice'),
      ],
      exclusiveFeatures: [t('pricing.features.discovery')],
    },
    {
      id: 'pro',
      name: t('pricing.pro.name'),
      price: t('pricing.pro.price'),
      period: t('pricing.pro.period'),
      description: t('pricing.pro.description'),
      cta: t('pricing.pro.cta'),
      baseFeatures: [
        t('pricing.features.base'),
        t('pricing.features.calendar'),
        t('pricing.features.hours'),
        t('pricing.features.payment'),
        t('pricing.features.invoice'),
        t('pricing.features.discovery'),
      ],
      exclusiveFeatures: [
        t('pricing.features.chat'),
        t('pricing.features.translation'),
      ],
    },
  ];

  return (
    <section id="pricing" className="px-4 py-20 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12">
          {t('pricing.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`flex flex-col p-6 ${
                tier.id === 'pro'
                  ? 'bg-primary/5 ring-2 ring-primary/30 lg:scale-105 lg:shadow-xl'
                  : tier.id === 'starter'
                  ? 'border-l-4 border-primary'
                  : ''
              }`}
            >
              {/* Badge for Free plan */}
              {tier.badge && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                {tier.period && (
                  <span className="text-muted-foreground ml-2">
                    {tier.period}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{tier.description}</p>

              {/* CTA Button */}
              <Button
                className="w-full mb-6"
                variant={tier.id === 'pro' ? 'default' : 'outline'}
              >
                {tier.cta}
              </Button>

              {/* Divider */}
              <div className="border-t border-border mb-6" />

              {/* Features List */}
              <ul className="space-y-3 flex-grow">
                {/* Base features */}
                {tier.baseFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check
                      className="size-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}

                {/* Exclusive features */}
                {tier.exclusiveFeatures?.map((feature, index) => (
                  <li key={`exclusive-${index}`} className="flex items-start gap-3">
                    <Check
                      className="size-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}

                {/* Not included features */}
                {tier.notIncluded?.map((feature, index) => (
                  <li
                    key={`not-${index}`}
                    className="flex items-start gap-3 opacity-50"
                  >
                    <X
                      className="size-5 text-muted-foreground shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm line-through">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

type WaitlistFeature =
  | 'shift-management'
  | 'earnings-tracking'
  | 'invoice-generation'
  | 'crew-chat'
  | 'translation'
  | 'worker-discovery';

interface WaitlistFormData {
  selectedFeatures: WaitlistFeature[];
  feedback: string;
  email: string;
}

interface ValidationErrors {
  email?: string;
}

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WaitlistDialog({
  open,
  onOpenChange,
}: WaitlistDialogProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<WaitlistFormData>({
    selectedFeatures: [],
    feedback: '',
    email: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const features: Array<{ id: WaitlistFeature; labelKey: string }> = [
    { id: 'shift-management', labelKey: 'waitlist.features.shiftManagement' },
    { id: 'earnings-tracking', labelKey: 'waitlist.features.earningsTracking' },
    { id: 'invoice-generation', labelKey: 'waitlist.features.invoiceGeneration' },
    { id: 'crew-chat', labelKey: 'waitlist.features.crewChat' },
    { id: 'translation', labelKey: 'waitlist.features.translation' },
    { id: 'worker-discovery', labelKey: 'waitlist.features.workerDiscovery' },
  ];

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return t('waitlist.emailRequired');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('waitlist.emailInvalid');
    }

    return undefined;
  };

  const handleFeatureToggle = (feature: WaitlistFeature) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter((f) => f !== feature)
        : [...prev.selectedFeatures, feature],
    }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData((prev) => ({ ...prev, email }));

    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleEmailBlur = () => {
    const error = validateEmail(formData.email);
    if (error) {
      setErrors((prev) => ({ ...prev, email: error }));
    }
  };

  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, feedback: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    // Log to console (no backend integration yet)
    console.log('Waitlist submission:', {
      email: formData.email,
      features: formData.selectedFeatures,
      feedback: formData.feedback,
      timestamp: new Date().toISOString(),
    });

    // Show success state
    setIsSubmitted(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Wait for dialog close animation before resetting
      setTimeout(() => {
        setFormData({
          selectedFeatures: [],
          feedback: '',
          email: '',
        });
        setErrors({});
        setIsSubmitted(false);
      }, 200);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        {isSubmitted ? (
          // Success state
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="size-8 text-green-600 dark:text-green-500" />
            </div>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl">
                {t('waitlist.successTitle')}
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                {t('waitlist.successMessage', { email: formData.email })}
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => handleDialogClose(false)} className="mt-4">
              {t('waitlist.close')}
            </Button>
          </div>
        ) : (
          // Form state
          <>
            <DialogHeader>
              <DialogTitle>{t('waitlist.title')}</DialogTitle>
              <DialogDescription>{t('waitlist.description')}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              {/* Feature selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t('waitlist.featuresLabel')}
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={feature.id}
                        checked={formData.selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                      <label
                        htmlFor={feature.id}
                        className="text-sm cursor-pointer"
                      >
                        {t(feature.labelKey)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback textarea */}
              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-sm font-medium">
                  {t('waitlist.feedbackLabel')}
                </Label>
                <Textarea
                  id="feedback"
                  value={formData.feedback}
                  onChange={handleFeedbackChange}
                  placeholder={t('waitlist.feedbackPlaceholder')}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Email input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t('waitlist.emailLabel')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder={t('waitlist.emailPlaceholder')}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-sm text-red-600 dark:text-red-500"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={!!errors.email}>
                {t('waitlist.submit')}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

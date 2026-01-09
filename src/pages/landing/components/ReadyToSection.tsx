import { useTranslation } from "react-i18next";

export default function ReadyToSection() {
  const { t } = useTranslation();

  // Retrieve i18n strings
  const prefix = t("readyTo.prefix");
  const phrases = t("readyTo.phrases", { returnObjects: true }) as string[];

  return (
    <section id="ready-to" className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          {/* Static prefix text */}
          <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
            {prefix}
          </p>

          {/* Animated phrases container */}
          <div className="dropping-texts h-[3.8rem] sm:h-[4.3rem] lg:h-[4.8rem] overflow-hidden relative w-full">
            {phrases.map((phrase, index) => (
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
              >
                {phrase}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

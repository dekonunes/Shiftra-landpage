import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface FlowMessage {
  sender: "boss" | "bot";
  label: string;
  text: string;
  highlights?: string[];
}

const MESSAGE_ANIMATION_MS = 2500;
const TYPING_INDICATOR_MS = 200;
const BETWEEN_MESSAGE_DELAY_MS = 0;

export default function WhatsAppShiftFlowSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const title = t("whatsappShiftFlow.title");
  const description = t("whatsappShiftFlow.description");
  const chatTitle = t("whatsappShiftFlow.chatTitle");
  const bossLabel = t("whatsappShiftFlow.participants.boss");
  const botLabel = t("whatsappShiftFlow.participants.bot");
  const bossMessage = t("whatsappShiftFlow.messages.bossInitial");
  const botWeatherMessage = t("whatsappShiftFlow.messages.botWeather");
  const botReviewMessage = t("whatsappShiftFlow.messages.botReview");
  const bossConfirmMessage = t("whatsappShiftFlow.messages.bossConfirm");
  const botSharePromptMessage = t("whatsappShiftFlow.messages.botSharePrompt");
  const botFinalMessage = t("whatsappShiftFlow.messages.botFinal");
  const botGroupMessage = t("whatsappShiftFlow.messages.botGroup");

  const messages = useMemo<FlowMessage[]>(
    () => [
      {
        sender: "boss",
        label: bossLabel,
        text: bossMessage,
      },
      {
        sender: "bot",
        label: botLabel,
        text: botWeatherMessage,
      },
      {
        sender: "bot",
        label: botLabel,
        text: botReviewMessage,
      },
      {
        sender: "boss",
        label: bossLabel,
        text: bossConfirmMessage,
      },
      {
        sender: "bot",
        label: botLabel,
        text: botSharePromptMessage,
      },
      {
        sender: "bot",
        label: botLabel,
        text: botFinalMessage,
      },
      {
        sender: "bot",
        label: botLabel,
        text: botGroupMessage,
        highlights: ["Aline", "Gustave", "Clea"],
      },
    ],
    [
      bossLabel,
      botLabel,
      bossMessage,
      botWeatherMessage,
      botReviewMessage,
      bossConfirmMessage,
      botSharePromptMessage,
      botFinalMessage,
      botGroupMessage,
    ]
  );

  const renderMessageText = (
    text: string,
    highlights?: string[]
  ): ReactNode => {
    if (!highlights || highlights.length === 0) {
      return text;
    }

    const nodes: ReactNode[] = [];
    let cursor = 0;
    let keyIndex = 0;

    while (cursor < text.length) {
      let nextIndex = -1;
      let nextHighlight = "";

      for (const highlight of highlights) {
        const index = text.indexOf(highlight, cursor);
        if (index !== -1 && (nextIndex === -1 || index < nextIndex)) {
          nextIndex = index;
          nextHighlight = highlight;
        }
      }

      if (nextIndex === -1) {
        nodes.push(text.slice(cursor));
        break;
      }

      if (nextIndex > cursor) {
        nodes.push(text.slice(cursor, nextIndex));
      }

      nodes.push(
        <strong key={`highlight-${keyIndex}`} className="font-semibold">
          {nextHighlight}
        </strong>
      );
      keyIndex += 1;
      cursor = nextIndex + nextHighlight.length;
    }

    return nodes;
  };

  const [typedMessages, setTypedMessages] = useState<string[]>(() =>
    messages.map(() => "")
  );
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedMessages(messages.map((message) => message.text));
      setTypingIndex(null);
      setHasAnimated(true);
      return;
    }

    setTypedMessages(messages.map(() => ""));
    setTypingIndex(null);
    setHasAnimated(false);
  }, [messages, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || hasAnimated) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.4 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
      observer.disconnect();
    };
  }, [prefersReducedMotion, hasAnimated]);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible || hasAnimated) {
      return;
    }

    let isCancelled = false;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const runSequence = async () => {
      for (let index = 0; index < messages.length; index += 1) {
        if (isCancelled) return;
        setTypingIndex(index);
        await delay(TYPING_INDICATOR_MS);

        const messageText = messages[index].text;
        const messageDuration = Math.max(
          MESSAGE_ANIMATION_MS - TYPING_INDICATOR_MS,
          0
        );
        const charDelay = messageDuration / Math.max(messageText.length, 1);
        for (
          let charIndex = 0;
          charIndex < messageText.length;
          charIndex += 1
        ) {
          if (isCancelled) return;
          await delay(charDelay);
          const slice = messageText.slice(0, charIndex + 1);
          setTypedMessages((prev) => {
            const next = [...prev];
            next[index] = slice;
            return next;
          });
        }

        setTypingIndex(null);
        await delay(BETWEEN_MESSAGE_DELAY_MS);
      }

      if (!isCancelled) {
        setHasAnimated(true);
      }
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, [hasAnimated, isVisible, messages, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="whatsapp-shift-flow"
      className="px-4 py-20 bg-muted/30"
    >
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1fr,1.15fr] items-center">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-[32px] border border-border bg-background/90 p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-5">
            <span
              className="size-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span className="font-semibold text-foreground">{chatTitle}</span>
          </div>

          <div className="space-y-4">
            {messages.map((message, index) => {
              const isBoss = message.sender === "boss";
              const messageText = prefersReducedMotion
                ? message.text
                : typedMessages[index];
              const isTyping =
                typingIndex === index && messageText.length === 0;
              const shouldRender =
                prefersReducedMotion || isTyping || messageText.length > 0;

              if (!shouldRender) {
                return null;
              }

              return (
                <div
                  key={`${message.sender}-${index}`}
                  className={`flex flex-col ${
                    isBoss ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    {message.label}
                  </span>
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed shadow-sm ${
                      isBoss
                        ? "bg-emerald-500 text-white rounded-br-sm"
                        : "bg-card text-foreground border border-border rounded-bl-sm"
                    }`}
                  >
                    {isTyping ? (
                      <div
                        className={`flex items-center gap-1 ${
                          isBoss ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {["0ms", "150ms", "300ms"].map((delay) => (
                          <span
                            key={delay}
                            className="size-2 rounded-full bg-current animate-bounce motion-reduce:animate-none"
                            style={{ animationDelay: delay }}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">
                        {renderMessageText(messageText, message.highlights)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

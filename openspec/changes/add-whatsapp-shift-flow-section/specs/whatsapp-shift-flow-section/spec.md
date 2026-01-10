## ADDED Requirements
### Requirement: WhatsAppShiftFlowSection content and placement
The system SHALL render a WhatsAppShiftFlowSection between the ReadyToSection and HowItWorksSection that shows a WhatsApp-style conversation of the boss creating a shift and the bot replying with a shareable message and link, using copy sourced from WHATSAPP_SHIFT_FLOW.md.

#### Scenario: User scrolls to the WhatsApp shift flow section on desktop
- **WHEN** the user reaches the section
- **THEN** the section appears between Ready To and How It Works
- **AND** the conversation includes the boss message and the bot reply with the shareable message and acceptance link.

### Requirement: WhatsAppShiftFlowSection animation behavior
The system SHALL animate the conversation with a typing-style effect and sequential message reveal, and it SHALL render the full conversation statically when `prefers-reduced-motion` is enabled.

#### Scenario: User views the section with animations enabled
- **WHEN** the section becomes visible
- **THEN** a typing indicator or typing animation plays before each message appears in sequence.

#### Scenario: User prefers reduced motion
- **WHEN** `prefers-reduced-motion` is enabled
- **THEN** all messages render fully without animated typing.

### Requirement: WhatsAppShiftFlowSection internationalization and responsive layout
The system SHALL source all section text from i18n translations and maintain a readable layout across mobile and desktop breakpoints.

#### Scenario: User switches language to Portuguese
- **WHEN** the language is changed to pt-BR
- **THEN** the message content renders in Portuguese without overflow.

#### Scenario: User views on mobile
- **WHEN** the viewport is 375px wide
- **THEN** the conversation layout stacks and remains readable without horizontal scrolling.

# AI module boundaries

AI functionality is isolated behind provider interfaces and asynchronous BullMQ jobs:

- `RecommendationProvider`: produces explainable candidate ranking from explicit preferences and permitted activity signals.
- `ContentSafetyProvider`: examines uploaded media and chat events before visibility; a human moderator remains the final escalation point.
- `FraudSignalProvider`: emits review signals for duplicates or account anomalies—never an automatic adverse decision without a policy-approved review path.
- `AssistantProvider`: provides bio drafts, conversation starters and wedding planning suggestions with clear user review before publishing or sending.

Do not send government IDs, raw biometrics, payment data or private message history to a generative model. Version prompts/models, log redacted metadata, evaluate bias and accuracy, set retention boundaries, and provide user-facing disclosure and opt-out wherever legally required.

# Security Specifications & Rules Design

## 1. Data Invariants
- **Profile Integrity**: A user profile document must match the schema and can only be updated with valid field types.
- **Submission Association**: A drawing submission must have valid userId, promptId, and imageUrl.
- **Auth User Fallback Safety**: Credentials must contain a valid ID, email, and password, and cannot be list-queried by public clients.
- **Rating Restrictions**: Ratings must have a rating score of type number.

## 2. The "Dirty Dozen" Malicious Payloads
Here are the payloads designed to test our rules for protection against ID spoofing, type injection, state hijacking, and PII leaks:
1. Profile: Shadow fields inject (e.g., `{ id: "123", username: "user", displayName: "A", isVerified: true }`).
2. Profile: Negative streak update (e.g., `{ currentStreak: -1 }`).
3. Auth User: Listing entire auth directory.
4. Submission: Empty imageUrl payload.
5. Submission: Poisoning promptId with a 2MB random text.
6. Rating: Non-numeric rating value (e.g., `{ rating: "five-stars" }`).
7. Rating: rating value out of bounds (e.g., `{ rating: 99 }`).
8. Comment: Empty text comment.
9. Comment: Injecting arbitrary HTML/script in text comment.
10. Friendship: Injecting false roles/statuses.
11. Private Challenge: Missing deadline or past timestamp.
12. Notification: Setting read state for another recipient.

## 3. Security Rules Draft Ruleset
We define the security ruleset to handle both authenticated users (standard Firebase Auth) and custom sandbox fallback unauthenticated flows with rich schema validation.

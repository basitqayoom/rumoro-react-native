# Rumoro — MVP Spec (v0.2)
_Last updated: 2025-08-12 • Owner: Basit_

## 1. One-liner
Rumoro is an anonymous, profile-centric social app where users post text-only gossips under a person’s public profile (found via Instagram/X/Snapchat handle), organized into channels. Engagement is driven by a Buzz Score that users can spend on perks like Boosts or creating new channels.

## 2. Scope (MVP)
**Included**
- Phone + OTP sign-in
- Link socials: Instagram, X/Twitter, Snapchat (official OAuth/Snap Kit only)
- Discover/create Person Profiles by @handle
- Text-only gossips (+ text-only replies)
- Channels: preset set + user-created channels (costs Buzz)
- Buzz Score (earn + spend)
- Safety: report/block, owner claim + hide, keyword filters
- Feeds: Hot (ranked) / Latest
- Notifications, basic analytics events

**Excluded (MVP)**
- Photos/audio in posts
- Identity-reveal features
- DMs, ads, advanced analytics

## 3. Key Entities
- **User** — logs in via phone OTP; posts/replies anonymously.
- **Person Profile** — public page tied to a verified @handle (IG/X/Snap); can be claimed by the real owner.
- **Channel** — topic bucket inside a Person Profile.
- **Gossip** — text-only anonymous post within a Channel.
- **Reply** — text-only response to a gossip.
- **Buzz Score** — points earned for healthy activity; spent on Boost or Create Channel.

## 4. Channels
### 4.1 Preset Channels (always available)
- Work
- College/School
- Talent/Skills
- Tea/Spill
- Q&A
- Fact-Check
- Misc

### 4.2 User-Created Channels (Buzz spend)
- **Cost:** 30 Buzz (non-refundable)
- **Per-profile caps:** max 5 custom channels total; per-user create limit 1/day/profile
- **Name rules:** 3–16 chars; letters/numbers/spaces; banned-word filter; deduped per profile
- **Ownership:** community-owned; profile owner may disable or merge into a preset
- **Visibility:** appears immediately with a “community-created” tag; auto-collapse if empty for 7 days

## 5. Posting & Replies (text-only)
- **Compose fields:** Channel selector + Text (≤ 800 chars)
- **Replies:** text only; anonymous by default
- **Pre-publish warnings:** show inline risk hints (doxxing/hate/threats)

## 6. Social Linking (verification/discovery)
- **Supported:** Instagram, X/Twitter, Snapchat
- **Use:** discovery, profile claim badge; no third-party passwords/OTPs
- **Method:** official OAuth / Snap Kit Login only

## 7. Buzz Score (MVP loop)
**Earn**
- +1 daily open (streak)
- +2 post survives 24h (not removed)
- +3 your post gets 3+ unique replies within 24h
- +10 claim your own profile

**Spend**
- Create Channel: −30 Buzz
- Boost a gossip (30 min): −10
- Cosmetic badge/frame (7d): −15

**Anti-abuse:** no Buzz from removed content; rate limits; device/fraud checks.

## 8. Owner Tools (for claimed profiles)
- Hide any gossip (removes from public view)
- Disable/Merge user-created channels
- Optional keyword filters across all channels

## 9. Safety & Moderation
- **Prohibited:** doxxing, threats, hate, sexual content involving minors, illegal content
- **User controls:** 3-tap Report, Block poster (viewer-level)
- **Privacy:** EXIF not applicable (no photos); data minimization; honor “Reduce Motion”
- **Store compliance:** anonymous features with strong moderation; minors-safe defaults

## 10. Navigation (MVP)
- **Home:** Hot / Latest
- **Search:** by @handle/name; seed profile if missing
- **Profile (Person):** header + Channels tabs (preset + custom)
- **Gossip Detail:** full text + actions (Reply, Boost, Report)
- **Compose:** global FAB → channel + text
- **Notifications**
- **Me:** Buzz, linked socials, settings, blocks

## 11. Events (analytics)
- **Auth:** auth_phone_submit, auth_otp_submit
- **Discovery:** search_query, profile_view, channel_switch
- **Create:** compose_open, compose_post, reply_posted
- **Channels:** channel_create_open, channel_create_confirmed, channel_create_blocked, channel_disabled_by_owner, channel_merged_by_owner
- **Buzz:** buzz_earned, buzz_spent_channel_create, buzz_spent_boost, buzz_spent_cosmetic
- **Safety:** report_submit, owner_hide

## 12. Acceptance Criteria
- Users can post text-only gossips to preset channels in ≤3 taps
- Users can create a custom channel by spending 30 Buzz, subject to caps and naming rules
- Custom channels are tagged “community-created” and can be disabled/merged by the profile owner
- Instagram/X/Snapchat linking works via official flows
- Pre-publish warnings, report/block, and owner hide operate as specified
- Buzz earn/spend updates instantly; Boost expires automatically (30 min)

## 13. Open Questions (for Basit to decide)
- Keep Create Channel cost at 30 Buzz or adjust?
- Final cap for custom channels per profile (suggested 5)?
- Channel merge UX: auto-move existing posts or leave as archived view?
- Any country-specific age gating or additional friction at compose?

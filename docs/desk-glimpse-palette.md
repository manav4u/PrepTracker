# Desk glimpse: iOS-informed web system
Proposed, not approved or deployed. Replaces PR126's rejected saturated tile proposal.

## Roles
| Role | Token | Light value | Use |
|---|---|---|---|
| Ground | --ground | #f2f3f5 | Main grouped background |
| Group | --group | #ffffff | Content groups, not every nested control |
| Inset | --inset | #f3f4f6 | Secondary controls and icon wells |
| Primary text | --text | #222428 | Topic, course names, data |
| Secondary text | --secondary | #62666e | Context and explanation |
| Tertiary text | --tertiary | #707783 | Short metadata |
| Separator | --separator | #ececef | Within-group row boundaries |
| Interactive accent | --accent | #b63829 | Primary action, links, selected navigation |
| Pressed accent | --accent-pressed | #a12e22 | Primary action pressed/hover |
| Focus | --focus | #b63829 | Visible keyboard focus |

The palette is brand-specific, not hard-coded imitation of Apple system colors. Color does not mean mastery or outcome. Charts are labeled descriptive data, not a reward score. 60-30-10 is a hierarchy guide: neutral ground, elevated groups, narrow accent. No literal pixel quota.

## Type and layout
System font stack on Apple devices, Inter fallback elsewhere; no bundled San Francisco. 34px large title, 27/29px next topic, 22px section heading, 16px course row, 13/14px supporting UI, 11/12px compact metadata. 20px phone margin; primary move before summary. Neutral grouped course rows instead of colored decorative tiles. Course identity and actual coverage/attempt numbers stay together.

## Foundation decision
Vite 6 + React 19 + Tailwind 3.4 current stack. shadcn supports Vite but current scaffold favors Tailwind 4. Rather than migrate styling/build in a glimpse, use its underlying Radix unstyled primitive directly for Topic Select. Radix supplies keyboard/typeahead/focus/ARIA behavior; product styling and testing remain ours. React Aria is a viable alternative but would add another behavior model for no demonstrated need. Native button/link semantics remain native.

Current adoption: Radix Select only. No claim that all primitives have been migrated, or that library use proves accessibility. Keyboard opening, next choice, Enter, Escape and focus restoration tested. Future selected direction should extend the same foundation to dialogs and disclosure, preserving existing behaviors.

## Limits
Light appearance only. No native Dynamic Type guarantee; native accessibility text scaling remains unverified. No native haptics or native spring fidelity. Shared Study and secondary surfaces still old style. Real student usability untested. Library audit found 18 issues in existing toolchain/router dependencies; no new Radix advisory in the audit, but remediation is separate work and not silently fixed with a breaking upgrade.

## Sources
https://developer.apple.com/design/human-interface-guidelines/layout
https://developer.apple.com/design/human-interface-guidelines/typography
https://developer.apple.com/design/human-interface-guidelines/color
https://developer.apple.com/design/human-interface-guidelines/materials
https://developer.apple.com/design/human-interface-guidelines/motion
https://www.apple.com/health/
https://ui.shadcn.com/docs/installation/vite
https://ui.shadcn.com/docs/tailwind-v4
https://www.radix-ui.com/primitives/docs/components/select
https://www.radix-ui.com/primitives/docs/overview/accessibility
https://react-aria.adobe.com/getting-started

Performance caveat: Radix Select adds roughly 100KB minified / 33KB gzip to the existing eager JS bundle, which now totals ~1.45MB / 325KB gzip. For a shipped direction, split the picker or move simple choice back to native if interaction gains do not justify the cost. No claim of better load performance.

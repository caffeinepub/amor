# Specification

## Summary
**Goal:** Fix the Shop page filter Select runtime error and remove the Caffeine attribution from the site footer.

**Planned changes:**
- Update Shop page filter dropdowns (Category, Gold Type, Stone Type, Sort By) so no `<SelectItem />` uses an empty string (`value=""`), while still supporting a clear/default selection that resets the filter state to `null` and shows the placeholder.
- Remove the “Built with … caffeine.ai” / “designed by caffeine” attribution link and related UI from the footer while keeping existing AMOR footer content (copyright and current navigation/contact sections) and maintaining layout consistency.

**User-visible outcome:** The Shop page loads without the Select empty value error, filters can still be cleared to the placeholder state, and the footer no longer shows any Caffeine attribution or referral link.

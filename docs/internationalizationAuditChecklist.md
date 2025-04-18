## Internationalization Audit Checklist

Use this checklist to audit the codebase for compliance with our internationalization best practices. A thorough audit will help identify and fix any remaining inconsistencies.

### Translation Hook Usage

- [ ] Verify all components use `useTranslation` from `@/components/i18n/TranslationContext` exclusively
- [ ] Search for and replace any usage of `@/hooks/useTranslation`
- [ ] Check for components with hardcoded text that should be translated
- [ ] Ensure server components use the `withLocale` HOC for translations

```bash
# Terminal commands to help identify non-compliant files
# Find components using the deprecated hook
grep -r "from '@/hooks/useTranslation'" src/

# Find potential hardcoded text (customize based on your content)
grep -r --include="*.tsx" "h1\|h2\|h3\|button\|label" src/components/
```

### Links and URL Handling

- [ ] Ensure all internal links use `LocalizedLink` instead of Next.js `Link`
- [ ] Verify programmatic navigation includes language prefix
- [ ] Check `href` attributes in all components to ensure proper format
- [ ] Validate that all dynamic routes preserve language when navigating

```bash
# Find potential regular Link usage
grep -r "from 'next/link'" --include="*.tsx" src/
grep -r "<Link " --include="*.tsx" src/
```

### Language Detection

- [ ] Verify components extract language from URL path consistently
- [ ] Check for custom language detection logic that should be standardized
- [ ] Ensure the `PreferencesProvider` syncs with URL language
- [ ] Validate language switching updates both context and URL

### Translation Files

- [ ] Check for missing translation keys in all language files
- [ ] Verify all user-facing text has corresponding translations
- [ ] Ensure consistency in naming conventions for translation keys
- [ ] Check for empty or placeholder translations that need completing

```bash
# Find potential translation keys in one file but missing in others
# This requires custom scripting to compare JSON files
```

### Performance Checks

- [ ] Verify no components directly import translation dictionaries
- [ ] Check for unnecessary re-renders due to translation hook issues
- [ ] Ensure language changes are properly debounced
- [ ] Validate that client components receive translations through context only

### Testing Across Languages

- [ ] Test navigation flows in all supported languages
- [ ] Verify all UI elements maintain correct layout in each language
- [ ] Test language switching on different types of pages
- [ ] Check SEO metadata includes proper language attributes

### Component-Specific Checks

- [ ] **RecipeCard**: Verify correct handling of localized slugs/handles
- [ ] **Navigation menus**: Ensure they use `LocalizedLink` exclusively
- [ ] **Form components**: Check all labels and placeholders use translations
- [ ] **Layout components**: Verify breadcrumbs and structural elements respect language

### Cross-Browser and Accessibility Testing

- [ ] Test language switching in multiple browsers
- [ ] Verify screen readers announce content in correct language
- [ ] Check `lang` attribute is properly set on HTML elements
- [ ] Validate language-specific formatting (dates, numbers, etc.)

After completing this audit, document any findings and create tasks to address non-compliant code. Prioritize fixes based on their impact on user experience and maintenance complexity.

By following these guidelines, we ensure a consistent approach to internationalization across the entire application, making maintenance easier and preventing language-related bugs. 
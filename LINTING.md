# ESLint Setup Guide

This project now has comprehensive ESLint support to help maintain code quality and consistency.

## Available Scripts

- `npm run lint` - Run ESLint with Next.js optimizations
- `npm run lint:fix` - Auto-fix all fixable ESLint issues
- `npm run lint:strict` - Run ESLint directly (bypassing Next.js wrapper)
- `npm run lint:fix-all` - Auto-fix using direct ESLint (more comprehensive)
- `npm run lint:check` - Strict linting with zero warnings allowed (useful for CI/CD)

## What's Configured

### Rules Enabled:
- **Next.js Core Web Vitals** - Performance and accessibility rules
- **React Rules** - JSX and React-specific linting
- **Accessibility** - Basic a11y rules (relaxed for game development)
- **Code Quality** - Unused variables, console statements, etc.
- **Style** - Consistent quotes, semicolons, spacing

### Current Issues to Address:

1. **Import Issues**: Duplicate imports in `pages/index.js`
2. **Unused Variables**: Several unused imports and variables
3. **Console Statements**: Debug console.log statements throughout
4. **React Hooks**: Missing dependencies in useEffect hooks
5. **Accessibility**: Some heading and form label issues in UI components

## Quick Fixes

### Remove Console Statements
For production, consider removing or replacing console.log statements:
```js
// Instead of:
console.log('Debug info', data);

// Use:
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info', data);
}
```

### Fix React Hook Dependencies
ESLint will warn about missing dependencies in useEffect. Either:
- Add the missing dependency
- Add `// eslint-disable-next-line react-hooks/exhaustive-deps` to suppress

### Clean Up Unused Imports
Remove unused imports that ESLint identifies to keep your bundle size down.

## VS Code Integration

If using VS Code, the `.vscode/settings.json` file will:
- Enable ESLint error highlighting
- Auto-fix ESLint issues on save
- Format code automatically

## Customizing Rules

To adjust rules, edit `.eslintrc.json`. Common customizations:

```json
{
  "rules": {
    "no-console": "off",              // Allow console statements
    "react-hooks/exhaustive-deps": "off", // Disable dependency warnings
    "no-unused-vars": "off"           // Allow unused variables
  }
}
```

## CI/CD Integration

Use `npm run lint:check` in your CI pipeline to fail builds with linting errors. 
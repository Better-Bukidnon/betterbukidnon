# Contributing to BetterBukidnon.org

Thank you for your interest in contributing to BetterBukidnon.org! This civic-tech project thrives on community participation. Whether you're a developer, designer, translator, or a concerned citizen of Bukidnon, your contributions are welcome.

Start with the [documentation](docs/README.md). It explains how the site is put together,
how to update content and translations, and how it is deployed.

## Getting Started

### Prerequisites

- Node.js version supported by `package.json` and npm
- Git

### Setup

```bash
git clone https://github.com/Better-Bukidnon/betterbukidnon.git
cd betterbukidnon
npm install
npm run dev
```

Open the local URL printed by Next.js. See [docs/getting-started.md](docs/getting-started.md)
for checks, builds, and the static export workflow.

## How to Contribute

### Reporting Bugs

1. Check existing [issues](https://github.com/Better-Bukidnon/betterbukidnon/issues) to avoid duplicates
2. Create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and device information
   - Screenshots if applicable

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its benefit to users
3. Include mockups or examples if possible

### Submitting Code

Before starting a substantial contribution, check existing issues and pull requests to ensure the work is not already planned or in progress.

For major features, architectural changes, or migrations, coordinate with the maintainers before implementation. Small fixes, documentation improvements, and other straightforward contributions do not generally require prior approval.

1. **Fork** the repository
2. **Create** a feature branch from `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make** your changes
4. **Test** on multiple browsers (Chrome, Firefox, Safari, Edge)
5. **Commit** with a descriptive message
   ```bash
   git commit -m "Add: brief description of changes"
   ```
6. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open** a Pull Request against `develop`

### Commit Message Format

```
Type: Brief description

Types:
- Add: New feature or content
- Fix: Bug fix
- Update: Changes to existing feature
- Remove: Removed feature or content
- Docs: Documentation changes
- Style: CSS/formatting changes (no logic change)
- Refactor: Code restructuring
```

## Contribution Areas

| Area               | Description                           |
| ------------------ | ------------------------------------- |
| Bug Fixes          | Fix reported issues                   |
| Features           | Implement new functionality           |
| Content            | Update provincial service information |
| Translations       | Translate to Filipino or Cebuano      |
| Design             | Improve UI/UX and accessibility       |
| Data               | Verify and update statistics          |
| Documentation      | Improve guides and comments           |
| API Integration    | Connect real-time data sources        |
| Data Visualization | Enhance charts and graphs             |

## Code Guidelines

### HTML

- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Validate HTML before submitting

### CSS

- Follow existing naming conventions
- Use CSS custom properties (variables)
- Ensure responsive design
- Test on mobile devices

### JavaScript

- Build application routes in `src/app` with Next.js, React, and TypeScript
- Use the repository's npm commands; do not add a second package manager
- Use meaningful variable and function names
- Add comments for complex logic
- Avoid global variables

### Accessibility

- Maintain WCAG 2.1 compliance
- Include alt text for images
- Ensure keyboard navigation works
- Test with screen readers if possible

### Data Accuracy

- Only use data from official government sources
- Include source attribution
- Verify information before submitting
- Do not include unverified or speculative data
- Province-level facts live in [docs/bukidnon-facts.md](docs/bukidnon-facts.md). Update that file
  first, with a source, then the pages that show the fact

## Pull Request Process

1. Ensure your code follows the existing project structure and coding guidelines.
2. Keep changes focused and avoid unrelated modifications.
3. Update documentation if needed.
4. Test thoroughly before submitting.
5. Fill out the PR template completely, including a clear description of the changes and their purpose.
6. Link related issues or discussions, where applicable.
7. For significant architectural changes, reference the previously approved proposal or discussion.
8. Wait for maintainer review and address feedback as necessary.

**Note:** Submitting a pull request does not guarantee acceptance. Maintainers may request changes or decline contributions that conflict with the project's existing architecture, ongoing work, or agreed development direction.

## Review Criteria

Pull requests are reviewed for:

- Code quality and style consistency
- Functionality and bug-free operation
- Accessibility compliance
- Mobile responsiveness
- Data accuracy (for content changes)
- Security considerations
- Alignment with the project's architecture and roadmap
- Compatibility with ongoing development
- Scope and maintainability of the proposed changes

Maintainers make final decisions on whether a pull request is accepted, requires revisions, or is closed without merging.

Technical correctness alone does not guarantee acceptance, particularly when a contribution introduces significant architectural changes that have not been discussed or approved.

## Community

- **GitHub:** [issues and discussions](https://github.com/Better-Bukidnon/betterbukidnon/issues)
- **Email:** volunteer@betterbukidnon.org
- **BetterGov.ph:** the wider volunteer movement this project is part of, at [bettergov.ph](https://bettergov.ph)

## Recognition

All contributors are recognized in our repository. Significant contributions may be highlighted on the website.

## Questions?

Open an issue or email volunteer@betterbukidnon.org. We're happy to help.

---

Thank you for helping make government information accessible to the people of Bukidnon.

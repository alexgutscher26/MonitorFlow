# Contributing to MonitorFlow

We love your input! We want to make contributing to MonitorFlow as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Any Contributions You Make Will Be Under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report Bugs Using GitHub's [Issue Tracker](https://github.com/alexgutscher26/MonitorFlow/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/alexgutscher26/MonitorFlow/issues/new); it's that easy!

## Write Bug Reports With Detail, Background, and Sample Code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Set up your environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused
- Use proper TypeScript types instead of `any`

### TypeScript Style Guide

- Use interfaces for object types
- Use type annotations for function parameters and return types
- Avoid using `any` type
- Use enums for fixed sets of values
- Use readonly where applicable

### React/Next.js Guidelines

- Use functional components
- Implement proper error boundaries
- Use React hooks appropriately
- Keep components small and reusable
- Follow the Next.js App Router patterns

### Testing Guidelines

- Write unit tests for utilities and hooks
- Write integration tests for complex features
- Test error cases
- Mock external services appropriately

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable
2. Update the documentation with details of any changes to the API
3. The PR may be merged once you have the sign-off of at least one other developer
4. If you haven't been granted the ability to merge, request a reviewer to merge it for you

## Community

- Be welcoming to newcomers and encourage diverse new contributors from all backgrounds
- Be respectful of different viewpoints and experiences
- Gracefully accept constructive criticism

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

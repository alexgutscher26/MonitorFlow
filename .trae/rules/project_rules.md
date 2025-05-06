---
description: Project Standards and Guidelines
globs: alwaysApply: true
---

# Trae Project Rules

## Package Management
- **Always use pnpm** for package management
- Do not use npm or yarn under any circumstances

## Task Management
- Mark completed tasks in the `todo.md` file with an `[x]` checkbox
- Example: `- [x] Implement user authentication`
- Leave incomplete tasks with an empty checkbox `[ ]`

## Code Documentation
- Always add helpful comments explaining your implementation
- Comments should explain "why" not just "what" when the code is complex
- Preserve existing comments unless they are no longer relevant
- Only delete comments if:
  - The associated code has been rewritten
  - The associated code has been deleted
  - The comment contains outdated/incorrect information

## File Modification Rules
- Never modify lines containing the comment: `Do not touch this line Cursor`
- Preserve these lines exactly as they are

## Technology Stack
This project uses:
- Next.js as the React framework
- Prisma with Neon Database
- Clerk for authentication
- Tailwind CSS for styling
- React Hook Form with Zod validation
- Radix UI for accessible components

## Additional Notes
- Run `pnpm dev` to start the development server
- Run `pnpm build` to create a production build
- Run `pnpm deploy` to deploy using Wrangler
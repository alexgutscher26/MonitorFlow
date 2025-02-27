# PingPanda - A Modern Fullstack Event Monitoring SaaS

PingPanda is a powerful event monitoring solution built with modern technologies, designed to help you track and monitor your SaaS application events in real-time through Discord integration.

![Project Image](https://github.com/joschan21/pingpanda/blob/main/public/thumbnail.png)

## Features

- 🛠️ **Modern Tech Stack**: Built with Next.js App Router, Postgres, TypeScript & Tailwind
- 💻 **Beautiful Landing Page**: Professional and responsive design
- 🎨 **Custom Illustrations**: Unique artworks by professional illustrators
- ✉️ **Real-time Discord Integration**: Instant event notifications in your Discord server
- 🖥️ **Intuitive Dashboard**: Clean and user-friendly event monitoring interface
- 💳 **Stripe Integration**: Secure payment processing
- 🛍️ **Subscription Management**: Easy-to-use PRO plan purchasing system
- 🌟 **Modern UI Components**: Built on top of shadcn-ui
- 🔑 **Secure Authentication**: Powered by Clerk
- ⌨️ **Type Safety**: 100% written in TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or pnpm
- PostgreSQL database
- Discord account (for webhook integration)
- Stripe account (for payments)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/joschan21/pingpanda.git
cd pingpanda
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env` with your:
- Database URL
- Clerk API keys
- Discord bot token
- Stripe API keys

5. Run database migrations:
```bash
pnpm prisma migrate dev
```

6. Start the development server:
```bash
pnpm dev
```

## API Usage

Send events to PingPanda using our REST API:

```typescript
await fetch("http://your-domain.com/api/v1/events", {
  method: "POST",
  body: JSON.stringify({
    category: "sale",
    fields: {
      plan: "PRO",
      email: "user@example.com",
      amount: 49.00
    }
  }),
  headers: {
    Authorization: "Bearer <YOUR_API_KEY>"
  }
})
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

- **Stripe integration issues?** Verify you're using the correct API keys (test/live) and webhook endpoints
- **Database connection failed?** Check your database URL and ensure PostgreSQL is running

## Acknowledgements

- [Clerk](https://clerk.com) for authentication
- [Stripe](https://stripe.com) for payment processing
- [Discord](https://discord.com) for notifications
- [shadcn/ui](https://ui.shadcn.com) for UI components

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

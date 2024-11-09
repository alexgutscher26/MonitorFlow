# PingPanda - A Modern Fullstack Event Monitoring SaaS

<!-- ![Project Image](https://github.com/joschan21/pingpanda/blob/main/public/thumbnail.png) -->

PingPanda is a fully-featured, modern SaaS solution designed for event monitoring. Built with the Next.js App Router, Postgres, TypeScript, Tailwind CSS, and Clerk, PingPanda provides an intuitive dashboard, real-time notifications, and secure payments for your users. Whether you're a developer or a business owner, PingPanda makes event tracking seamless and efficient.

## Key Features

- 🛠️ Fully-Featured SaaS built with Next.js, offering a complete event monitoring solution.
- 💻 Custom Landing Page with a beautiful, high-conversion design.
- 🎨 Professionally Designed Artwork created by a talented illustrator to give your project a unique and polished look.
- ✉️ Real-Time Event Notifications sent directly to your Discord channel, keeping you informed instantly.
- 🖥️ Intuitive Event Dashboard for easy monitoring and management of events, all built with a user-friendly interface.
- 💳 Secure Payments integrated with Stripe for a smooth and safe user experience.
- 🛍️ PRO Plan Purchases allow customers to upgrade and access premium features.
- 🌟 Modern UI leveraging Shadcn UI for a clean and consistent design system.
- 🔑 Authentication with Clerk for secure user sign-ups, logins, and session management.
- ⌨️ 100% Written in TypeScript, ensuring type safety and better developer experience.
- 🎁 Additional Features coming soon! Keep an eye on updates.

## To-Do Features

Here are some planned features for PingPanda:

- [✅] Complete User Authentication System using Clerk (Sign-up, Login, Session Management).
- [✅] Basic Event Dashboard with a real-time feed of events.
- [✅] Discord Notifications for real-time updates.
- [✅] Stripe Integration for handling payments and PRO plan purchases.
- [✅] User Profiles for storing and managing user-specific event data.
- [ ] API for External Event Integrations (e.g., integrate with external services to send event data).
- [ ] Dark Mode for better user experience.
- [ ] Event Logs that allow users to review and manage historical event data.
- [ ] Customizable Event Alerts where users can set up personalized event triggers.
- [ ] User Roles (e.g., Admin, User, Guest) with permission-based access.
- [ ] Analytics Dashboard with graphs and stats for event trends.
- [ ] Multi-language Support to reach a global audience.
- [ ] Add a search functionality to quickly find categories or specific events
- [ ] Add support for customizable event categories.
- [ ] Add support for customizable event tags.
- [ ] Add support for customizable event fields (e.g., location, date/time).
- [ ] Add support for customizable event forms (e.g., contact form).
- [ ] Add support for customizable event integrations (e.g., Google Calendar).
- [ ] Implement a notifications system for important alerts (e.g., high event volumes, errors).
- [ ] Add a bell icon in the header for quick access to notifications.
- [ ] Create a page showcasing different integrations (e.g., Slack, Email, Webhooks).
- [ ] Provide easy setup guides for each integration.
- [ ] Include options for custom date ranges and comparisons.
- [ ] Add the ability to add notes or tags to events for better organization.
- [ ] Implement a page for managing API keys, including creation, rotation, and revocation.
- [ ] Add an in-app feedback mechanism for users to report issues or suggest features Add features for inviting team members and managing roles/permissions.
- [ ] Implement shared dashboards and reports, Allow users to customize dashboard layouts.
- [ ] Implement custom color themes for better brand alignment.
- [ ] Add functionality to export data in various formats (CSV, PDF).
- [ ] Create a scheduled reporting feature for automated insights.
- [ ] Develop an interactive onboarding process for new users.
- [ ] Include tooltips and guided tours for key features.
- [ ] Create a public-facing status page that users can share with their customers.
- [ ] Implement basic uptime monitoring features to complement event tracking.
- [ ] Develop a comprehensive documentation section within the app.
- [ ] Include a searchable FAQ and troubleshooting guide.
- [ ] Add an in-app feedback mechanism for users to report issues or suggest features.
- [ ] Add date range filters and Add basic sorting and filtering.
- [ ] Email notifications (using services like SendGrid/Resend).
- [ ] Slack integration (well-documented API).
- [ ] SMS alerts via Twilio.
- [ ] Microsoft Teams (similar to Discord implementation).
- [ ] Webhooks (for integrating with third party services).
- [ ] Add i18n support with next-intl.
- [ ] Add Time zone selection, add ability to set custom timezone, add Currency display options, Language switcher.
- [ ] Simple comment system.
- [ ] Activity logs.
- [ ] Feature flags based on plan.
- [ ] Basic white-labeling.
- [ ] Simple CLI tool.


## Project Overview

PingPanda is designed for developers and businesses who want to monitor events in real time and engage with their users effectively. With features like a real-time dashboard, Discord notifications, and seamless Stripe payments, PingPanda provides a complete solution for event tracking and user management.

This project is ideal for SaaS applications, web-based dashboards, or any service that requires real-time event monitoring.

## Getting Started

To get started with PingPanda, follow the steps below:

Clone the Repository
First, clone this repository to your local machine using the command:

```
git clone https://github.com/joschan21/pingpanda.git
```

## Set Up Environment Variables

Copy the .env.example file to .env and configure the necessary variables. You'll need to fill in values for things like database credentials, Clerk API keys, and Stripe API keys.

```
cp .env.example .env
```

## Install Dependencies

Run the following command to install the necessary dependencies:

```
npm install
```

## Run the Development Server

Start the application in development mode:

```
npm run dev
```

## Enjoy!

You should now have a fully functional instance of PingPanda running locally.

## Technologies Used

- Next.js - Full-stack framework for building the app with modern React.
- PostgreSQL - A robust, scalable database for managing events and user data.
- Tailwind CSS - Utility-first CSS framework for building responsive, modern designs.
- Clerk - Provides authentication, including sign-up, sign-in, and session management.
- Stripe - Secure payment processing for upgrading to the PRO plan.
- Shadcn UI - Component library for building a consistent and beautiful UI.
- TypeScript - A statically typed superset of JavaScript for better development experience.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please fork the repository, create a new branch, and submit a pull request.

Before contributing, please make sure your code adheres to the following guidelines:

Write clean, readable code with proper indentation.
Ensure all code is type-safe and written in TypeScript.
Add unit tests for any new features or bug fixes.
Ensure the app is fully functional by running npm run dev.

## Issues

If you find any bugs or have feature requests, please open an issue in the GitHub repository.

## Acknowledgements

- Clerk: For providing an excellent authentication solution.
- Shadcn UI: For the UI components that power PingPanda’s sleek and modern design.
- Stripe: For secure and easy payment processing.
- Tailwind CSS: For the utility-first CSS framework.
- Next.js: For being the powerful framework that makes this project possible.

## License

[MIT](https://choosealicense.com/licenses/mit/)

[![CodeFactor](https://www.codefactor.io/repository/github/alexgutscher26/pingpanda/badge)](https://www.codefactor.io/repository/github/alexgutscher26/pingpanda)

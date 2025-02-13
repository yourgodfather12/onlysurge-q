# OnlySurge

OnlySurge is a Content Creator Platform that aims to be the ultimate solution for content creators to manage and grow their business. Built with modern web technologies such as React, Vite, and TailwindCSS, OnlySurge integrates with popular services like Stripe, Supabase, and OpenAI to deliver a seamless and efficient experience.

## Features

- **Content Management:** Efficient tools to manage and organize your creative work.
- **Payment Integration:** Seamlessly integrated with Stripe for secure transactions.
- **Real-time Database & Authentication:** Powered by Supabase for robust backend support.
- **Modern UI/UX:** Built with React, TailwindCSS, and Framer Motion for an engaging experience.
- **Utilities & Enhancements:** Utilizes technologies like React Query, SWR, and Zod for optimal performance and validation.
- **Robust Testing:** End-to-end tests with Playwright and unit tests with Vitest ensure quality and reliability.

## Tech Stack

- **Frontend:** React, Vite
- **Styling:** TailwindCSS, PostCSS, Inter Font
- **State Management & Data Fetching:** React Query, SWR
- **API & Integrations:** Stripe, Supabase, OpenAI
- **Utilities:** date-fns, uuid
- **Animations:** Framer Motion
- **Testing & Linting:** Vitest, Playwright, ESLint

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```sh
   git clone [REPOSITORY_URL]
   ```
2. Navigate to the project directory:
   ```sh
   cd onlysurge
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn
   ```

### Running the Development Server

Start the development server with:

```sh
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser. The page will automatically reload when you make changes to the code.

### Building for Production

To build the project for production:

```sh
npm run build
```

You can preview the production build locally with:

```sh
npm run preview
```

### Linting and Testing

- Lint the code:
  ```sh
  npm run lint
  ```
- Run unit tests:
  ```sh
  npm run test
  ```
- Run UI tests:
  ```sh
  npm run test:ui
  ```
- Generate and review test coverage:
  ```sh
  npm run test:coverage
  ```
- Run end-to-end tests:
  ```sh
  npm run test:e2e
  ```

## Environment Variables

This project uses environment variables for configuration. A template is provided in the `.env.example` file. Create a `.env` file in the project root and define the necessary variables based on your local setup.

## Contributing

Contributions are welcome! Please open issues and submit pull requests for new features, bug fixes, or improvements.

## License

[Specify your license here]

## Acknowledgments

- Special thanks to the open-source community for tools and libraries such as Vite, React, and TailwindCSS.
- Inspired by the needs of content creators to have a unified platform to manage their creative work. 
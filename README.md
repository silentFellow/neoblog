# Neoblog

Neoblog is a simple yet powerful application for creating blogs. It is built using Next.js and includes features such as authentication, pre-built components, and rich text editing.

## Features

- **Next.js**: A React framework for building server-side rendered applications.
- **Next-Auth**: Authentication for users to perform CRUD operations.
- **Shadcn**: Pre-built components for faster development.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **PostgreSQL**: Database for storing user credentials.
- **Drizzle ORM**: ORM for interacting with the PostgreSQL database.
- **Plate.js**: Rich text editor for simple users.
- **Markdown**: Fine-grained control for advanced users.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/neoblog.git
   cd neoblog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL=your_postgresql_database_url
   NEXTAUTH_URL=your_nextauth_url
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run database migrations:
   ```bash
   npx drizzle-kit migrate
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Users need to log in with Next-Auth to perform any CRUD operations.
- Simple users can use the Plate.js rich text editor.
- Advanced users can use Markdown for fine-grained control.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

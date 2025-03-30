# School Management System

A comprehensive school management system built with Next.js, Prisma, and TypeScript. This system helps schools manage their students, teachers, classes, attendance, marksheets, and certificates efficiently.

## Features

- **User Management**
  - Role-based authentication (Admin, Teacher, Student)
  - User profiles and permissions

- **Student Management**
  - Student registration and profiles
  - Roll number assignment
  - Class and section allocation
  - Academic history

- **Teacher Management**
  - Teacher profiles
  - Subject assignment
  - Class allocation
  - Teaching schedule

- **Class Management**
  - Class creation and organization
  - Section management
  - Subject assignment
  - Student enrollment

- **Attendance Management**
  - Daily attendance tracking
  - Attendance reports
  - Multiple status options (Present, Absent, Late, Excused)

- **Academic Records**
  - Marksheet generation
  - Exam results management
  - Progress tracking
  - Performance analytics

- **Certificate Management**
  - Multiple certificate types
  - Certificate generation
  - Digital certificate storage
  - Certificate verification

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Tremor (UI Components)
  - DaisyUI

- **Backend**
  - Next.js API Routes
  - Prisma (ORM)
  - PostgreSQL
  - NextAuth.js (Authentication)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/school-management-system.git
   cd school-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database connection string and other configurations.

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
school-management-system/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility functions
├── prisma/              # Prisma schema and migrations
└── public/              # Static files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

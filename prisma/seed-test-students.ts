import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const students = [
  {
    name: "Test Student 1",
    email: "teststudent1@test.com",
    clerkId: "test_student_1",
    major: "Computer Science",
    yearInSchool: "Freshman",
  },
  {
    name: "Test Student 2",
    email: "teststudent2@test.com",
    clerkId: "test_student_2",
    major: "Computer Science",
    yearInSchool: "Sophomore",
  },
  {
    name: "Test Student 3",
    email: "teststudent3@test.com",
    clerkId: "test_student_3",
    major: "Computer Science",
    yearInSchool: "Junior",
  },
  {
    name: "Test Student 4",
    email: "teststudent4@test.com",
    clerkId: "test_student_4",
    major: "Nursing",
    yearInSchool: "Sophomore",
  },
  {
    name: "Test Student 5",
    email: "teststudent5@test.com",
    clerkId: "test_student_5",
    major: "Nursing",
    yearInSchool: "Senior",
  },
];

async function main() {
  for (const s of students) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        clerkId: s.clerkId,
        email: s.email,
        name: s.name,
        role: "STUDENT",
        studentProfile: {
          create: {
            major: s.major,
            yearInSchool: s.yearInSchool,
          },
        },
      },
    });
    console.log(`Created: ${user.name} (${s.major} - ${s.yearInSchool})`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

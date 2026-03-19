import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL =
  "postgresql://postgres.oezqkesqqeckqrasnmnq:b7jIjOiUAYEElSnS@aws-1-us-east-2.pooler.supabase.com:6543/postgres";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Existing IDs
const COURSE_ID = "cmmwtn5yu000072jpgl5rbcic";

const MODULE_1_ID = "cmmwtn6gc000172jpmlwpt6uw"; // Welcome to One Refugee
const MODULE_2_ID = "cmmwtn6n9000572jp5ixsned3"; // Program Expectations
const MODULE_3_ID = "cmmwtn70r000e72jpjwsgzk0a"; // Communication Skills
const MODULE_4_ID = "cmmwtn78c000j72jpgxmy7jni"; // Map to a Career
const MODULE_5_ID = "cmmwtn7kn000r72jpj0ailfzg"; // Next Steps

// Existing lesson IDs that need content updates
const LESSON_WELCOME_ID         = "cmmwtn6i4000272jpkrq2kav5"; // Welcome & What to Expect
const LESSON_TUITION_ID         = "cmmwtn6lg000472jpw3c3ufvp"; // Tuition Assistance
const LESSON_CAREER_ASSESS_ID   = "cmmwtn7m3000s72jpkgjvg1bg"; // Career Assessment
const LESSON_ONBOARDING_ID      = "cmmwtn7nl000t72jpssia57n6"; // Summer Onboarding Checklist
const LESSON_MONTHLY_MEETING_ID = "cmmwtn6q3000772jp2xo8xtzp"; // Monthly Meetings

// Canva embed URLs (view?embed format for iframe embedding)
const CANVA_ONLINE_ORIENTATION_EMBED = "https://www.canva.com/design/DAGe6rsRYjs/view?embed";
const CANVA_2026_ORIENTATION_EMBED   = "https://www.canva.com/design/DAGzJ0kgtPs/view?embed";

async function main() {
  console.log("Updating One Refugee Orientation course with full Canva content...\n");

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 1 UPDATES
  // ─────────────────────────────────────────────────────────────────────────────

  // 1a. Embed the Online Orientation slideshow in "Welcome & What to Expect"
  await prisma.lesson.update({
    where: { id: LESSON_WELCOME_ID },
    data: {
      videoUrl: CANVA_ONLINE_ORIENTATION_EMBED,
    },
  });
  console.log("✓ Added Online Orientation embed to 'Welcome & What to Expect'");

  // 1b. Update Tuition lesson to include textbook stipend (missing from original)
  await prisma.lesson.update({
    where: { id: LESSON_TUITION_ID },
    data: {
      content: `# Tuition Assistance & Financial Support

Understanding how 1R financial support works will help you plan your finances and make the most of your scholarship.

## How 1R Tuition Assistance Works

### 1R Is a "Last-In" Scholarship
This means 1R applies its contribution **after** your Pell Grant and other scholarships have been applied to your tuition bill. 1R fills the gap.

### Maximum Award
Students in good standing are eligible for **up to $2,500 in tuition assistance per semester** (fall and spring only).

### It's Individualized
Since every student receives different grants and scholarships, your 1R tuition assistance will be calculated based on your individual situation.

## Understanding Your Pell Grant

A **Pell Grant** is a federal grant that helps students with demonstrated financial need pay for college.
- You apply through the **FAFSA** (Free Application for Federal Student Aid) at [studentaid.gov](https://studentaid.gov)
- The amount depends on your Expected Family Contribution (EFC), cost of attendance, and enrollment status
- **Pell Grants do NOT have to be paid back** (unlike loans)

## Examples of How It Works

| Student | Tuition | Pell Grant | Other Scholarships | What 1R Covers |
|---|---|---|---|---|
| Lili | $3,200 | $3,600 (full) | $0 | $0 (Pell covers it all) |
| Isaac | $3,200 | $0 | $0 | Up to $2,500 |
| Asthma | $3,200 | $1,000 (partial) | $2,000 | Up to $200 remaining |

## Important Limitations

**No Summer Tuition:** 1R does not provide tuition assistance during summer semester — unless you are within one year of graduating.

**Non-Transferable:** 1R funds are used **only for tuition**. Parking, childcare, and housing are not covered. However, your Education Manager can help you find resources for those needs.

**Financial Responsibility:** Do not enroll in classes if you don't know how you will pay your tuition. 1R will not pay unpaid tuition from previous semesters.

## Other Financial Support

### Books & Required Materials
1R pays for **required textbooks and course materials** every semester. The textbook stipend does not cover general supplies like binders or notebooks — only required academic materials.

### Unpaid Internship Stipend
If your internship is unpaid, 1R will pay you an **internship stipend of $15/hour**. You don't have to turn down valuable experience because you can't afford to work for free.

### Laptops
1R scholars are eligible for **one laptop** (up to $650 value) after attending their first Annual Conference.

## Tips for Maximizing Your Financial Aid

1. Complete your FAFSA as early as possible — many scholarships are first-come, first-served
2. Apply for your college's general scholarship application — most schools have funds available
3. Look for school-specific scholarships (see the Scholarship Resources lesson for details by school)
4. Ask your Education Manager about any additional resources available to you`,
    },
  });
  console.log("✓ Updated Tuition lesson with textbook stipend and FAFSA tips");

  // 1c. Add new "Scholarship Resources by School" lesson to Module 1
  await prisma.lesson.create({
    data: {
      moduleId: MODULE_1_ID,
      title: "Scholarship Resources by School",
      order: 4,
      type: "READING",
      content: `# Scholarship Resources by School

In addition to 1R support and your Pell Grant, most Utah colleges and universities offer additional scholarships. Applying early is critical — many scholarships are first-come, first-served.

## State-Wide Scholarships (Available at Most Utah Schools)

### Utah Promise Grant
Covers tuition and fees for up to two years for students who qualify for a Pell Grant.
- Apply to your college and complete your FAFSA as soon as possible
- Deadlines vary by school — check with your school's financial aid office
- [Learn more](https://ushe.edu/utah-promise-grant/)

### TH Bell Education Scholarship
Full tuition scholarship for students pursuing a teaching career.
- Must declare a major that leads to teaching and commit to teaching in Utah after graduation
- Deadlines vary by institution
- [Learn more](https://ushe.edu/t-h-bell-education-scholarship/)

### Talent Development Award
Full tuition scholarship for Computer Science and Information Systems students.
- Must declare a CS or IT major and commit to working in Utah after graduation
- [Learn more](https://ushe.edu/talent-development-award-program/)

---

## Scholarships by School

### Utah State University (USU)
**Apply by December 1st for maximum scholarship opportunities.**

- **Merit-Based Scholarships** — Automatically considered when you apply by Dec 1 (based on GPA and test scores). No test score? Request a [scholarship review form](https://www.usu.edu/admissions/costs-and-aid/#scholarships) by Jan 10.
- **Aggie Advantage Grant** — $1,000 ($500 per semester) for first-time students. Complete FAFSA by Feb 1, enroll in fall courses by May 1. Can be used for any educational expense.
- **Utah Promise at USU** — Covers tuition and fees for up to two years for Pell-eligible students. Apply by Feb 1.
- **Emergency Hardship Fund** — If you're in a bind for medical, food, or other expenses, [apply here](https://www.usu.edu/student-affairs/emergency-hardship-fund).

---

### University of Utah (UofU)
**Apply by December 1st for maximum scholarship opportunities.**

- **Merit-Based Scholarships** — 7 different scholarships, $5,000–$6,000 each. Automatically considered if applied by Dec 1 with FAFSA by March 1.
- **For Utah Scholarship** — Merit and need-based, covering full tuition for 8 semesters for Pell-eligible students. Apply by Dec 1, FAFSA by March 1.
- **ARUP Promise** — Covers tuition and fees for up to two years for Pell-eligible students. Apply by Dec 1, FAFSA by Feb 1.
- **Transfer Utah Merit Scholarship** — Up to $5,000/year for transfer students. FAFSA by Feb 1.
- **Opportunity Scholars** *(Business majors only)* — All first-generation business students are encouraged to apply. Funding varies by need. [Learn more](https://eccles.utah.edu/programs/undergraduate/opportunity-scholars/)

---

### Salt Lake Community College (SLCC)
**Apply by March 6th for maximum scholarship opportunities.**

- **Call to Action Scholarship** — Full tuition scholarship for graduating Utah/Idaho high school seniors with 3.0+ GPA. Deadline: May 6. [Apply here](https://www.slcc.edu/scholarships/call-to-action-scholarship.aspx)
- **SelectHealth Scholarship** — $2,500/semester for healthcare students from the SLC area. [Details](https://www.slcc.edu/scholarships/select-health-scholarship.aspx)
- **SLCC Promise** — Covers tuition and fees for Pell-eligible students. Apply by May 6, submit FAFSA for automatic consideration.
- **Talent Development Award** — Full tuition for CS or Information Systems students. Complete FAFSA by SLCC registration deadline and declare your major. Apply on [ScholarshipUniverse](https://www.slcc.edu/scholarships/state-sponsored-grants-scholarships.aspx).

---

### Weber State University (WSU)
**Apply by December 1st for maximum scholarship opportunities.**

- **Academic Scholarships** — Up to full tuition. Automatically considered if applied by Dec 1. [Details](https://www.weber.edu/financialaid/default.html)
- **Academic Distinction Scholarship** — $2,500/year for transfer students with 2.75+ GPA. First-come, first-served. Apply by Dec 1.
- **Housing Resident Discount** — $500/semester for freshman students in on-campus housing enrolled in 12+ credits.
- **TH Bell Scholarship** — Full tuition for education-track students. Apply by March 1.

---

### Utah Valley University (UVU)
**Apply by March 1st for maximum scholarship opportunities.**

- **Academic Scholarships** — Up to full tuition, automatically considered by March 1 (based on GPA and standardized tests). [Details](https://www.uvu.edu/financialaid/scholarships/freshman.html)
- **Dean's Merit Scholarship** — Major-specific scholarship based on high school GPA. Apply by March 1.
- **UVU Greenlight / Utah Promise** — Full tuition for Pell-eligible students. Complete application and FAFSA by March 1.
- **Honors Program** — $500–$1,500/semester plus 50% housing discount. No GPA/test score required — just apply on ScholarshipUniverse and write two short essays.

---

## Key Tips

1. **Apply early** — Most scholarship deadlines are between December 1 and March 1
2. **Complete your FAFSA first** — Many scholarships require FAFSA before they consider you
3. **Use ScholarshipUniverse** — Many schools use this platform for scholarship applications
4. **Talk to your Education Manager** — They can help you identify and apply for scholarships specific to your situation`,
    },
  });
  console.log("✓ Added 'Scholarship Resources by School' lesson to Module 1");

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 2 UPDATES
  // ─────────────────────────────────────────────────────────────────────────────

  // 2a. Update Monthly Meetings lesson to include scheduling and virtual meeting tips
  await prisma.lesson.update({
    where: { id: LESSON_MONTHLY_MEETING_ID },
    data: {
      content: `# Expectation #1: Monthly Meetings

## Meet with Your Education Manager Every Month

Your Education Manager is your most important resource at One Refugee. Monthly meetings are where the real coaching happens.

## What Happens in Monthly Meetings?

Your Education Manager will:
- Check in on your classes and academic progress
- Help you plan for upcoming semesters
- Coach you on career exploration and professional development
- Connect you with resources for any challenges you're facing
- Review your documents and upcoming deadlines

## How to Schedule Your Meeting (Calendly)

1R uses **Calendly** to schedule all meetings. When you receive your scheduling email:

1. **Click the Calendly link** in the email
2. **Browse available dates and times** — pick one that works for you
3. **Enter your name and email** when prompted
4. **Confirm your registration** — click "Yes" to confirm
5. **Accept the calendar invitation** that is emailed to you

A reminder email will appear in your inbox the day before your meeting.

> **Important:** If you need to reschedule, use the link in the confirmation email and reschedule **at least 24 hours before the meeting** so that other students can use that time.

## Virtual Meeting Etiquette (Google Meet)

Most monthly meetings happen over **Google Meet**. Follow these guidelines:

- **Find a quiet place** where you won't be interrupted
- **Plan for 30 minutes** for the meeting
- **Use your laptop** if possible (not your phone)
- **Turn on your camera** — being seen shows engagement and respect
- **Look professional** — dress and appear as you would for a job interview
- **Avoid walking or driving** during the meeting
- **Be on time** — join a minute or two early
- **If you can't attend:** Cancel the meeting as soon as possible so your Education Manager can offer that time to another student

## Penalties for Missing Meetings

| Missed Meetings | Consequence |
|---|---|
| 1 missed meeting | Needs Improvement status |
| 2 missed meetings in a semester | No Financial Support next semester |
| More than 2 missed meetings | Exit from the program |

> **Remember:** Your Education Manager has fewer students than your campus advisor and makes time specifically for you. Respect that time just as you would a job interview or class exam.`,
    },
  });
  console.log("✓ Updated Monthly Meetings lesson with Calendly + Google Meet instructions");

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 4 UPDATES
  // ─────────────────────────────────────────────────────────────────────────────

  // 4a. Add "Watch: Map to a Career Presentation" as lesson 1 in Module 4
  // Shift existing lessons' order up by 1 first
  const module4Lessons = await prisma.lesson.findMany({
    where: { moduleId: MODULE_4_ID },
    orderBy: { order: "asc" },
  });
  for (const lesson of module4Lessons) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: { order: lesson.order + 1 },
    });
  }

  await prisma.lesson.create({
    data: {
      moduleId: MODULE_4_ID,
      title: "Watch: Orientation Career Presentation",
      order: 1,
      type: "VIDEO",
      videoUrl: CANVA_2026_ORIENTATION_EMBED,
      content: `# Orientation: Map to a Career

The slides below are from the 2026 One Refugee in-person orientation. They cover the career planning section in depth — including the Job vs. Career distinction, the Ruya and Tantine case study, how to choose a major, how to research careers, and your graduation timeline.

**How to use this presentation:**
- Use the arrows at the bottom of the slides to navigate forward and backward
- The career section begins partway through — feel free to scroll through the full deck
- The reading lessons that follow this one cover each topic in more detail

After viewing, continue through the lessons in this module for a deeper breakdown of each concept.`,
    },
  });
  console.log("✓ Added '2026 Orientation Presentation' embed to Module 4 (Map to a Career)");

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 5 UPDATES
  // ─────────────────────────────────────────────────────────────────────────────

  // 5a. Update Career Assessment lesson with full step-by-step Canva content
  await prisma.lesson.update({
    where: { id: LESSON_CAREER_ASSESS_ID },
    data: {
      content: `# Career Assessment: Discover Your Career Matches

## Why Take a Career Assessment?

A career assessment helps you discover careers that match your interests, personality, and strengths. It's a starting point — not a final answer — but it can open your eyes to options you hadn't considered.

## Your Assignment: Career Explorer

One Refugee uses **Career Explorer** as its recommended career assessment tool. You must complete this **before your in-person orientation**.

### Step-by-Step Instructions

1. **Go to** [careerexplorer.com](https://www.careerexplorer.com)
2. **Click "Take the free test"** to begin
3. **Work through the assessment** — it takes about 20–30 minutes
4. **Before you finish:** click **"Save your progress"** — this creates your account so you don't lose your results
5. **Enter your email** when prompted
6. **Complete the assessment** and view your results
7. **Click "Share"** on your results page
8. **Click "Copy Link"**
9. **Paste your results link** into the required form (link sent to you by your Education Manager)

> **Important:** Save your progress before finishing — if you close the tab without saving, you'll lose everything.

## What Your Results Show

Career Explorer gives you:
- Your **top career matches** ranked by fit
- **Salary, education, and outlook** information for each career
- Your **personality and interest profile** — understanding why certain careers match you

## Discuss Your Results

Bring your results to your in-person orientation to share with other students. Talk to your Education Manager about your top matches at your first monthly meeting.

---

## Additional Career Exploration Resources

Use these tools to explore beyond Career Explorer:

| Resource | What It Offers | Link |
|---|---|---|
| **Career One Stop** | Hundreds of career videos with salary, education, and job outlook | [careeronestop.org](https://www.careeronestop.org/Videos/CareerVideos/career-videos.aspx) |
| **O*NET OnLine** | Detailed information on thousands of occupations and required skills | [onetonline.org](https://www.onetonline.org) |
| **What Can I Do With This Major?** | Connect majors to real career paths | [whatcanidowiththismajor.com](https://whatcanidowiththismajor.com) |
| **LinkedIn** | Research professionals in careers you're interested in | [linkedin.com](https://www.linkedin.com) |

---

## Explore Majors at Your School

Look at the list of majors offered at your college or university. Which ones sound interesting? What careers do they lead to?

- [SLCC Programs](https://www.slcc.edu/academics/programs/index.aspx)
- [University of Utah Majors](https://advising.utah.edu/majors/quick-look/index.php)
- [Utah State, UVU, Weber, BYU, MTECH](https://www.usu.edu) — search your school's academic programs page

---

## Informational Interviews

One of the best ways to explore a career is to talk to someone who actually does it.

An **informational interview** is a casual conversation where you ask someone about their career — not to get a job, but to learn. You can reach out to:
- Family or friends with interesting careers
- People you find on LinkedIn
- Professors in your major

[Download the Informational Interview Guide](https://brightspotcdn.byu.edu/54/b6/2554ebb842fab54640a15ff0afb3/informational-interview.pdf) for tips on how to set one up and what questions to ask.`,
    },
  });
  console.log("✓ Updated Career Assessment lesson with full step-by-step instructions and resource links");

  // 5b. Update Summer Onboarding Checklist with corrected timeline from Canva
  await prisma.lesson.update({
    where: { id: LESSON_ONBOARDING_ID },
    data: {
      content: `# Summer Onboarding: Your Complete Checklist

## Your 1R Onboarding Timeline

| Step | When | What to Do |
|---|---|---|
| **1** | Now (Online) | Complete Online Orientation & submit Career Assessment form |
| **2** | April–May | Attend In-Person Orientation |
| **3** | June | First monthly meeting with your Education Manager |
| **4** | July | Second monthly meeting with your Education Manager |
| **5** | August | Submit required documents & attend the Annual Conference |

## Step 1: Complete This Online Orientation ✓
You're almost done! Finish all lessons and mark them complete.

## Step 2: Submit Your Career Assessment
After completing the Career Explorer assessment, submit your results link using the form your Education Manager sent you. Do this **before your in-person orientation**.

## Step 3: Attend In-Person Orientation

In-person orientation dates (check your email for exact location):
- **Utah:** May (check email for date)
- **Idaho:** May (check email for date)
- **Arizona:** April (check email for date)

This is a **required event**. Plan ahead — arrange your work schedule and transportation in advance.

## Step 4 & 5: Summer Monthly Meetings

As a new scholar, you must meet with your Education Manager **at least twice during the summer** (June and July) before August.

When you receive the scheduling email from your Education Manager:
1. Open it immediately
2. Click the Calendly scheduling link
3. Book your appointment
4. Add it to your calendar

> Missing two summer meetings means you will not receive financial support for the fall semester.

## Step 6: Submit August Documents & Attend the Annual Conference

In August, you'll need to:
- Submit your Fall Schedule, Tuition Statement, and Financial Aid documents
- Attend the Annual Conference (a full-day required event)

After completing the Annual Conference, you'll be eligible for your **1R laptop** (up to $650).

---

## Work with Your Education Manager On:

Your Education Manager will walk you through your full onboarding checklist, which includes:
- Enrolling in fall classes
- Setting up your FAFSA for the upcoming year
- Understanding your tuition statement
- Planning your first semester schedule
- Connecting with your campus academic advisor

> **Just show up and engage.** The more you participate in One Refugee, the better your experience will be. Every step of onboarding builds your foundation for success.`,
    },
  });
  console.log("✓ Updated Summer Onboarding Checklist with accurate timeline from Canva");

  // ─────────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n✅ All updates complete!");
  console.log("\nChanges made:");
  console.log("  Module 1 — 'Welcome & What to Expect': Online Orientation slides embedded");
  console.log("  Module 1 — 'Tuition Assistance': Added textbook stipend + FAFSA tips");
  console.log("  Module 1 — NEW: 'Scholarship Resources by School' lesson added");
  console.log("  Module 2 — 'Monthly Meetings': Added Calendly + Google Meet instructions");
  console.log("  Module 4 — NEW: '2026 Orientation Presentation' embed added as lesson 1");
  console.log("  Module 5 — 'Career Assessment': Full step-by-step instructions + all resource links");
  console.log("  Module 5 — 'Summer Onboarding Checklist': Updated with accurate Canva timeline");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

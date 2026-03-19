import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL =
  "postgresql://postgres.oezqkesqqeckqrasnmnq:b7jIjOiUAYEElSnS@aws-1-us-east-2.pooler.supabase.com:6543/postgres";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const modules = [
  {
    title: "Welcome to One Refugee",
    description:
      "Learn about the One Refugee program, who we are, and what we offer to support your college journey.",
    order: 1,
    lessons: [
      {
        title: "Welcome & What to Expect",
        order: 1,
        content: `# Welcome to One Refugee!

We are so glad you have chosen to join us. The One Refugee program is here to support you throughout your college journey — and this orientation is your first step.

## What Is One Refugee?

One Refugee (1R) is a scholarship and coaching program designed specifically for refugee and immigrant students pursuing higher education in the United States. We believe in your potential, and we're here to help you build the career and life you've worked so hard for.

## What to Expect in This Orientation

This orientation will walk you through everything you need to know to get started:

1. **Program Benefits** — What 1R provides for you
2. **Program Expectations** — What we ask of you in return
3. **Communication Skills** — How to communicate professionally
4. **Map to a Career** — How to use college to build a career, not just earn a degree
5. **Next Steps** — What to do after you finish this orientation

## Our #1 Tip for Success

> **Check your email regularly.** Almost everything in this program — meeting invitations, deadlines, opportunities, and announcements — comes by email. Students who check their email daily and respond quickly are the most successful in 1R.

## Professionalism Starts Now

We invite you to practice professionalism from day one. Why does it matter?

- It reduces distractions and helps you focus
- It shows respect for the people investing in you
- It helps you build habits that will serve you throughout your career

Welcome to the 1R community!`,
      },
      {
        title: "1R Is More Than a Scholarship",
        order: 2,
        content: `# 1R Is More Than a Scholarship

Many students hear "One Refugee" and think of financial support — but the program is much more than that. Here's what 1R provides:

## The Four Pillars of 1R Support

### 1. Academic & Career Coaching
Your **Education Manager** is a dedicated coach who will meet with you one-on-one every month. They will help you:
- Navigate college coursework and choose the right classes
- Create a degree completion plan
- Prepare for internships and professional experiences
- Work through challenges before they become problems

**The difference between your 1R Education Manager and your campus academic advisor:**

| Your Campus Advisor | Your 1R Education Manager |
|---|---|
| Expert in your major or first-year students | Supports you across education, career, and finances |
| Office on campus | Meets with you monthly (online or in person) |
| Helps with class registration & degree plan | Helps you succeed in all areas of student life |

You should meet with both — they complement each other.

### 2. Professional Experiences
1R prepares you for a career, not just a degree. Throughout your time in the program, you'll have access to:
- Career workshops at the Annual Conference
- Professional events (career panels, site visits, career trips)
- Coaching on resumes, LinkedIn, and interview skills
- Internship support and stipends for unpaid internships

### 3. Financial Support
1R provides tuition assistance and other financial resources to make college possible (more details in the next lesson).

### 4. Community & Belonging
You are joining a community of scholars, staff, and mentors who are rooting for you. You'll connect with students at your school and across multiple states, attend events together, and build a network that will last long after graduation.

## This Program Exists Because People Care About You

One Refugee is funded by generous donors and foundations who believe in your potential. Every dollar of support you receive comes from people who want to see you succeed.`,
      },
      {
        title: "Tuition Assistance & Financial Support",
        order: 3,
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
- You apply through the **FAFSA** (Free Application for Federal Student Aid)
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

**Unpaid Internship Stipend:** 1R will pay **$15/hour** for scholars completing unpaid internships in their career field.

**Laptops:** 1R scholars are eligible for one laptop (up to $650) after attending their first Annual Conference.`,
      },
    ],
  },
  {
    title: "Program Expectations",
    description:
      "Understand what One Refugee expects of you — and what happens if requirements are not met.",
    order: 2,
    lessons: [
      {
        title: "Scholar Expectations Overview",
        order: 1,
        content: `# 1R Scholar Expectations

To receive financial support and access all 1R opportunities, you must meet the program's expectations. These requirements exist because they reflect what it takes to succeed in college and in your career.

## The 8 Scholar Expectations

1. **Meet with your Education Manager every month**
2. **Enroll in at least 12 credits each semester**
3. **Maintain a minimum 2.5 term GPA**
4. **Gain professional experience**
5. **Submit required documents on time**
6. **Check your email regularly**
7. **Practice professional behavior**
8. **Attend required events**

Each of these is covered in detail in the following lessons.

## Why These Expectations Matter

These are not just program rules — they are habits that successful students and professionals develop. By meeting these expectations, you are:
- Building the discipline and reliability employers look for
- Staying on track toward graduation
- Developing a network of mentors and peers
- Positioning yourself for a career, not just a job

> **Pro Tip:** To be eligible for financial support and other 1R opportunities (like career trips), you must meet these expectations. Students who stay in good standing gain access to far more than just tuition assistance.`,
      },
      {
        title: "Monthly Meetings with Your Education Manager",
        order: 2,
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

## Scheduling Your Meetings

You will receive an **Action Required** email from your Education Manager with a link to schedule your meeting (usually via Calendly). When you receive this email:

1. Open it immediately
2. Click the scheduling link
3. Choose a time that works for you
4. Add it to your calendar

**Do not wait.** Scheduling promptly shows professionalism and ensures you get a time that works for you.

## What If You Need to Reschedule?

Life happens. If you need to reschedule, contact your Education Manager **at least one day before** your appointment. Do not simply no-show — that counts as a missed meeting.

## Penalties for Missing Meetings

| Missed Meetings | Consequence |
|---|---|
| 1 missed meeting | Needs Improvement status |
| 2 missed meetings in a semester | No Financial Support next semester |
| More than 2 missed meetings | Exit from the program |

> **Remember:** Your Education Manager has fewer students than your campus advisor and makes time specifically for you. Respect that time just as you would a job interview or class exam.`,
      },
      {
        title: "Academic Requirements",
        order: 3,
        content: `# Expectations #2 & #3: Academic Requirements

## Expectation #2: Enroll in At Least 12 Credits Each Semester

Being a **full-time student** (12+ credits per semester) is required for most financial aid and helps you progress toward graduation.

### Why Full-Time Enrollment Matters
- Qualifies you for federal financial aid (including your Pell Grant)
- Keeps you on track to graduate in 4 years
- Demonstrates commitment to your education

### The One Part-Time Semester
Each scholar is allowed **one part-time semester** during their time in the program. Use it wisely — plan ahead and discuss it with your Education Manager before dropping below 12 credits.

**Important:** Withdrawing from classes two semesters in a row, or being part-time previously and then withdrawing, can result in losing financial support.

---

## Expectation #3: Maintain a Minimum 2.5 Term GPA

Your GPA shows whether you are learning and passing your classes. 1R requires a minimum **2.5 term GPA** each semester.

### What Happens If You Fall Below 2.5?

- **One semester below 2.5:** You receive one grace semester of financial support while you work on improving.
- **Two consecutive semesters below 2.5:** You are not eligible for financial support from 1R.
- **Three consecutive semesters below 2.5:** You exit the program.

### How to Protect Your GPA

- Attend every class session
- Meet with professors during office hours if you are struggling
- Use campus tutoring resources
- Talk to your Education Manager *before* the semester ends if you're falling behind — not after
- If you are considering dropping a class, discuss it with your Education Manager first

> **Key insight:** It's far better to ask for help early than to fail a class and deal with the consequences later.`,
      },
      {
        title: "Professional Experience",
        order: 4,
        content: `# Expectation #4: Gain Professional Experience

## Why Professional Experience Is Essential

A college degree alone does not guarantee a career. Employers want candidates who have both education **and** real-world experience. This is why gaining professional experience is a core 1R expectation.

> **52% of college graduates are underemployed** one year after graduation — meaning they are working jobs that don't require a college degree. And 45% are still underemployed 10 years later.
>
> The students who avoid this are the ones who gained relevant experience while in college.

## What Counts as Professional Experience?

**Primary:** Working 10+ hours a week in a relevant role, **or** developing relevant professional skills through:
- Volunteer work in your field
- Leadership positions (campus clubs, organizations)
- Research opportunities (with a professor or department)

**Required by Graduation:** Complete **at least one internship or equivalent** work experience in your career field. Equivalent experiences include:
- Research projects
- Practicums
- Clinical experiences
- Part- or full-time employment in your field

## The Internship Stipend

If your internship is **unpaid**, 1R will pay you an **internship stipend of $15/hour**. You don't have to turn down valuable experience because you can't afford to work for free.

## When to Start

- **Freshman year:** Join clubs, find on-campus jobs, meet professors, explore careers
- **Sophomore year:** Polish your resume, do a mock interview, look for internship opportunities
- **Junior year:** Complete an internship in your field
- **Senior year:** Apply for full-time positions or graduate school

Your Education Manager will help you every step of the way.`,
      },
      {
        title: "Required Documents",
        order: 5,
        content: `# Expectation #5: Submit Required Documents On Time

## Documents Are Required Three Times a Year

1R asks you to submit required documents **three times per year** to verify your enrollment, academic progress, and scholarship eligibility.

## What Do You Submit?

| Deadline | Documents Required |
|---|---|
| **August** (varies by school) | Tuition Statement, Fall Schedule, Financial Aid information |
| **January 1** | Unofficial Transcript, Tuition Statement, Spring Schedule, Federal FAFSA confirmation for upcoming year |
| **June 1** | Unofficial Transcript, School FAFSA Award for upcoming year |

## How to Submit

You will receive an **Action Required** email with a form link and the deadline. Fill out the form and submit all required documents before the deadline.

## Penalty for Missing the Deadline

Missing a document submission deadline means you are **not eligible for tuition assistance** for that semester. This is a hard deadline — there are no exceptions.

> **Action Required emails always have a subject line that begins with "Action Required."** When you see this in your inbox, treat it as urgent.

## Expectation #6: Check Your Email Regularly

All document requests, meeting invitations, deadline reminders, and opportunities are sent by email. **If you check your email daily and respond promptly, you will always know what is required.**

Students who miss deadlines almost always say they "didn't see the email." Make it a daily habit — just like brushing your teeth.`,
      },
      {
        title: "Required Events",
        order: 6,
        content: `# Expectation #8: Attend Required Events

## Two Required Events Each Year

### 1. The Annual Conference (Every August)
The Annual Conference is a **mandatory event** held every year before fall semester begins. This is one of the most important days of your 1R year.

**What happens at the Annual Conference:**
- Meet all other 1R scholars across your state
- Attend career and academic workshops
- Eat lunch and participate in community activities
- Complete the last step of your onboarding (as a new scholar)

**Expectations for the Annual Conference:**
- You are expected to take time off work and arrange travel so you can attend
- Arrive **on time** and stay for the **entire event** to receive credit for attending
- Missing the Annual Conference without prior approval results in No Financial Support status

### 2. One Professional Development Event Per Academic Year
Each year, you must attend at least one professional event. Options include:
- **Site visits** — tours of companies or organizations in your field
- **Career panels** — professionals speaking about their careers
- **Career trips** — 1R-organized trips to visit employers

These events are some of the most valuable experiences 1R offers. They give you exposure to career paths, networking opportunities, and insights you can't get from a classroom.

## Orientation (One-Time)
Attending orientation is also a required event — which you are completing right now. Welcome!

## What Happens If You Miss a Required Event?

| Event Missed | Consequence |
|---|---|
| Professional development event | Needs Improvement status (resets when you attend one) |
| Annual Conference | No Financial Support status (resets in January) |
| Annual Conference while already on No Financial Support | Exit from the program |`,
      },
      {
        title: "Professional Behavior",
        order: 7,
        content: `# Expectation #7: Professional Behavior

## What We Mean by Professional Behavior

Professional behavior is a standard for all 1R scholars. It means being honest, reliable, and respectful in all your interactions — with 1R staff, professors, employers, and fellow scholars.

## Academic Integrity

**Do not cheat on coursework.** This includes:
- Submitting papers found online
- Using AI tools (like ChatGPT) to write assignments for you and submitting them as your own work
- Copying from classmates

Cheating can result in failing a class or being expelled from your school. It also disqualifies you from 1R.

## Honesty with 1R

Always provide accurate information when filling out 1R forms, applications, the FAFSA, and surveys. This includes:
- Your 1R application
- Housing aid applications
- Internship stipend requests

Knowingly entering incorrect information will result in being exited from the program.

## Reliability

Being reliable means:
- Showing up on time to meetings and events
- Responding to emails and messages promptly
- Following through on commitments
- Giving advance notice when you need to cancel or reschedule

## A Model Scholar

> *"Alli is always on time and prepared for our meetings. If she can't meet at our scheduled time, she emails her Education Manager the day before and reschedules. She is planning to be a nurse and has investigated all the nursing programs in her area so she can make a good choice."*

This is the standard. Think about the professionals you want to work with someday — they show up, they communicate, and they follow through. Practice that now.`,
      },
      {
        title: "Scholar Status Table",
        order: 8,
        content: `# Scholar Status: Understanding Your Standing

## The Four Status Levels

Your status in the 1R program determines your eligibility for financial support and other opportunities.

### Good Standing
You are eligible for all 1R benefits.

| Requirement | Good Standing |
|---|---|
| Monthly Meetings | Attend all one-on-one monthly meetings |
| GPA | All semesters above 2.5 |
| Events | Attend all mandatory events |
| Enrollment | Taking 12+ credits each semester |
| Documents | Submit required documents by the deadline |

---

### Needs Improvement
You still receive financial support, but you need to address an issue.

| Issue | How to Return to Good Standing |
|---|---|
| Missed one monthly meeting | Attend your next scheduled meeting |
| One semester below 2.5 GPA | Achieve above 2.5 GPA the next semester |
| Missed a professional development event | Attend a professional development event |

---

### No Financial Support
You do not receive tuition assistance this semester.

| Issue | How to Return to Good Standing |
|---|---|
| Missed two monthly meetings in a semester | Regain current standing once tuition is submitted the following semester |
| Two consecutive semesters below 2.5 GPA | Achieve above 2.5 GPA for one semester (must be full-time) |
| Did not attend the Annual Conference | Status resets in January |
| Part-time a second semester, or withdrew from classes twice | Return to full-time enrollment |
| Submitted required documents after the deadline | Submit on time the following semester |

---

### Exit
You have been exited from the program.

| Issue | Path Forward |
|---|---|
| Missed more than two meetings in a semester | Reapply to 1R |
| Three consecutive semesters below 2.5 GPA | Reapply to 1R |
| Missed Annual Conference while on No Financial Support | Reapply to 1R |
| Two consecutive part-time semesters (or three non-consecutive) | Reapply to 1R |
| Never submitted required documents | Reapply to 1R |

> **The goal is always Good Standing.** If you're ever unsure about your status or worried about meeting a requirement, talk to your Education Manager right away — don't wait.`,
      },
    ],
  },
  {
    title: "Communication Skills",
    description:
      "Master the professional communication skills you need to succeed in college, in 1R, and in your career.",
    order: 3,
    lessons: [
      {
        title: "Why Email Matters",
        order: 1,
        content: `# Why Email Matters

## Email Is How Professionals Communicate

In the professional world, email is the primary way that organizations communicate. One Refugee, your professors, employers, the government, and most other professional organizations all use email to communicate important information.

## Email Can Help or Hurt You

**Responding to emails promptly can EARN you:**
- Respect from professors, coaches, and employers
- Scholarships and financial opportunities
- Internships and job offers
- Invitations to career trips and special events
- Letters of recommendation

**Not checking your email can COST you:**
- A mentor's trust and letter of recommendation
- Housing opportunities
- Scholarships and internships
- Jobs and career trips
- Money you were eligible for

## The #1 Mistake 1R Students Make

> **They don't check and respond to emails.**

This is the single most common reason students miss deadlines, lose financial support, and miss out on opportunities. It is completely avoidable.

## What "Checking Email" Really Means

Checking email doesn't mean glancing at your inbox once a week. It means:
- Opening your email **every day**
- Reading messages fully
- **Responding the same day** when a response is needed
- Acting on Action Required emails **immediately**

The best 1R students are often the first to respond to emails — and they are the first to receive opportunities as a result.`,
      },
      {
        title: "Email Best Practices",
        order: 2,
        content: `# Email Best Practices

## Writing Professional Emails

Whether you're emailing your Education Manager, a professor, or a future employer, the quality of your emails says a lot about you. Here's how to write emails that earn respect.

## The Do's

**Use a professional email address.**
Use your school email or a simple personal address like \`firstname.lastname@gmail.com\` — not an old nickname or casual handle.

**Write a clear, concise subject line.**
Examples:
- \`Meeting Follow-up\`
- \`Question About BIO 201 Assignment\`
- \`Ian Boyle - BIO 201 Tues Lab Question\`

**Use a professional greeting with a title.**
- \`Dear Professor Smith,\`
- \`Hello Mr. Johnson,\`
- \`Hi Ms. Garcia,\`

**Introduce yourself when needed.**
If the person may not know you: *"I'm a sophomore microbiology major in your Tuesday morning BIO 201 course."*

**Be clear and polite.**
State your question or request directly. Be kind throughout. End with a signature like "Thank you," or "Best regards," followed by your name.

**Proofread before sending.**
Check spelling and grammar. Grammarly is a free browser extension that can help.

## The Don'ts

- Don't use all caps or abbreviations (NO CAPS, R U, BRB)
- Don't be vague about what you need
- Don't send angry emails — wait until you've calmed down
- Don't use emojis or excessive punctuation (!!!!)
- Don't send without proofreading

## A Quick Checklist Before You Send

- [ ] Is my subject line clear and relevant?
- [ ] Did I greet the person appropriately and spell their name correctly?
- [ ] Did I introduce myself if needed?
- [ ] Is my question or request clear?
- [ ] Am I being polite and professional?
- [ ] Did I add a closing signature?
- [ ] Would I be comfortable if anyone read this email?

> **Remember:** Once sent, an email is permanent. It can be forwarded to people you never intended to see it. Never send an email in anger.

## Example: Before and After

**Before (don't do this):**
> *Subject: you gave me an F???*
> *mr. gary....why did you give me an F in accounting 101? i went to most of the classes and literally did ALLLLL of the assignments...*

**After (professional version):**
> *Subject: George Lopez - Accounting 101 Final Grade*
> *Dear Mr. Gary, I hope this email finds you well. I am in your Accounting 101 class and noticed I received an F. I was surprised, as I attended most classes and completed all assignments. Is it possible to meet to discuss this? I hope there is something I can do to address it. Thank you, George Lopez*`,
      },
      {
        title: "Types of 1R Emails",
        order: 3,
        content: `# The Two Types of 1R Emails

Not every email from 1R requires the same response. Knowing the difference will help you prioritize.

## Type 1: Action Required Emails

**Subject line will say: "Action Required"**

These emails require you to **do something specific**, and there are **penalties for not responding**.

Examples of Action Required emails:
- **Schedule your monthly meeting** — click the Calendly link and book your appointment immediately
- **Submit your required documents form** — complete and submit the form by the stated deadline

### What to Do When You Receive an Action Required Email:
1. Open it right away
2. Read it completely
3. Take action immediately (schedule, submit, click)
4. Add any appointments to your calendar

**The penalty for not responding:**
- Missing 2 meetings in a semester = no financial aid next semester
- Not submitting required documents by the deadline = no financial aid that semester

---

## Type 2: Informational Emails

**Subject line will NOT say "Action Required"**

These emails share information that may be helpful or interesting. You are not required to take action, but you may want to.

Examples:
- Event invitations and sign-ups
- Internship and job opportunities
- Community resources
- Campus store or tuition updates

### What to Do With Informational Emails:
- Quickly read through to see if it applies to you
- Take action if you'd like to participate
- Don't stress if it doesn't apply to you right now

---

## The Golden Rule

**When in doubt, respond.** A quick reply shows professionalism and respect, even if it's just to say you received the message.`,
      },
      {
        title: "Using Slack",
        order: 4,
        content: `# Using Slack for 1R Communication

## What Is Slack?

Slack is a messaging platform that One Refugee uses to communicate in groups, share opportunities, and send quick messages. Think of it as a professional group chat — like a text message thread, but organized by topic.

## Why 1R Uses Slack

- **Group channels** — announcements go to everyone in a channel at once
- **Sharing extras** — internship opportunities, freebies, events get posted here
- **Quick messages** — faster than email for simple questions or updates
- **Community** — a way to stay connected with your fellow scholars

## How to Join 1R Slack

1. **Check your email** for an invitation to join the One Refugee Slack workspace
2. **Download the free Slack mobile app** from the App Store or Google Play
3. **Open the app** and sign in with your email
4. **Turn on notifications** so you don't miss important announcements

## Channels to Join

You will automatically be added to the announcements channel. Make sure to also join:

| Channel | What It's For |
|---|---|
| \`#careers\` | Internships, job postings, and career opportunities |
| \`#utah\` or \`#idaho\` or \`#arizona\` | Your state-specific announcements and events |
| Your school channel (e.g., \`#BYU\`, \`#UofU\`, \`#BSU\`) | Updates specific to your campus |

## Setting Up Notifications

Set your notifications to **"All new messages"** so you stay current on 1R announcements and opportunities. You don't want to miss out on freebies, tickets, or opportunities because your notifications were turned off.

## What Gets Shared on Slack?

Past examples of things shared on Slack:
- Utah Jazz basketball game tickets
- Hockey night club seats with free food
- Salt Lake Real Soccer team tickets
- 1R movie nights
- Eye exams and health resources

> Slack is where a lot of the fun extras live. Don't miss out — set it up today.`,
      },
    ],
  },
  {
    title: "Map to a Career",
    description:
      "Learn how to use your college years strategically to build a career, choose a marketable major, and gain the experience employers want.",
    order: 4,
    lessons: [
      {
        title: "Job vs. Career",
        order: 1,
        content: `# You Are Going to College for a Career, Not Just a Job

## What Is the Difference?

**A job** is work you do for a paycheck. It may or may not require your degree.

**A career** is a progression of meaningful, skilled work in a field you've chosen — with increasing responsibility, compensation, and satisfaction over time.

You are going to college to have a **career**. That's the goal.

## Does a College Degree Guarantee a Career?

**No.** A degree is necessary — but it is not sufficient on its own.

> **52% of college graduates are underemployed** one year after graduation — meaning they work in jobs that don't require their degree.
>
> And **45% are still underemployed after 10 years**.

This is called **underemployment**, and it is **sticky** — meaning it tends to persist.

## Two Students, Same Degree — Different Outcomes

### Tantine's Story
Tantine worked at a supermarket while attending Boise State University. Because of her family responsibilities, she focused only on studying, working, and caring for her family. After 4 years, she graduated with a degree in Business IT Management.

**Two years after graduation:** Because she didn't gain relevant experience, skills, or connections during college, she couldn't find a job in her field. She continued working at the grocery store at $15/hour.

### Ruya's Story
Ruya also attended Boise State and worked at the supermarket. But her family encouraged her to focus on school **and** getting relevant work experience. She worked with One Refugee to learn about resumes and interviews, joined a club in her field, found an on-campus job in her career area, and talked to professors for advice.

She got an internship in her field, networked with her supervisor, and was offered a full-time position after graduation — **earning $70,000/year**.

**Same major. Different outcome. The difference: relevant experience, skills, and connections.**

## The Lesson

Just like driving requires both a written test (knowledge) and a driving test (practice), a career requires both a degree **and** experience, skills, and networking.

> Your goal is a career, not just a college degree. One Refugee is here to help you get both.`,
      },
      {
        title: "The Value of a College Degree",
        order: 2,
        content: `# The Value of a College Degree

## Lifetime Earnings by Education Level

The data is clear: education pays off significantly over a lifetime.

| Education Level | Estimated Lifetime Earnings |
|---|---|
| High school diploma | $1,304,000 |
| Some college, no degree | $1,504,700 |
| Associate's degree | $1,727,000 |
| Bachelor's degree | $2,268,000 |
| Master's degree | $2,671,000 |

*Source: Georgetown University Center on Education and the Workforce, 2021*

## What Employers Are Looking For

Employers look for three things:

1. **A marketable degree** — credentials in a relevant field
2. **Experience** — real-world practice and accomplishments
3. **Skills** — specific abilities you've developed

A degree opens the door. Experience and skills determine whether you walk through it with confidence.

## Your Year-by-Year Game Plan

| Year | Focus |
|---|---|
| **Freshman** | Choose a marketable degree & major; learn how to succeed in college |
| **Sophomore** | Prepare to find an internship; polish resume and LinkedIn |
| **Junior** | Find and complete an internship in your field |
| **Senior** | Start your professional career; apply for full-time positions |

## Annual Conference Workshops

Each year at the Annual Conference, 1R offers workshops aligned with your year in school:

- **Freshmen:** College success, resume basics
- **Sophomores:** LinkedIn, interview skills
- **Juniors:** How to find an internship, employment training
- **Seniors:** Job search strategy, professional skills

> **Stay in the 48%.** That's the percentage of graduates who are employed in their field. The steps you take during college — choosing the right major, gaining experience, networking — determine which group you're in.`,
      },
      {
        title: "Steps to Choose Your Career",
        order: 3,
        content: `# Steps to Choose Your Career

Choosing a career is like putting together a puzzle. You need to see the full picture before you can fit the pieces together. Here are the steps 1R recommends:

## Step 1: Learn About Your Interests & Skills

Start by looking inward.

- **Take the Career Explorer Assessment** — a free tool that matches your personality and interests to career options. You can find it at [careerexplorer.com](https://www.careerexplorer.com).
- **Talk to people who know you** — parents, teachers, school counselors. What careers do they think you would enjoy and be good at?
- **Identify skills you already have** — what are you naturally good at? What do people come to you for help with?

## Step 2: Explore Career Options & Majors

Once you have some ideas, dig deeper.

- **Career One Stop** ([careeronestop.org](https://www.careeronestop.org)) — hundreds of career videos covering outlook, education requirements, and salary
- **O*NET OnLine** ([onetonline.org](https://www.onetonline.org)) — detailed information on thousands of occupations
- **What Can I Do With This Major?** ([whatcanidowiththismajor.com](https://whatcanidowiththismajor.com)) — explore what careers a specific major leads to
- Look at the list of majors offered at your school and ask: *Which sound interesting? What careers do they lead to?*

## Step 3: Compare Your Top Career Interests

For each career you're seriously considering, research:

| Factor | Questions to Ask |
|---|---|
| **Education** | How many semesters? Does the program require admission? Is a graduate degree needed? |
| **Major Classes** | Do the classes look interesting? Could I succeed in them? |
| **Skills** | What certifications, software, or languages are needed? |
| **Experience** | What types of experience do employers expect? |
| **Salary** | What is the average salary? Can I live on it? |
| **Interest** | Do I enjoy what I would do every day? Is it meaningful? |
| **Life Balance** | What is the schedule like? Travel, overtime, remote work? |
| **Career Outlook** | Is this a growing field? Will this job exist in the future? |

## Step 4: Choose a Path & Try It Out

You don't have to be 100% sure before you start. Pick your best option and try it:

- Take an introductory course in that field
- Volunteer or find a part-time job related to your career interest
- Talk to someone working in that career (informational interview)
- Look at real job postings to see what employers want
- Join a campus club in your industry
- Talk to a professor who works or has worked in your field

## Step 5: Reflect & Adjust

After taking introductory steps, ask yourself:
- Am I passing my prerequisite courses?
- Do I enjoy what I'm learning about?
- Am I still interested in this career after learning more?

It's okay to adjust your path. Many students change majors — the key is to change intentionally, not randomly.`,
      },
      {
        title: "Research Marketable Degrees",
        order: 4,
        content: `# Research Marketable Degrees

## Not All Degrees Are Created Equal

Some majors lead directly to in-demand careers. Others make it harder to find employment in your field after graduation. Being strategic about your major is one of the most important decisions you'll make in college.

## Understanding Underemployment by Major

Research shows that **some majors have dramatically lower rates of underemployment** than others. This means graduates work in jobs that actually require their degree.

### Majors with Lower Underemployment Rates (Below 37%)

These fields have strong demand and clear career paths:

- Computer Science and Technology
- Engineering (all disciplines)
- Mathematics and quantitative fields
- Finance and Accounting
- Education (teaching)
- Healthcare — Registered Nurse (RN), Physician (MD), Physician Assistant (PA), Surgical Technician, Respiratory Technician
- Social Work (Licensed Clinical Social Worker — LCSW)

### Majors with Higher Underemployment Rates (57%+)

These fields may still be meaningful, but require more intentional career planning:

- General Business (Marketing, Management)
- Life Sciences (Biology)
- Political Science
- Music and Art
- Early Childhood Education
- Public Health
- Psychology and Sociology

## This Doesn't Mean You Can't Study These Fields

It means you need to be **more intentional** about gaining experience, building skills, and networking if your major falls into the higher-underemployment category.

## How to Research a Specific Career

Use these resources:

- **Career One Stop** — career videos with education requirements, salary, and outlook
- **O*NET** — detailed career data including skills and typical tasks
- **Bureau of Labor Statistics Occupational Outlook Handbook** — projections on job growth and demand
- **LinkedIn** — look at the profiles of people working in roles you want

## Questions to Answer for Any Major You're Considering

1. What jobs does this major lead to?
2. What is the average salary for those jobs in my area?
3. Is this field growing or shrinking?
4. What experience do employers expect?
5. Does my school have a strong program in this major?

> Talk with your Education Manager about your major and career plans. They can help you research options and make a smart decision.`,
      },
      {
        title: "Compare Your Career Options",
        order: 5,
        content: `# How to Compare Career Options

## The Career Comparison Worksheet

When you have 2-3 careers you're seriously considering, compare them side by side. This helps you make a thoughtful decision rather than choosing based on a feeling alone.

## The Eight Comparison Factors

### 1. Education
- How many semesters until graduation?
- Will I need a graduate degree?
- What is the total cost of the program?
- Do I need to apply and be accepted into the major separately?

### 2. Major Classes
- Do these classes look interesting to me?
- Could I succeed in these classes?
- Are there required prerequisites I need to plan for?

### 3. Skills
- What certifications are required or valued?
- What software, programming languages, or tools will I need to learn?
- Are these skills I'm interested in developing?

### 4. Experience
- How many years of experience do employers typically expect?
- What kinds of experience are most valued?
- Is there an internship program I should be part of?

### 5. Salary
- What is the starting salary in this field?
- What is the average salary after 5-10 years?
- Is this a salary I can live on in my area?

### 6. Interest
- Do I enjoy what people in this career do every day?
- Am I interested in solving the problems this career addresses?
- Does this work feel meaningful to me?

### 7. Life Balance
- What is the typical work schedule? (Overtime, weekends, evenings)
- Does this career involve travel?
- Can I work remotely or from home?
- Is there flexibility for family needs?

### 8. Career Outlook
- Is this field growing or shrinking?
- Is automation or AI likely to replace this role?
- Will this career be in demand in 10 years?

## How to Find This Information

Use these resources to research your comparison:

- **Job listings** — real postings show what employers actually want
- **O*NET** and **Career One Stop** — official career data
- **LinkedIn** — profiles of people in roles you want
- **Informational interviews** — talk to someone doing the job
- **Your Education Manager** — they know the job market and can help you research`,
      },
      {
        title: "Get Experience & Build Your Path",
        order: 6,
        content: `# Building Your Career Path Through Experience

## Experience Is Not Optional

Employers hiring college graduates look for candidates who have **done something** in their field — not just studied it. Every year you spend in college is an opportunity to build your resume with relevant experience.

## What You Can Do at Every Stage

### Freshman Year — Explore & Engage
- Join a **campus club** in your career area
- Find an **on-campus job** — even if it's not directly in your field
- **Talk to your professors** — they often have connections and can point you toward opportunities
- **Take introductory courses** in careers you're curious about
- Complete your **career assessment** and meet with your Education Manager about your plan

### Sophomore Year — Prepare
- Finalize your major and career direction
- **Build your resume** with a 1R coach
- Create or improve your **LinkedIn profile**
- Complete at least **one mock interview**
- Start **researching internships** in your field

### Junior Year — Do
- **Complete an internship** in your career field (this is required by 1R)
- Network with supervisors, coworkers, and professionals in your industry
- **Add your internship experience** to your resume
- Explore opportunities for research, practicums, or clinical experience if relevant to your field

### Senior Year — Launch
- Apply for **full-time positions** in your field
- Or plan for **graduate school** if required for your career
- Use your network from internships and campus activities
- Work with your 1R Career Manager on your job search strategy

## Remember: Your Resume Is the Answer to a Job Listing

A job listing is a question: *Do you have what we need?*

Your resume is the answer: *Yes — here is my education, my experience, and my skills.*

Build your college years so that your resume can answer "yes" to the jobs you want.`,
      },
      {
        title: "Your Graduation Timeline",
        order: 7,
        content: `# Your Graduation Timeline

## Credits and Graduation

A standard bachelor's degree requires **120-122 credits**. How quickly you complete those credits depends on how many you take each semester.

## Credit Load Comparison

| Credits Per Semester | Semesters to Graduate | Years |
|---|---|---|
| 15 credits/semester | 8 semesters | 4 years |
| 12 credits/semester | 10 semesters | 5 years |

**Taking 15 credits per semester is the standard path to graduating in 4 years.** Dropping to 12 credits per semester (the 1R minimum) adds an extra year.

## Why This Matters

Every extra semester is:
- An extra semester of tuition to pay
- An extra semester before you start earning a career salary
- More time before you reach your financial goals

Work with your Education Manager and your campus academic advisor to build a degree plan that gets you to graduation efficiently.

## Starting Prerequisite Classes Early

Many programs — especially in healthcare, engineering, computer science, and the sciences — have prerequisite classes you must take **before** you can be admitted to the major program.

**Start these as soon as possible.** Students who wait to start prerequisites often extend their graduation timeline by a year or more.

**Math placement** is especially important. If your school requires a math placement assessment, take it early so you can start in the right math course.

## Your Graduation Plan

Work with your Education Manager and campus academic advisor to:

1. Identify all required courses for your major
2. Map out which classes to take each semester
3. Note any courses that are only offered once a year
4. Plan your prerequisite sequence
5. Identify when you'll complete your internship requirement

> **You won't have to do this alone.** Your Education Manager will help you build a plan — but you need to be proactive. Come to your meetings with questions and be engaged in the planning process.`,
      },
    ],
  },
  {
    title: "Next Steps",
    description:
      "Complete your orientation and start the 1R onboarding process.",
    order: 5,
    lessons: [
      {
        title: "Career Assessment",
        order: 1,
        content: `# Career Assessment: Discover Your Career Matches

## Why Take a Career Assessment?

A career assessment helps you discover careers that match your interests, personality, and strengths. It's a starting point — not a final answer — but it can open your eyes to options you hadn't considered.

## Your Assignment: Career Explorer Assessment

One Refugee uses **Career Explorer** as its recommended career assessment tool.

### How to Complete the Assessment

1. **Go to** [careerexplorer.com](https://www.careerexplorer.com)
2. **Click "Take the free test"** to begin
3. **Work through the assessment** — it takes about 20-30 minutes
4. **Before you finish:** click **"Save your progress"** — this creates your account and saves your results
5. **Enter your email** when prompted to save your progress
6. **Complete the assessment** and view your results
7. **Click "Share"** and then **"Copy Link"**
8. **Paste your results link** into the required form

### What Your Results Show

Career Explorer will give you:
- Your top career matches based on your interests
- Information about each career (education, salary, outlook)
- Your personality and interest profile

### Discuss Your Results at Orientation or with Your Education Manager

Bring your results to your in-person orientation and share your top matches with your neighbor. Did the results surprise you? Were there careers you hadn't considered?

## Additional Career Exploration Resources

| Resource | What It Offers |
|---|---|
| [Career One Stop](https://www.careeronestop.org/Videos/CareerVideos/career-videos.aspx) | Hundreds of career videos with salary, education, and outlook |
| [O*NET OnLine](https://www.onetonline.org) | Detailed information on thousands of occupations |
| [What Can I Do With This Major?](https://whatcanidowiththismajor.com) | Connect majors to career paths |
| [LinkedIn](https://www.linkedin.com) | Research professionals in careers you're interested in |

> Exploring careers is one of the most valuable things you can do as a college student. The more you understand your options, the better decisions you'll make.`,
      },
      {
        title: "Summer Onboarding Checklist",
        order: 2,
        content: `# Summer Onboarding: What to Do Next

## Your Onboarding Steps

Welcome to One Refugee! Here is the complete onboarding sequence for new scholars:

| Step | Timeframe | What to Do |
|---|---|---|
| **1** | Now (Online) | Complete Online Orientation & submit Career Assessment form |
| **2** | Spring/April-May | Attend In-Person Orientation |
| **3** | June-July | Meet with your Education Manager for the first time |
| **4** | August | Submit required documents & attend the Annual Conference |

## What to Do Right Now

### Complete This Online Orientation ✓
You're almost done! Finish all lessons in this course.

### Submit Your Career Assessment
After completing the Career Explorer assessment, submit your results link using the form your Education Manager sent you.

### Check Your Email
Your Education Manager will send you information about scheduling your first meeting and what to expect next. Watch for emails from One Refugee.

## Meetings Over the Summer

As a new scholar, you need to meet with your Education Manager **twice during the summer** before August. When you receive the scheduling email from your Education Manager, click the Calendly link and book your first appointment immediately.

## Prepare for In-Person Orientation

Your in-person orientation will be held in spring/early summer (dates by state):
- **Utah:** May (check your email for exact date)
- **Idaho:** May (check your email for exact date)
- **Arizona:** April (check your email for exact date)

This is a **required event**. Plan accordingly — arrange your work schedule and transportation in advance.

## Work with Your Education Manager

Your Education Manager will help you work through a **summer onboarding checklist** that includes:
- Enrolling for fall classes
- Setting up your FAFSA
- Understanding your tuition statement
- Planning your first semester

> **Just show up!** The more engaged you are with One Refugee, the better your experience will be. Every step of onboarding builds your connection to the program and to your future.`,
      },
      {
        title: "The Annual Conference",
        order: 3,
        content: `# The Annual Conference: Your Required August Event

## What Is the Annual Conference?

The Annual Conference is a full-day required event held every August before fall semester begins. It is one of the most important days of your year as a 1R scholar.

## What Happens at the Annual Conference?

- **Meet all other 1R scholars** across your state — you'll be part of a community of students who understand your journey
- **Attend career and academic workshops** tailored to your year in school
- **Eat lunch and participate in activities** — it's a great day
- **Complete the final step of your onboarding** as a new scholar

## Workshops by Year

| Year | Workshop Focus |
|---|---|
| Freshmen | College Success + Resume Writing |
| Sophomores | LinkedIn + Interview Skills |
| Juniors | How to Find an Internship + Employment Training |
| Seniors | Job Search Strategy + Professional Skills |

## Attendance Requirements

The Annual Conference is **mandatory**. Here's what that means:

- **Take time off work** — plan ahead and request the day off in advance
- **Arrange travel** — if you need transportation, figure it out early
- **Arrive on time** — late arrivals may not receive credit for attending
- **Stay for the entire event** — leaving early means you don't get credit

Missing the Annual Conference results in **No Financial Support status** for the following semester. If you are already on No Financial Support and miss the Annual Conference, you will be **exited from the program**.

## Your Laptop

New scholars: after attending your first Annual Conference, you become eligible for a **1R laptop** (up to $650 value). This is one of the benefits of making it through onboarding successfully.

## You Made It!

Completing this orientation is your first step in One Refugee. You now understand the program, the expectations, and the path forward.

> **Welcome to the 1R community. We are rooting for you.**`,
      },
    ],
  },
];

async function main() {
  console.log("Creating One Refugee Orientation course...");

  // Create the course
  const course = await prisma.course.create({
    data: {
      title: "One Refugee Orientation",
      description:
        "Welcome to One Refugee! This orientation covers everything you need to know to get started: program benefits, scholar expectations, professional communication, career planning, and your onboarding next steps.",
      category: "EDUCATION",
      status: "PUBLISHED",
    },
  });
  console.log(`Created course: ${course.title} (${course.id})`);

  // Create all modules and lessons
  for (const mod of modules) {
    const { lessons, ...moduleData } = mod;
    const created = await prisma.module.create({
      data: { ...moduleData, courseId: course.id },
    });
    console.log(`  Created module: ${created.title}`);

    for (const lesson of lessons) {
      await prisma.lesson.create({
        data: { ...lesson, moduleId: created.id, type: "READING" },
      });
      console.log(`    Created lesson: ${lesson.title}`);
    }
  }

  console.log("\nDone! Orientation course is live.");
  console.log(`Course ID: ${course.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

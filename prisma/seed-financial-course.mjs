import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL =
  "postgresql://postgres.oezqkesqqeckqrasnmnq:b7jIjOiUAYEElSnS@aws-1-us-east-2.pooler.supabase.com:6543/postgres";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const COURSE_ID = "cmmodwhoj0002rr8zjsr1nkym";
const OLD_MODULE_ID = "cmmodwto60003rr8zi37nz0dt";

const modules = [
  {
    title: "Budgeting Basics",
    description: "Learn how to understand your income, track spending, and build a budget that works for your life.",
    order: 1,
    lessons: [
      {
        title: "Understanding Your Income",
        order: 1,
        content: `# Understanding Your Income

Your income is the money you receive regularly — from a job, government benefits, freelance work, or other sources. Before you can budget, you need to know exactly how much money you have coming in.

## Types of Income

**Gross Income** is the total amount you earn before any deductions. If your job pays $18/hour and you work 40 hours a week, your gross income is $720/week.

**Net Income** (also called "take-home pay") is what you actually receive after taxes and other deductions like health insurance or retirement contributions. This is the number you should use for budgeting.

## Common Income Sources for New Americans
- **Employment wages** — your regular paycheck from an employer
- **Self-employment / gig work** — driving for a rideshare service, cleaning, childcare, etc.
- **Government assistance** — programs like SNAP, housing assistance, or refugee resettlement support
- **Child tax credits or other benefits**

## What to Do
1. List every source of income you have.
2. Write down the net (after-tax) amount for each.
3. Add them together — this is your monthly income and the foundation of your budget.

> **Tip:** If your income changes month to month (like gig work), use the lowest amount you typically earn so you never overestimate what you have.`
      },
      {
        title: "Creating a Monthly Budget",
        order: 2,
        content: `# Creating a Monthly Budget

A budget is simply a plan for your money. It tells your money where to go instead of wondering where it went.

## The 50/30/20 Rule

A simple framework many financial experts recommend:

| Category | Percentage | What It Covers |
|----------|-----------|----------------|
| Needs | 50% | Rent, groceries, utilities, transportation, healthcare |
| Wants | 30% | Dining out, entertainment, hobbies, subscriptions |
| Savings & Debt | 20% | Emergency fund, savings goals, paying off debt |

**Example:** If your net monthly income is $2,000:
- $1,000 goes to needs
- $600 goes to wants
- $400 goes to savings/debt

## How to Build Your Budget

1. **Write down your monthly income** (from the previous lesson)
2. **List all your fixed expenses** — rent, car payment, phone bill (these are the same every month)
3. **Estimate variable expenses** — groceries, gas, clothing (these change each month)
4. **Subtract your expenses from your income**
5. **If you have money left over** — save it. If you're short — find expenses to reduce.

## Budget Tools
- **Pen and paper** — simple and effective
- **Spreadsheets** — Google Sheets is free
- **Apps** — Mint, YNAB (You Need A Budget), or EveryDollar

> **Key insight:** A budget is not about restriction — it's about intention. You decide in advance where your money goes.`
      },
      {
        title: "Tracking Your Expenses",
        order: 3,
        content: `# Tracking Your Expenses

Making a budget is step one. Tracking your actual spending is how you stick to it.

## Why Tracking Matters

Most people underestimate how much they spend. Small purchases — a coffee here, a convenience store trip there — add up quickly. Tracking reveals the truth about your spending habits.

## How to Track

**Method 1 — Save your receipts**
Keep every receipt for one month. At the end, sort them into categories (food, transportation, entertainment, etc.) and total each one.

**Method 2 — Review your bank statements**
Most banks let you download your transaction history. Go through each purchase and categorize it.

**Method 3 — Use a budgeting app**
Apps like Mint or your bank's own app can automatically categorize your spending.

## Spending Categories to Track
- Housing (rent, utilities)
- Food (groceries + dining out — track separately!)
- Transportation (gas, bus pass, car insurance)
- Healthcare
- Personal care
- Entertainment
- Clothing
- Savings contributions
- Miscellaneous

## What to Do With What You Find

After tracking for one month, ask yourself:
- Are there categories where I'm spending more than I thought?
- Are there easy areas to cut back?
- Am I spending in line with my values and goals?

> **Challenge:** Track every purchase you make for the next 30 days. Even $1 snacks count. The awareness alone changes behavior.`
      },
      {
        title: "Needs vs. Wants",
        order: 4,
        content: `# Needs vs. Wants

One of the most important distinctions in personal finance is understanding the difference between what you *need* and what you *want*.

## What Is a Need?

A **need** is something essential for survival and basic functioning:
- Food and clean water
- Housing and utilities (heat, electricity)
- Basic clothing
- Transportation to work
- Healthcare and medicine

## What Is a Want?

A **want** is something that improves your life but isn't essential:
- A newer phone (when your current one works)
- Dining at restaurants (when you can cook at home)
- Streaming subscriptions
- Brand-name clothing
- Entertainment and hobbies

## The Gray Area

Some things fall in between. For example:
- **Internet** — a need if required for work or school, a want if only for entertainment
- **A car** — a need if public transportation isn't available where you live, a want if you could take the bus
- **A smartphone** — a need for job searching and communication, a want if you already have a basic phone

## Why This Matters for Budgeting

When money is tight, cutting wants first protects your needs. When you have extra money, you can afford more wants — guilt-free.

> **Reflection question:** Think of your last five purchases. Were they needs or wants? Were you happy with how you spent that money?`
      },
    ],
  },
  {
    title: "Building Your Safety Net",
    description: "Understand why an emergency fund is essential and learn practical steps to build one on any income.",
    order: 2,
    lessons: [
      {
        title: "Why an Emergency Fund Matters",
        order: 1,
        content: `# Why an Emergency Fund Matters

Life is unpredictable. A car breaks down. A medical bill arrives unexpectedly. You lose hours at work. Without a financial cushion, these events can become crises — forcing you to take on debt or fall behind on bills.

An **emergency fund** is money set aside specifically for these unexpected situations. It is the foundation of financial stability.

## What Counts as an Emergency?
- Unexpected medical or dental bill
- Car repair needed to get to work
- Job loss or sudden reduction in hours
- Urgent home repair (broken heater, leaking roof)
- Family emergency requiring travel

## What Does NOT Count as an Emergency?
- A sale on clothes you want
- A vacation
- A new TV or phone
- Holiday gifts (these are predictable — plan for them separately)

## The Peace of Mind Factor

Beyond the practical benefit, an emergency fund gives you psychological security. When you know you have a cushion, you make better decisions — you're less likely to take a bad job out of desperation, or stay in a difficult situation because you can't afford to leave.

## For New Americans Specifically

Building financial security in a new country is especially challenging. An emergency fund gives you breathing room while you establish yourself. Even a small fund — $500 or $1,000 — can make a significant difference.

> **Goal:** Your emergency fund should eventually cover 3–6 months of living expenses. Start small — even $20/month builds a cushion over time.`
      },
      {
        title: "How Much to Save and Where to Keep It",
        order: 2,
        content: `# How Much to Save and Where to Keep It

## How Much Do You Need?

Financial experts generally recommend saving **3 to 6 months of living expenses**. For most people starting out, that feels overwhelming. Here's a more manageable approach:

**Stage 1 — Starter Emergency Fund: $500–$1,000**
This covers small emergencies like a car repair or unexpected bill. Getting here should be your first savings goal.

**Stage 2 — One Month of Expenses**
Calculate what it costs you to live for one month (rent, food, utilities, transportation). Save that amount.

**Stage 3 — Three to Six Months**
This is the full emergency fund. It protects you from job loss or serious illness.

## Where to Keep Your Emergency Fund

Your emergency fund should be:
- **Accessible** — you need to reach it quickly in an emergency
- **Separate** — not mixed with your everyday spending account (out of sight, out of mind)
- **Safe** — not invested in stocks (which can lose value right when you need the money)

**Best options:**
- A **high-yield savings account (HYSA)** — earns more interest than a regular savings account while keeping money accessible. Online banks like Ally, Marcus, or Capital One 360 offer these.
- A separate savings account at your regular bank — less interest, but simple and convenient.

**Avoid:**
- Keeping it in cash at home (risk of theft or loss)
- Investing it in the stock market (too much risk)
- Mixing it with your checking account (you'll spend it)

> **Action step:** Open a separate savings account today, even if you can only deposit $20. The habit of saving matters more than the amount when you're starting out.`
      },
    ],
  },
  {
    title: "Banking and Credit in America",
    description: "Navigate the U.S. banking system, understand credit scores, and learn how to build credit responsibly.",
    order: 3,
    lessons: [
      {
        title: "Opening and Using a Bank Account",
        order: 1,
        content: `# Opening and Using a Bank Account

Having a bank account is one of the most important steps to financial stability in the United States. It allows you to receive direct deposit paychecks, pay bills easily, build a credit history, and keep your money safe.

## Types of Accounts

**Checking Account**
Used for everyday spending — paying bills, buying groceries, receiving your paycheck. Comes with a debit card. Money is available immediately.

**Savings Account**
Used for storing money you don't plan to spend right away. Earns a small amount of interest. Meant to be touched less frequently.

## How to Open an Account

Most banks require:
- A government-issued ID (passport, state ID, or driver's license)
- Your Social Security Number (SSN) or Individual Taxpayer Identification Number (ITIN)
- An initial deposit (often $25–$100, sometimes $0)

**If you don't have an SSN yet:** Some banks and credit unions accept an ITIN or foreign passport. Ask specifically about accounts for non-citizens or newcomers.

## Banking Options

- **Traditional banks** (Chase, Bank of America, Wells Fargo) — widespread ATMs and branches
- **Credit unions** — nonprofit, often lower fees, community-focused
- **Online banks** (Ally, Chime, Current) — no branches but lower fees and better savings rates
- **Second-chance banks** — if you've had banking problems before, these give you a fresh start

## Important Tips
- **Avoid overdraft fees** — these happen when you spend more than your balance. Opt out of overdraft coverage or keep a small buffer.
- **Watch for monthly fees** — many accounts are free if you meet minimum requirements (like direct deposit).
- **Use your bank's ATMs** to avoid out-of-network fees.`
      },
      {
        title: "Understanding Your Credit Score",
        order: 2,
        content: `# Understanding Your Credit Score

In the United States, your **credit score** is a number between 300 and 850 that tells lenders how reliably you repay debt. It affects your ability to rent an apartment, get a phone plan, take out a loan, and sometimes even get a job.

## Credit Score Ranges

| Score | Rating |
|-------|--------|
| 800–850 | Exceptional |
| 740–799 | Very Good |
| 670–739 | Good |
| 580–669 | Fair |
| Below 580 | Poor |

## What Makes Up Your Score?

| Factor | Weight |
|--------|--------|
| Payment history (do you pay on time?) | 35% |
| Amounts owed (how much of your credit limit are you using?) | 30% |
| Length of credit history | 15% |
| New credit (recent applications) | 10% |
| Credit mix (types of credit you have) | 10% |

## Building Credit as a Newcomer

Many immigrants arrive with no U.S. credit history, which makes it hard to get approved for anything. Here's how to start:

1. **Secured credit card** — You deposit money as collateral (e.g., $200) and get a card with that limit. Use it for small purchases and pay it off monthly.
2. **Credit-builder loan** — Offered by some credit unions. You make monthly payments into a savings account and build credit at the same time.
3. **Become an authorized user** — A family member or trusted friend adds you to their credit card account.
4. **Report rent payments** — Services like RentTrack or Experian RentBureau can add your rent payments to your credit report.

## How to Check Your Credit Score for Free

- **AnnualCreditReport.com** — federally mandated free reports from all three bureaus (Equifax, Experian, TransUnion) once per year
- **Credit Karma** — free ongoing monitoring
- Many credit cards now show your score for free in their app

> **Never pay to check your own credit score.** Checking your own score does NOT hurt it.`
      },
      {
        title: "Using Credit Wisely",
        order: 3,
        content: `# Using Credit Wisely

Credit is a powerful tool. Used well, it helps you build wealth, access housing, and handle emergencies. Used poorly, it can trap you in debt for years.

## The Golden Rules of Credit

**1. Pay your full balance every month**
If you pay your credit card balance in full by the due date, you pay zero interest. This is the most important habit in credit management.

**2. Keep your utilization below 30%**
Credit utilization is how much of your credit limit you're using. If your card has a $1,000 limit, try to keep your balance below $300. Lower is better for your score.

**3. Never miss a payment**
Set up autopay for at least the minimum payment so you never accidentally miss a due date. Late payments stay on your credit report for 7 years.

**4. Don't apply for too much credit at once**
Each application causes a "hard inquiry" that temporarily lowers your score. Space out applications by at least 6 months.

## Understanding Interest Rates (APR)

APR stands for Annual Percentage Rate — the yearly cost of borrowing money.

Example: If you have a $1,000 balance on a card with 24% APR and only make minimum payments, you could end up paying **hundreds of dollars in interest** and it could take years to pay off.

**The solution:** Only charge what you can pay off in full that month.

## When Credit Cards Are Dangerous

Credit cards become dangerous when:
- You treat them as extra income (they're not — it's borrowed money)
- You only make minimum payments
- You use them for impulse purchases
- You have multiple cards with balances

> **Remember:** Credit card companies make money when you carry a balance. Your goal is to use their card for free by paying it off every month.`
      },
    ],
  },
  {
    title: "The Power of Compound Interest",
    description: "Discover how money grows over time and why starting early is the most powerful financial decision you can make.",
    order: 4,
    lessons: [
      {
        title: "What Is Compound Interest?",
        order: 1,
        content: `# What Is Compound Interest?

Albert Einstein reportedly called compound interest "the eighth wonder of the world." Whether or not he said it, the sentiment is true — compound interest is one of the most powerful forces in personal finance.

## Simple Interest vs. Compound Interest

**Simple interest** is calculated only on the original amount (the principal).

Example: $1,000 at 5% simple interest for 3 years = $150 in interest ($50/year).

**Compound interest** is calculated on the principal *plus* the interest you've already earned. Your interest earns interest.

Example: $1,000 at 5% compound interest for 3 years:
- Year 1: $1,000 × 5% = $50 interest → Balance: $1,050
- Year 2: $1,050 × 5% = $52.50 interest → Balance: $1,102.50
- Year 3: $1,102.50 × 5% = $55.13 interest → Balance: $1,157.63

The difference seems small here, but over decades it becomes enormous.

## The Rule of 72

A quick way to estimate how long it takes to double your money:

**Divide 72 by your interest rate.**

- At 6% interest: 72 ÷ 6 = 12 years to double
- At 8% interest: 72 ÷ 8 = 9 years to double
- At 10% interest: 72 ÷ 10 = 7.2 years to double

## Compound Interest Works Against You Too

Credit card debt compounds the same way — but in reverse. A $5,000 credit card balance at 20% APR that you only make minimum payments on can take over 20 years to pay off and cost you thousands in interest.

> **Key insight:** Compound interest rewards patience and punishes procrastination. The earlier you start saving and investing, the more powerful it becomes.`
      },
      {
        title: "Why Starting Early Changes Everything",
        order: 2,
        content: `# Why Starting Early Changes Everything

Time is the most important ingredient in building wealth. Not income. Not investment returns. **Time.**

## The Story of Two Savers

**Maria** starts investing $200/month at age 25. She invests for 10 years (contributing $24,000 total) and then stops, leaving the money to grow until age 65.

**James** waits until age 35 to start investing $200/month. He invests for 30 years (contributing $72,000 total) until age 65.

Assuming 7% average annual return:

| | Maria | James |
|--|-------|-------|
| Monthly contribution | $200 | $200 |
| Years investing | 10 | 30 |
| Total contributed | $24,000 | $72,000 |
| Balance at 65 | ~$262,000 | ~$227,000 |

**Maria contributed one-third as much as James but ends up with more money** — simply because she started 10 years earlier.

## What This Means for You

Even if you can only save $25 or $50 per month right now, **starting today beats waiting until you earn more**. Here's why:

- Every dollar invested at 25 is worth roughly 15x more at 65 (at 7% return) than a dollar invested at 55
- You can't go back in time, but you can start now
- Small consistent investments outperform large infrequent ones

## For New Americans Starting Over

Many immigrants feel behind financially because they're starting over in a new country. The good news: time is still on your side. Starting a retirement account, even with small contributions, the day you're eligible is one of the best financial decisions you can make.

> **Action:** Even $25/month in a retirement account started today will be worth more than $100/month started five years from now. Begin as soon as you are able.`
      },
    ],
  },
  {
    title: "Investing Fundamentals",
    description: "Learn the basics of investing — what it is, how it works, and how to get started with confidence.",
    order: 5,
    lessons: [
      {
        title: "What Is Investing?",
        order: 1,
        content: `# What Is Investing?

**Saving** is putting money aside for future use, usually in a bank account. It's safe and accessible, but it grows slowly.

**Investing** is putting your money to work — buying assets that have the potential to grow in value over time. Investing involves more risk than saving, but historically produces much higher returns.

## Why Invest?

**Inflation** — the rising cost of goods over time — erodes the value of money sitting in a savings account. If inflation is 3% per year and your savings account earns 1%, you're actually losing purchasing power each year.

Investing in the stock market has historically returned an average of **7–10% per year** (after inflation, about 7%), far outpacing inflation.

## Types of Investments

**Stocks (Equities)**
Buying a stock means buying a tiny ownership stake in a company. If the company grows, your stock becomes more valuable. If it struggles, it can lose value. Individual stocks are high risk.

**Bonds (Fixed Income)**
Lending money to a government or company in exchange for regular interest payments. Generally safer than stocks but lower returns.

**Mutual Funds**
A collection of stocks and/or bonds pooled together. You buy shares of the fund and own a slice of all the assets inside. Reduces risk through diversification.

**Index Funds**
A type of mutual fund that tracks a market index (like the S&P 500 — the 500 largest U.S. companies). Low fees, broad diversification, and historically very strong performance. **Recommended for most new investors.**

**ETFs (Exchange-Traded Funds)**
Similar to index funds but traded on stock exchanges like individual stocks. Very popular and low-cost.

## The Key Principle: Diversification

"Don't put all your eggs in one basket." Owning many different investments means that when one falls, others may rise, reducing your overall risk.

> **Starting point:** Most financial experts recommend new investors start with a low-cost, diversified index fund — like one that tracks the entire U.S. stock market or the S&P 500.`
      },
      {
        title: "Risk, Return, and Time Horizon",
        order: 2,
        content: `# Risk, Return, and Time Horizon

Every investment involves a trade-off between **risk** (the chance of losing money) and **return** (the potential to gain money). Understanding this relationship is essential to investing wisely.

## The Risk-Return Spectrum

| Investment Type | Risk Level | Potential Return |
|----------------|-----------|-----------------|
| Savings account | Very Low | 4–5% (current high rates) |
| Government bonds | Low | 3–5% |
| Corporate bonds | Medium | 4–7% |
| Stock index funds | Medium-High | 7–10% average |
| Individual stocks | High | Highly variable |
| Cryptocurrency | Very High | Highly variable |

## Time Horizon: Your Most Important Factor

Your **time horizon** is how long you plan to keep your money invested before needing it.

**Short-term (0–3 years):** Keep money in savings or short-term bonds. You can't afford to lose value right before you need it.

**Medium-term (3–10 years):** A mix of stocks and bonds makes sense.

**Long-term (10+ years):** You can invest more heavily in stocks. Even if the market drops, you have time to recover and benefit from long-term growth.

## Volatility Is Normal

The stock market goes up and down constantly — sometimes dramatically. In 2020, the market dropped 34% in one month due to COVID-19. By year's end, it had fully recovered and was at all-time highs.

**The biggest investing mistake is panic-selling during downturns.** Investors who stayed invested through every crash in history recovered and came out ahead.

## Dollar-Cost Averaging

Investing the same amount on a regular schedule (like $50 every month) regardless of what the market is doing is called **dollar-cost averaging**. This strategy:
- Removes the temptation to "time the market"
- Automatically buys more shares when prices are low
- Builds a disciplined investing habit

> **The best time to invest was yesterday. The second best time is today. Start small, stay consistent, and let time do the work.**`
      },
      {
        title: "Index Funds: The Simple Path to Investing",
        order: 3,
        content: `# Index Funds: The Simple Path to Investing

For most people — especially those new to investing — index funds are the single best investment vehicle available. Here's why.

## What Is an Index Fund?

An index fund automatically tracks a financial market index, like the **S&P 500** (which includes the 500 largest U.S. companies like Apple, Amazon, Microsoft, and Google).

When you buy an S&P 500 index fund, you own a tiny piece of all 500 companies. If the U.S. economy grows, your investment grows with it.

## Why Index Funds Beat Most Alternatives

**Lower fees:** Actively managed funds pay analysts to pick stocks, charging 1–2% per year. Index funds charge as little as 0.03% per year. That difference compounds dramatically over time.

**Consistent performance:** Over 15+ year periods, index funds outperform roughly 90% of actively managed funds. Most professional fund managers cannot reliably beat the market.

**Simplicity:** You don't need to research individual companies or follow financial news. Buy and hold.

**Diversification built in:** You're automatically spread across hundreds of companies.

## Where to Buy Index Funds

- **Fidelity** — offers zero-expense-ratio index funds
- **Vanguard** — pioneer of index fund investing, very low fees
- **Charles Schwab** — low-cost, beginner friendly

Popular index funds to research:
- **FZROX** (Fidelity Zero Total Market) — 0% expense ratio
- **VOO** (Vanguard S&P 500 ETF) — 0.03% expense ratio
- **SWTSX** (Schwab Total Stock Market Index)

## Getting Started

1. Open a brokerage account (or a Roth IRA — see the retirement module)
2. Search for an index fund by ticker symbol (e.g., VOO)
3. Choose how much to invest
4. Set up automatic monthly contributions

> **You do not need to be wealthy to invest.** Many index funds allow you to start with as little as $1 (fractional shares). The important thing is to start.`
      },
    ],
  },
  {
    title: "Retirement Planning",
    description: "Understand U.S. retirement accounts — 401(k)s and IRAs — and learn why starting early is the most powerful financial decision you can make.",
    order: 6,
    lessons: [
      {
        title: "Why Retirement Planning Matters",
        order: 1,
        content: `# Why Retirement Planning Matters

Retirement may feel far away — especially if you're focused on building stability right now. But the decisions you make today about retirement savings will have a greater impact on your financial future than almost anything else.

## The U.S. Retirement System

Unlike some countries, the United States does not have a strong national pension system for most workers. Retirement security here is largely your personal responsibility, built from three sources:

1. **Social Security** — a government program you pay into through payroll taxes. You can claim it starting at age 62 (reduced) or 67 (full benefit). For most people, it covers only a fraction of living expenses.

2. **Employer-sponsored plans** — like a 401(k), where you contribute part of your paycheck to an investment account.

3. **Personal savings and investments** — IRAs and personal investment accounts.

## The Challenge for New Americans

Many immigrants:
- Are not aware of U.S. retirement accounts
- Start contributing later, missing years of compound growth
- May not have an employer that offers a 401(k)
- Worry that contributing to retirement means less money now

These concerns are valid. But even small contributions started early make an enormous difference. Waiting 10 years to start can cut your final retirement savings by more than half.

## Social Security and Immigrant Workers

If you work legally in the U.S. and pay Social Security taxes (FICA), you build credits toward future benefits — regardless of whether you were born here. After 10 years of work, most people qualify for benefits at retirement age.

> **Key mindset shift:** Retirement savings aren't money you're "losing" — they're money you're moving to your future self. And because of compound growth, that future self receives far more than you put in.`
      },
      {
        title: "Understanding the 401(k)",
        order: 2,
        content: `# Understanding the 401(k)

A **401(k)** is a retirement savings account offered by employers that comes with significant tax advantages. If your employer offers one, using it is one of the most powerful financial tools available to you.

## How a 401(k) Works

1. You choose a percentage of your paycheck to contribute (e.g., 5%)
2. That money is automatically deducted before taxes and placed in your 401(k) account
3. The money is invested — usually in mutual funds or index funds you select
4. The money grows tax-deferred — you don't pay taxes on it until you withdraw it in retirement

## The Employer Match — Free Money

Many employers will **match** your contributions up to a certain percentage. This is essentially free money added to your account.

**Example:** Your employer matches 50% of your contributions up to 6% of your salary.
- You earn $40,000/year
- You contribute 6% = $2,400/year
- Your employer adds 50% of that = $1,200/year
- **You get $1,200 for free just for participating**

**Always contribute at least enough to get the full employer match.** Not doing so is leaving free money on the table.

## Contribution Limits (2025)

- You can contribute up to **$23,500/year** to a 401(k)
- If you're 50 or older, you can contribute an additional $7,500 ("catch-up contribution")

## Traditional 401(k) vs. Roth 401(k)

Some employers offer both options:

**Traditional 401(k):** Contributions are pre-tax (reduce your taxable income now). You pay taxes when you withdraw in retirement.

**Roth 401(k):** Contributions are after-tax (no immediate tax benefit). Withdrawals in retirement are **tax-free**.

> **General rule:** If you expect to be in a higher tax bracket in retirement than you are now, a Roth is often better. If you're in a high tax bracket now, traditional may save you more.`
      },
      {
        title: "Understanding IRAs",
        order: 3,
        content: `# Understanding IRAs

An **IRA** (Individual Retirement Account) is a retirement savings account you open on your own — not through an employer. Anyone with earned income can open one, making it ideal if your employer doesn't offer a 401(k) or if you want to save beyond your 401(k).

## Two Main Types: Traditional vs. Roth

**Traditional IRA**
- Contributions may be tax-deductible (reduces your taxable income now)
- Money grows tax-deferred
- Withdrawals in retirement are taxed as ordinary income
- Required to start withdrawals at age 73

**Roth IRA**
- Contributions are made with after-tax dollars (no immediate deduction)
- Money grows completely **tax-free**
- Withdrawals in retirement are **100% tax-free**
- No required minimum distributions — your money can keep growing
- You can withdraw your *contributions* (not earnings) at any time penalty-free

## Why Most Young Earners Should Choose the Roth IRA

If you're early in your career and expect your income to grow:
- You're likely in a lower tax bracket now than you will be later
- Paying taxes now (Roth) at a lower rate beats paying later at a higher rate
- Tax-free growth for decades is extraordinarily powerful

## 2025 Contribution Limits

- $7,000/year (under age 50)
- $8,000/year (age 50 and older)
- Income limits apply for Roth IRA eligibility (phases out above ~$150,000 for single filers)

## Where to Open an IRA

- **Fidelity** — no account minimums, excellent tools
- **Vanguard** — low-cost index funds
- **Charles Schwab** — beginner-friendly interface

## For New Americans

You must have **earned income** (wages, self-employment income) to contribute to an IRA. You do not need to be a citizen — a valid work visa or green card qualifies you.

> **The Roth IRA is one of the best financial gifts you can give your future self. A 25-year-old who maxes out a Roth IRA ($7,000/year) could have over $1.5 million tax-free at age 65, assuming 7% average annual return.**`
      },
      {
        title: "Traditional vs. Roth: Which Is Right for You?",
        order: 4,
        content: `# Traditional vs. Roth: Which Is Right for You?

This is one of the most common questions in retirement planning. Both are excellent options — the difference is *when* you pay taxes.

## The Core Trade-Off

| | Traditional | Roth |
|--|------------|------|
| When you pay taxes | At withdrawal (retirement) | Now (contributions) |
| Tax benefit now | Yes (deduction) | No |
| Tax benefit in retirement | No (taxed on withdrawal) | Yes (tax-free) |
| Best if... | Tax rate is higher now | Tax rate will be higher later |

## Decision Framework

**Choose Traditional if:**
- You're in a high tax bracket now and expect a lower one in retirement
- You need the immediate tax deduction to afford to contribute
- You're close to retirement and want to defer taxes

**Choose Roth if:**
- You're early in your career (lower tax bracket now)
- You expect your income to grow significantly
- You value flexibility (can withdraw contributions penalty-free)
- You want tax-free income in retirement

**Do both if:**
- You've maxed out one type and can afford to contribute to both
- You're uncertain about future tax rates and want to hedge (tax diversification)

## The Backdoor Roth IRA

If your income exceeds the Roth IRA limits, there's a legal strategy called the **backdoor Roth IRA**: you contribute to a Traditional IRA (non-deductible) and then convert it to a Roth. This is more advanced — consult a financial advisor if you're in this situation.

## The Bottom Line

For most people starting out — especially immigrants who are early in their U.S. careers — the **Roth IRA is the recommended choice**. The ability to accumulate decades of tax-free growth is an extraordinary advantage.

> **Don't let the choice between Traditional and Roth prevent you from starting. Contributing to either one is vastly better than contributing to neither. Open an account today.**`
      },
    ],
  },
  {
    title: "Long-Term Financial Planning",
    description: "Set meaningful financial goals, build lasting wealth, and protect everything you've worked to create.",
    order: 7,
    lessons: [
      {
        title: "Setting Financial Goals",
        order: 1,
        content: `# Setting Financial Goals

A financial plan without clear goals is just a list of numbers. Goals give your money a purpose and give you motivation to stick to your plan even when it's hard.

## Types of Financial Goals

**Short-term goals (under 1 year)**
- Build a $1,000 emergency fund
- Pay off a small debt
- Save for a specific purchase

**Medium-term goals (1–5 years)**
- Save for a car (without a loan)
- Fund a semester of college
- Save for a security deposit on a better apartment

**Long-term goals (5+ years)**
- Buy a home
- Fund your children's education
- Retire comfortably

## Making Goals SMART

The most effective goals are **SMART:**
- **Specific** — "Save $3,000 for a used car" not "save money"
- **Measurable** — you can track progress
- **Achievable** — realistic given your income
- **Relevant** — matters to your life and values
- **Time-bound** — "by December 2026"

## Prioritizing Your Goals

When you have limited money, you must choose which goals come first. A common priority order:

1. Build a small emergency fund ($500–$1,000)
2. Get the full employer 401(k) match (free money)
3. Pay off high-interest debt (credit cards)
4. Build emergency fund to 3–6 months
5. Save for other goals (car, home, education)
6. Invest for retirement beyond the employer match

## Writing Down Your Goals

Research shows that people who write down their financial goals and review them regularly are significantly more likely to achieve them.

> **Exercise:** Write down one short-term, one medium-term, and one long-term financial goal. For each one, write the specific dollar amount and target date, then calculate how much you need to save per month to reach it.`
      },
      {
        title: "Protecting Your Financial Future",
        order: 2,
        content: `# Protecting Your Financial Future

Building wealth takes years of discipline and patience. Protecting it requires just a few key decisions.

## Insurance: Protection Against Catastrophe

Insurance prevents a single bad event from wiping out everything you've built.

**Health Insurance**
Medical bills are the leading cause of bankruptcy in the United States. If your employer offers health insurance, enroll — even if it costs something from your paycheck. If not, explore the ACA marketplace (healthcare.gov) for subsidized plans.

**Renters Insurance**
If you rent your home, renters insurance protects your belongings (furniture, electronics, clothing) against theft, fire, and water damage. It typically costs $10–$20/month — one of the best values in insurance.

**Auto Insurance**
Required by law in most states. Shop around for the best rate, but don't sacrifice liability coverage to save money.

**Life Insurance**
If others depend on your income (a spouse, children, or parents), term life insurance provides for them if you die unexpectedly. It's inexpensive when you're young and healthy.

**Disability Insurance**
Often overlooked: your ability to earn income is your greatest financial asset. Disability insurance replaces a portion of your income if you're injured or ill and can't work.

## Emergency Preparedness

Beyond insurance, stay financially resilient:
- Keep your emergency fund fully funded
- Avoid lifestyle inflation (just because you earn more doesn't mean you must spend more)
- Maintain a small buffer in your checking account
- Keep copies of important documents (ID, Social Security card, immigration documents, insurance policies)

## Building Wealth Over Generations

For many immigrants, building wealth isn't just about personal security — it's about changing the trajectory for their children and grandchildren.

**Generational wealth** starts with:
- Homeownership (building equity over time)
- Retirement accounts (tax-advantaged growth)
- Teaching children good money habits early
- Life insurance and a will to protect what you've built

> **Final reflection:** Financial security is not about being rich — it's about having choices. The ability to weather a crisis, to say no to a bad opportunity, to retire with dignity, and to help your family — that's what financial wellness looks like. Every step you've taken in this course moves you closer to that freedom.`
      },
    ],
  },
];

async function main() {
  // Update the course itself
  await prisma.course.update({
    where: { id: COURSE_ID },
    data: {
      title: "Financial Management for New Americans",
      description:
        "A practical guide to managing money, building savings, understanding the U.S. financial system, and planning for a secure future — designed specifically for refugee and immigrant students.",
      status: "PUBLISHED",
    },
  });
  console.log("Updated course.");

  // Delete the placeholder module
  await prisma.module.delete({ where: { id: OLD_MODULE_ID } });
  console.log("Removed placeholder module.");

  // Create all modules and lessons
  for (const mod of modules) {
    const { lessons, ...moduleData } = mod;
    const created = await prisma.module.create({
      data: { ...moduleData, courseId: COURSE_ID },
    });
    console.log(`  Created module: ${created.title}`);

    for (const lesson of lessons) {
      await prisma.lesson.create({
        data: { ...lesson, moduleId: created.id, type: "READING" },
      });
      console.log(`    Created lesson: ${lesson.title}`);
    }
  }

  console.log("\nDone! Course is live.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

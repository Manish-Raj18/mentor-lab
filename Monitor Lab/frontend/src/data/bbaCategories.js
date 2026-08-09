export const bbaCategories = [
  {
    slug: "management-strategy",
    icon: "♟",
    name: "Management & Strategy",
    desc: "Core principles of management, leadership and strategic decision-making.",
    image: "https://plus.unsplash.com/premium_photo-1664476845274-27c2dabdd7f0?w=900&auto=format&fit=crop&q=60",
    items: ["Principles of Management", "Organizational Behaviour", "Human Resource Management", "Strategic Management", "Business Ethics & Governance", "Entrepreneurship Development"],
  },
  {
    slug: "finance-accounts",
    icon: "📊",
    name: "Finance & Accounts",
    desc: "Financial literacy, accounting and taxation fundamentals for business.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&auto=format&fit=crop&q=60",
    items: ["Financial Accounting", "Cost Accounting", "Corporate Accounting", "Management Accounting", "Financial Management", "Income Tax Law & Practice"],
  },
  {
    slug: "analytics-tech",
    icon: "🔢",
    name: "Analytics & Tech",
    desc: "Mathematical, statistical and IT skills for data-driven business.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=60",
    items: ["Business Mathematics", "Business Statistics", "Research Methodology", "Operations Research", "Computer Applications & IT", "Management Information Systems"],
  },
  {
    slug: "marketing-dynamics",
    icon: "📣",
    name: "Marketing Dynamics",
    desc: "Understanding markets, consumers and modern digital commerce.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=60",
    items: ["Principles of Marketing", "Marketing Management", "Consumer Behavior Analysis", "E-Commerce & Digital Business", "International Business & EXIM"],
  },
  {
    slug: "environment-law",
    icon: "⚖️",
    name: "Environment & Law",
    desc: "Economics, legal frameworks and sustainability in business.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=60",
    items: ["Microeconomics", "Macroeconomics", "Business Environment", "Business Law / Legal Aspects", "Environmental Studies & CSR"],
  },
  {
    slug: "operations-practice",
    icon: "⚙️",
    name: "Operations & Practice",
    desc: "Operations, communication and hands-on industry experience.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&auto=format&fit=crop&q=60",
    items: ["Production & Operations Mgmt", "Logistics & Supply Chain", "Business Communication", "Corporate Summer Internship", "Final Capstone Project & Viva"],
  },
];

export const getBbaCategoryBySlug = (slug) =>
  bbaCategories.find((c) => c.slug === slug);

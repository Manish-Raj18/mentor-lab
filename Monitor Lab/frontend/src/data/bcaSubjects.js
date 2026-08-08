export const bcaCategories = [
  {
    slug: "programming-languages",
    icon: "💻",
    name: "Programming Languages",
    desc: "Core programming and web technologies used to build modern software.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=60",
    items: ["C Programming", "C++ Programming", "Java Programming", "Python Programming", "HTML & Web Design", "JavaScript", "CSS Styling"],
  },
  {
    slug: "logical-subjects",
    icon: "🧠",
    name: "Logical Subjects",
    desc: "Fundamental computer science concepts that power systems and algorithms.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=60",
    items: ["Database Management System", "Data Structures & Algorithms", "Operating Systems", "System Analysis & Design", "Computer Architecture", "Design & Analysis of Algorithms", "Computer Networks"],
  },
  {
    slug: "mathematics-subjects",
    icon: "📊",
    name: "Mathematics Subjects",
    desc: "The mathematical foundations required for analytical and computational thinking.",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=900&auto=format&fit=crop&q=60",
    items: [
      "Differential Calculus",
      "Integral Calculus",
      "Differential Equations",
      "Abstract Algebra",
      "Linear Algebra",
      "Matrix Algebra",
      "Analytical Geometry (3D)",
      "Probability Theory",
      "Probability Distributions",
      "Statistics & Central Tendency",
      "Measures of Variation",
      "Correlation Analysis",
      "Regression Analysis",
      "Sampling Distribution",
    ],
  },
];

export const getCategoryBySlug = (slug) =>
  bcaCategories.find((c) => c.slug === slug);

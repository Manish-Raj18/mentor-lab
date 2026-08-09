export const biotechCategories = [
  {
    slug: "foundation-sciences",
    icon: "🔬",
    name: "Foundation Sciences",
    desc: "Building core scientific and analytical foundations.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=900&auto=format&fit=crop&q=60",
    items: ["Cell Biology", "Genetics", "Molecular Biology", "Biochemistry", "Microbiology", "Physiology", "Developmental Biology", "Biomolecules", "Biostatistics"],
  },
  {
    slug: "core-biotechnology",
    icon: "🧬",
    name: "Core Biotechnology",
    desc: "Exploring key biochemical, molecular and engineering concepts.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&auto=format&fit=crop&q=60",
    items: ["Genetic Engineering", "Recombinant DNA Technology", "Bioprocess Engineering", "Enzyme Technology", "Industrial Biotechnology", "Plant Biotechnology", "Animal Biotechnology", "Medical Biotechnology", "Agricultural Biotechnology"],
  },
  {
    slug: "advanced-applied",
    icon: "🚀",
    name: "Advanced & Applied",
    desc: "Computational, applied and emerging areas of biotechnology.",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&auto=format&fit=crop&q=60",
    items: ["Environmental Biotechnology", "Bioinformatics", "Computational Biology", "Immunology", "Virology", "Genomics", "Biosafety & Bioethics", "Research Methodology", "Project Work & Internship"],
  },
];

export const getBiotechCategoryBySlug = (slug) =>
  biotechCategories.find((c) => c.slug === slug);

interface CategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

const CategoryPage = async ({
  params,
}: CategoryPageProps) => {
  const { category, subcategory } = await params;
  return (
    <main>
      <h1>
        {category}
        {subcategory}
      </h1>
    </main>
  );
};

export default CategoryPage;

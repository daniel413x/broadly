interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({
  params,
}: CategoryPageProps) => {
  const { category } = await params;
  return (
    <main>
      <h1>
        {category}
      </h1>
    </main>
  );
};

export default CategoryPage;

import CategoryDropdown from "./CategoryDropdown";
import { NoDocCategory } from "@/lib/data/types";

interface CategoriesProps {
  data: NoDocCategory[];
}

const Categories = ({
  data,
}: CategoriesProps) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center">
        {data.map((category: NoDocCategory) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

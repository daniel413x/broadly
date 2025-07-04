import { Checkbox } from "@/components/ui/common/shadcn/checkbox";
import { Tag as TagType } from "@/payload-types";

interface TagProps {
  tag: TagType;
  value?: string[] | null;
  onChange: (value: string) => void;
}

const Tag = ({
  tag,
  value,
  onChange,
}: TagProps) => {
  const handleOnClickFilter = () => {
    onChange(tag.name);
  };
  const isChecked = value?.includes(tag.name);
  return (
    <div
      className="flex items-center justify-between cursor-pointer relative">
      <button
        key={tag.id}
        onClick={handleOnClickFilter}
        className="absolute w-full h-full"
      />
      <span className="font-medium">
        {tag.name}
      </span>
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleOnClickFilter}
        tabIndex={-1}
      />
    </div>
  );
};

export default Tag;

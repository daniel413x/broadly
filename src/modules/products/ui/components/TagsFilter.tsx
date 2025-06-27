"use client";

import { DEFAULT_LIMIT } from "@/lib/data/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import Tag from "./Tag";

interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

const TagsFilter = ({
  value,
  onChange,
}: TagsFilterProps) => {
  const trpc = useTRPC();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
      },
    }
  ));
  const handleOnClickFilter = (tag: string) => {
    let tags: string[];
    // remove tag
    if (value?.includes(tag)) {
      tags = value?.filter((t) => t !== tag) || [];
      // add tag
    } else {
      tags = [...value || [], tag];
    }
    onChange(tags);
  };
  const handleOnClickNextPage = () => {
    fetchNextPage();
  };
  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) => 
          page.docs.map((tag) => (
            <Tag
              onChange={handleOnClickFilter}
              tag={tag}
              value={value}
              key={tag.id}
            />
          )))
      )}
      {!hasNextPage ? null : (
        <button
          disabled={isFetchingNextPage}
          onClick={handleOnClickNextPage}
          className="underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer"
        >
          Load more...
        </button>
      )}
    </div>
  );
};

export default TagsFilter;

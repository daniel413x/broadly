"use client";

import { useState } from "react";
import { z } from "zod";
import { ReviewsGetOneOutput } from "@/lib/data/types";
import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/common/shadcn/form";
import { Textarea } from "@/components/ui/common/shadcn/textarea";
import { Button } from "@/components/ui/common/shadcn/button";
import StarPicker from "@/components/ui/common/StarPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TRPCClientErrorLike } from "@trpc/client";

interface ReviewFormProps {
  productId: string;
  initialData?: ReviewsGetOneOutput;
}

const formSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});

const ReviewForm = ({
  productId,
  initialData,
}: ReviewFormProps) => {
  const trpc = useTRPC();
  const [isPreview, setIsPreview] = useState(!!initialData);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });
  const queryClient = useQueryClient();
  const onSuccess = () => {
    queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
      productId,
    }));
    setIsPreview(true);
  };
  const onError = (error: TRPCClientErrorLike<any>) => {
    toast.error(error.message);
  };
  const createReview = useMutation(trpc.reviews.create.mutationOptions({
    onSuccess,
    onError,
  }));
  const updateReview = useMutation(trpc.reviews.update.mutationOptions({
    onSuccess,
    onError,
  }));
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        rating: data.rating,
        description: data.description,
      });
    } else {
      createReview.mutate({
        productId,
        rating: data.rating,
        description: data.description,
      });
    }
  };
  const handleClickEdit = () => {
    setIsPreview(false);
  };
  let prompt = "Liked it? Give it a rating";
  if (initialData) {
    prompt = "You rated this product:";
  }
  if (initialData && !isPreview) {
    prompt = "Update your rating:";
  }
  // const prompt = initialData ? "Your rating:" : "Liked it? Give it a rating";
  const renderDescriptionAsParagraph = initialData && isPreview;
  const disableFormElements = createReview.isPending || updateReview.isPending;
  return (
    <Form {...form}>
      <form className={cn("flex flex-col gap-y-4", {
        "opacity-50": disableFormElements,
      })} onSubmit={form.handleSubmit(onSubmit)}>
        <p className="font-medium">
          {prompt}
        </p>
        <FormField control={form.control} name="rating" render={(({ field }) => (
          <FormItem>
            <FormControl>
              <StarPicker
                value={field.value}
                onChange={field.onChange}
                disabled={isPreview}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        ))} />
        {/* either render description as a <p> with styling simllar to the text area or render the text area field iteself */}
        {renderDescriptionAsParagraph ? (
          <p className="py-2 px-3">
            {initialData.description}
          </p>
        ) : (
          <FormField control={form.control} name="description" render={(({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Want to leave a written review?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          ))} />
        )}
        {!isPreview && (
          <Button
            variant="elevated"
            type="submit"
            size="lg"
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            Submit
          </Button>
        )}
      </form>
      {!isPreview ? null : (
        <Button onClick={handleClickEdit} size="lg" type="button" variant="elevated" className="w-fit mt-4">
          Edit
        </Button>
      )}
    </Form>
  );
};

export const ReviewFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <p className="font-medium">
        ...
      </p>
      <StarPicker
        disabled
      />
      <Textarea
        disabled
        placeholder="Want to leave a written review?"
      />
      <Button
        variant="elevated"
        disabled
        type="button"
        size="lg"
        className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
      >
        Submit
      </Button>
    </div>
  );
};

export default ReviewForm;

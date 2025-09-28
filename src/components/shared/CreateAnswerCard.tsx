"use client";

import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

const answerFormSchema = z.object({
  body: z.string().min(1, "Minimum 1 karakter yah").max(500),
});

type AnswerFormSchema = z.infer<typeof answerFormSchema>;

type CreateAnswerCardProps = {
  postId: string;
};

export const CreateAnswerCard = (props: CreateAnswerCardProps) => {
  const { data: session } = useSession();

  const form = useForm<AnswerFormSchema>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: {
      body: "",
    },
  });

  const apiUtils = api.useUtils();

  const createAnswerMutation = api.answer.createAnswer.useMutation({
    onSuccess: async () => {
      alert("Answer submitted!");

      form.reset();

      await apiUtils.answer.getAnswersByPostId.invalidate({
        postId: props.postId,
      });
    },
  });

  const getAnswersQuery = api.answer.getAnswersByPostId.useQuery({
    postId: props.postId,
  });

  const handleSubmitAnswer = (values: AnswerFormSchema) => {
    createAnswerMutation.mutate({
      body: values.body,
      postId: props.postId,
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">
        {getAnswersQuery.data?.length ?? 0} Answers
      </h3>

      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex gap-4">
              <Avatar className="size-12">
                <AvatarImage src={session?.user.image ?? ""} />
                <AvatarFallback>
                  {session?.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        placeholder="Your answer..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              disabled={createAnswerMutation.isPending}
              onClick={form.handleSubmit(handleSubmitAnswer)}
            >
              {createAnswerMutation.isPending
                ? "Submitting..."
                : "Submit Answer"}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
};

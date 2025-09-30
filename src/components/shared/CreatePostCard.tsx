"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { signIn, useSession } from "next-auth/react";

const createPostFormSchema = z.object({
  title: z.string().min(10, "Tanya yg bener woi!").max(100, "Maksimum 100 huruf aja wok!"),
  description: z.string().min(50, "dikit amat nanya nya!").max(1000, "Gausah nyepam kocak"),
});

type CreatePostFormSchema = z.infer<typeof createPostFormSchema>;

export const CreatePostCard = () => {
  const { data: session } = useSession();
  const form = useForm<CreatePostFormSchema>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: { title: "", description: "" },
  });

  const apiUtils = api.useUtils();

  const createPostMutation = api.post.createPost.useMutation({
    onSuccess: async () => {
      alert("Created Post!");
      form.reset();

      await apiUtils.post.getPostPaginated.invalidate();
    },
  });

  const handleCreatePost = (values: CreatePostFormSchema) => {
    createPostMutation.mutate({
      title: values.title,
      description: values.description,
    });
  };

  const handleLogin = async () => {
    await signIn("google");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreatePost)} className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Ask a question</CardTitle>
          </CardHeader>

          {!!session ? (
            <CardContent>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
                <Avatar className="size-14 shrink-0 sm:self-start">
                  <AvatarFallback>
                    {session.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={session.user.image ?? ""} />
                </Avatar>

                <div className="w-full space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Title of your question..."
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pertanyaan</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-24 w-full"
                            placeholder="Details of your question.."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <div className="space-y-4 text-center">
                <p className="text-xl">
                  You have to be signed in to ask Darrell a question.
                </p>
                <Button onClick={handleLogin} size="lg">
                  Sign In
                </Button>
              </div>
            </CardContent>
          )}
          {!!session && (
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending
                  ? "Submitting Post..."
                  : "Submit Question"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </Form>
  );
};

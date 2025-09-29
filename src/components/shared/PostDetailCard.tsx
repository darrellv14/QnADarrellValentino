"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { Skeleton } from "../ui/skeleton";

type postDetailCard = {
  postId: string;
  userImage: string;
  username: string;
  createdAt: Date;
  isAnswered: boolean;
  title: string;
  description: string;
};

export const PostDetailCard = (props: postDetailCard) => {
  const apiUtils = api.useUtils();

  const getPostByIdQuery = api.post.getPostById.useQuery({
    postId: props.postId,
  });

  const markAsAnsweredMutation = api.post.markAsAnswered.useMutation({
    onSuccess: async () => {
      alert("mark as answered");

      await apiUtils.post.getPostById.invalidate({ postId: props.postId });
    },
  });

  const handleMarkAsAnswered = () => {
    markAsAnsweredMutation.mutate({ postId: props.postId });
  };

  return (
    <div className="space-y-6 rounded-xl border p-6 shadow">
      {/* header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            <AvatarImage src={props.userImage ?? ""} />
            <AvatarFallback>
              {props.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-0.5">
            <Link href={"/profile/" + props.username}>
              <p className="font-medium">{props.username}</p>
            </Link>
            <p className="text-muted-foreground text-sm">
              {props.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        {getPostByIdQuery.isLoading ? (
          <Skeleton className="h-6 w-20" />
        ) : getPostByIdQuery.data?.answeredAt ? (
          <Badge variant="default" className="h-fit">
            Answered
          </Badge>
        ) : (
          <Badge variant="secondary" className="h-fit">
            Unanswered
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{props.title}</h1>
        <p>{props.description}</p>
      </div>

      {!getPostByIdQuery.data?.answeredAt && (
        <div className="flex justify-end border-t p-4">
          <Button
            onClick={handleMarkAsAnswered}
            disabled={markAsAnsweredMutation.isPending}
            variant="secondary"
          >
            Mark as Answered
          </Button>
        </div>
      )}
    </div>
  );
};

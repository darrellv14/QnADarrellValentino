"use client";

import { api } from "~/trpc/react";
import { PostCard } from "./PostCard";

export const HomePostList = () => {
  const postsQuery = api.post.getAllPosts.useQuery();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Recent Questions</h2>

      {/* List of Posts */}
      <div className="space-y-3">
        {postsQuery.data?.map((post) => {
          return (
            <PostCard
              id={post.id}
              createdDate={post.createdAt}
              description={post.description}
              title={post.title}
              status="UNANSWERED"
              totalComments={0}
              username={post.author.username ?? ""}
              userImage={post.author.image ?? ""}
              key={post.id}
            />
          );
        })}

        <PostCard
          createdDate={new Date()}
          id="123"
          description="ini desc"
          title="ini title"
          status="UNANSWERED"
          totalComments={0}
          userImage=""
          username="darrell.valentino14"
        />
      </div>
    </div>
  );
};

import type { Metadata } from "next";
import { cache } from "react";
import { AnswerList } from "~/components/shared/AnswerList";
import { CreateAnswerCard } from "~/components/shared/CreateAnswerCard";
import { PostDetailCard } from "~/components/shared/PostDetailCard";
import { api } from "~/trpc/server";

const getPostDetail = cache(async (postId: string) => {
  const postDetail = await api.post.getPostById({ postId });
  return postDetail;
});

type PostDetailProps = {
  params: Promise<{ postId: string }>;
};

export const generateMetadata = async ({
  params,
}: PostDetailProps): Promise<Metadata> => {
  const { postId } = await params;
  const postDetail = await api.post.getPostById({ postId });

  return {
    title: `${postDetail?.title} | QnA Forum`,
    description: postDetail?.description,
  };
};

export default async function PostDetail({ params }: PostDetailProps) {
  const { postId } = await params;

  const postDetail = await getPostDetail(postId);

  return (
    <div className="space-y-8">
      {/* Post Detail Card */}
      <PostDetailCard
        postId={postId}
        createdAt={postDetail?.createdAt ?? new Date()}
        description={postDetail?.description ?? ""}
        title={postDetail?.title ?? ""}
        username={postDetail?.author.username ?? ""}
        userImage={postDetail?.author.image ?? ""}
        isAnswered={!!postDetail?.answeredAt}
      />

      <CreateAnswerCard postId={postId} />
      <AnswerList postId={postId} />
    </div>
  );
}

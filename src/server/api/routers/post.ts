import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const newPost = await db.post.create({
        data: {
          title: input.title,
          description: input.description,
          userId: session?.user.id,
        },
      });
      return newPost;
    }),

  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const posts = await db.post.findMany({
      select: {
        id: true,
        description: true,
        title: true,
        author: {
          select: {
            username: true,
            image: true,
          },
        },
        createdAt: true,
      },
    });
    return posts;
  }),

  getPostById: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { postId } = input;
      const postDetail = await db.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          title: true,
          description: true,
          createdAt: true,
          answeredAt: true,
          author: {
            select: {
              username: true,
              image: true,
            },
          },
        },
      });
      return postDetail;
    }),

  getPostPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(2),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { cursor, limit } = input;
      const posts = await db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          description: true,
          title: true,
          author: {
            select: {
              username: true,
              image: true,
            },
          },
          createdAt: true,
          answeredAt: true,
          _count: { select: { answers: true } },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      const formattedPosts = posts.map(p => ({
        ...p,
        totalComments: p._count.answers,
      }));

      return {
        posts: formattedPosts,
        nextCursor,
      };
    }),

  markAsAnswered: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const updatedPost = await db.post.update({
        where: {
          id: input.postId,
          userId: session?.user.id,
        },
        data: {
          answeredAt: new Date(),
        },
      });
      return updatedPost;
    }),
});

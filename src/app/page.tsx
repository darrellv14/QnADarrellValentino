import { CreatePostCard } from "~/components/shared/CreatePostCard";
import { HomePostList } from "~/components/shared/HomePostList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page | Aspirasi Darrell",
  description: "Home page dari aplikasi Aspirasi Darrell",
};

export default async function Home() {
  return (
    <main className="space-y-8">
      <div className="space-y-1 px-4 sm:px-0">
        <h1 className="text-4xl font-bold">Ask Darrell Valentino</h1>
        <p className="text-muted-foreground">
          Ask questions for Darrell Valentino
        </p>
      </div>

      <div className="space-y-8 px-4 sm:px-0">
        <CreatePostCard />
        <HomePostList />
      </div>
    </main>
  );
}

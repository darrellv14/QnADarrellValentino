import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { MessageSquareMore } from "lucide-react";

type PostCardProps = {
  id: string;
  userImage: string;
  username: string;
  createdDate: Date;
  title: string;
  description: string;
  totalComments: number;
  isAnswered: boolean;
};

export const PostCard = ({
  id,
  userImage,
  username,
  createdDate,
  title,
  description,
  totalComments,
  isAnswered,
}: PostCardProps) => {
  const postDetailUrl = `/post/${id}`;

  return (
    <div className="space-y-4 rounded-xl border p-6 shadow">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            <AvatarImage src={userImage} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <Link href={`/profile/${username}`}>
              <p
                className="inline-block max-w-[13ch] truncate font-medium md:max-w-none"
                title={username}
              >
                {username}
              </p>
            </Link>
            <p className="text-sm text-muted-foreground">
              {createdDate.toLocaleDateString()}
            </p>
          </div>
        </div>
        {isAnswered ? (
          <Badge variant="default" className="h-fit">
            Answered
          </Badge>
        ) : (
          <Badge variant="secondary" className="h-fit">
            Unanswered
          </Badge>
        )}
      </div>

      <Link href={postDetailUrl} className="group">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold group-hover:text-primary">
            {title}
          </h3>
          <p className="text-sm">{description}</p>
        </div>
      </Link>

      <div className="mt-4 flex justify-between border-t pt-3">
        <div className="flex gap-1 text-sm text-muted-foreground">
          <MessageSquareMore className="size-4" /> {totalComments} Comments
        </div>
        <Link href={postDetailUrl} className="text-sm text-primary">
          View Post
        </Link>
      </div>
    </div>
  );
};

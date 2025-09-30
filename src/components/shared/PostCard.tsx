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

export const PostCard = (props: PostCardProps) => {
  const postDetailUrl = "/post/" + props.id;
  return (
    <div className="space-y-4 rounded-xl border p-6 shadow">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            <AvatarImage src={props.userImage} />
            <AvatarFallback>
              {props.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <Link href={"/profile/" + props.username}>
              <p className="font-medium">{props.username}</p>
            </Link>
            <p className="text-muted-foreground text-sm">
              {props.createdDate.toLocaleDateString()}
            </p>
          </div>
        </div>
        {props.isAnswered ? (
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
          <h3 className="group-hover:text-destructive text-lg font-semibold">
            {props.title}
          </h3>
          <p className="text-sm">{props.description}</p>
        </div>
      </Link>
      <div className="mt-4 flex justify-between border-t pt-3">
        <div className="text-muted-foreground flex gap-1 text-sm">
          <MessageSquareMore className="size-4" /> {props.totalComments} Comments
        </div>
        <Link href={postDetailUrl} className="text-primary text-sm">
          View Post
        </Link>
      </div>
    </div>
  );
};

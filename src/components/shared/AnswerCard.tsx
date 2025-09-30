import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type AnswerCardProps = {
  id: string;
  username: string;
  createdDate: Date;
  userImage: string;
  body: string;
};

export const AnswerCard = (props: AnswerCardProps) => {
  return (
    <div className="space-y-4 rounded-xl border p-6 shadow">
      <div className="flex items-center gap-2">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-full">
          <AvatarImage
            src={props.userImage ?? ""}
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="h-full w-full flex items-center justify-center text-sm sm:text-base font-medium">
            {props.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="font-medium">{props.username}</p>
          <p className="text-sm text-muted-foreground">
            {props.createdDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div>
        <p>{props.body}</p>
      </div>
    </div>
  );
};

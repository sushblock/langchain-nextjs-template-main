import { Avatar, AvatarImage } from "@/components/ui/avatar";

const BotAvatar: React.FC = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage className="p-1" src="/logo.png" />
    </Avatar>
  );
};

export default BotAvatar;

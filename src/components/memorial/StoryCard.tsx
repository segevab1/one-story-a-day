
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Share2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Facebook, Instagram } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface StoryData {
  id: string;
  name: string;
  age: number;
  date: string;
  unit: string;
  story: string;
  image: string;
  candlesLit: number;
  contact: {
    email: string;
    phone: string;
  };
}

interface StoryCardProps {
  story: StoryData;
  onLightCandle: () => void;
  hasLitCandle: boolean;
}

export const StoryCard = ({ story, onLightCandle, hasLitCandle }: StoryCardProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `סיפור אחד ביום - ${story.name}`,
        text: `הצטרפו אלי להדלקת נר זיכרון לזכרו של ${story.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      toast({
        title: "שיתוף לא נתמך",
        description: "הדפדפן שלך לא תומך בשיתוף ישיר.",
      });
    }
  };

  return (
    <Card className="fade-slide-in">
      <CardHeader className="text-center space-y-4">
        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-primary">
          <img
            src={story.image}
            alt={story.name}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              console.error('Image failed to load:', story.image);
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{story.name}</h2>
          <p className="text-lg text-muted-foreground">
            {story.unit} | גיל {story.age}
          </p>
          <p className="text-sm text-muted-foreground">
            נפל ב-{story.date}
          </p>
        </div>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-md text-white mb-6 leading-relaxed">{story.story}</p>

        <div className="flex justify-center space-x-4">
          <Button onClick={onLightCandle} disabled={hasLitCandle}>
            <Flame className="mr-2 h-4 w-4" />
            הדלקת נר
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <Share2 className="mr-2 h-4 w-4" />
                שתף
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                שתף קישור
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Facebook className="mr-2 h-4 w-4" />
                שתף בפייסבוק
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Instagram className="mr-2 h-4 w-4" />
                שתף באינסטגרם
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

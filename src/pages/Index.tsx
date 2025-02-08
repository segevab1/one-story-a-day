
import { useState } from "react";
import { Flame, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Index = () => {
  const [candlesLit, setCandlesLit] = useState(0);
  const { toast } = useToast();
  
  // Example story data
  const story = {
    id: "1",
    name: "סגן דוד כהן",
    age: 23,
    date: "7.10.2023",
    unit: "חטיבת גולני",
    story: "דוד היה מפקד מצטיין, אהוב על חייליו ומסור למשפחתו. הוא נפל בקרב בעת הגנה על יישובי עוטף עזה.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    candlesLit: 342
  };

  const handleLightCandle = () => {
    setCandlesLit(prev => prev + 1);
    toast({
      title: "נר הודלק לזכרו",
      description: `הדלקת נר לזכרו של ${story.name}`,
    });
  };

  const handleShare = async () => {
    const shareText = `היום הנצחתי את ${story.name} באתר 'סיפור אחד ביום', כנסו לקרוא ולהדליק נר לזכרו`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `לזכרו של ${story.name}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      toast({
        title: "הטקסט הועתק",
        description: "הטקסט הועתק ללוח. תוכל להדביק אותו בכל מקום.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-assistant p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">סיפור אחד ביום</h1>
          <p className="text-muted-foreground">לזכר חללי צה״ל במלחמת חרבות ברזל</p>
        </header>

        <Card className="memorial-card overflow-hidden animate-slide-up">
          <div className="relative aspect-video">
            <img 
              src={story.image} 
              alt={story.name}
              className="object-cover w-full h-full brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          
          <CardHeader className="space-y-2">
            <h2 className="text-3xl font-bold text-gradient-gold">{story.name}</h2>
            <p className="text-muted-foreground">
              {story.age} | {story.unit} | {story.date}
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            <p className="text-lg leading-relaxed">
              {story.story}
            </p>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <Button
                onClick={handleLightCandle}
                className="candle-animation hover:scale-105"
                variant="outline"
              >
                <Flame className={`mr-2 ${candlesLit > 0 ? "candle-lit" : ""}`} />
                <span>הדלקת נר</span>
                <span className="mr-2 text-muted-foreground">| {candlesLit}</span>
              </Button>

              <Button
                onClick={handleShare}
                variant="ghost"
                className="hover:text-primary transition-colors"
              >
                <Share2 className="mr-2" />
                <span>שיתוף</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

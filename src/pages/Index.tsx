
import { useState } from "react";
import { Flame, Share2, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [candlesLit, setCandlesLit] = useState(0);
  const { toast } = useToast();
  
  // Expanded stories data with more detailed narratives
  const stories = [
    {
      id: "1",
      name: "סגן דוד כהן",
      age: 23,
      date: "7.10.2023",
      unit: "חטיבת גולני",
      story: `דוד היה בן יחיד להוריו רחל ומשה מחיפה. מילדותו בלט בכישוריו המנהיגותיים ואהבתו הגדולה לארץ ישראל. בתיכון היה יושב ראש מועצת התלמידים והתנדב במד"א. התגייס לגולני מתוך בחירה ועבר קורס קצינים בהצטיינות.

דוד נפל בקרב ב-7 באוקטובר, כשפיקד על כוח שנשלח לחלץ משפחות ביישובי עוטף עזה. למרות פציעתו, המשיך לפקד על חייליו ולסייע בחילוץ אזרחים עד שנפל. על גבורתו בקרב הוענק לו צל"ש לאחר מותו.`,
      image: "/soldiers/soldier1.jpg",
      candlesLit: 342
    },
    {
      id: "2",
      name: "סמ״ר יובל רוזן",
      age: 21,
      date: "8.10.2023",
      unit: "סיירת מטכ״ל",
      story: `יובל גדל בתל אביב, בן בכור למשפחת רוזן. מגיל צעיר התעניין בספורט ובמוזיקה, ניגן בגיטרה והיה חבר בלהקת בית הספר. התנדב לסיירת מטכ"ל והצטיין באימונים.

בבוקר ה-8 באוקטובר, יובל וצוותו הוזנקו למושב נתיב העשרה בעקבות דיווח על חדירת מחבלים. במהלך הקרב להגנת המושב, זיהה יובל מחבלים שהתקרבו לבית משפחה. הוא חיפה על חבריו ואפשר פינוי בטוח של המשפחה, אך נפגע מירי צלפים.`,
      image: "/soldiers/soldier2.jpg",
      candlesLit: 256
    },
    {
      id: "3",
      name: "סמ״ר שירה לוי",
      age: 20,
      date: "7.10.2023",
      unit: "8200",
      story: `שירה, תושבת ירושלים, הייתה מצטיינת בלימודי המחשב והמתמטיקה. התנדבה לשרת ביחידה 8200 והייתה חלק מצוות פיתוח מערכות הגנה סייבר.

בשבת ה-7 באוקטובר, למרות שהייתה בחופשה, התעקשה לחזור לבסיס כששמעה על המתקפה. בדרכה לבסיס, נתקלה בירי טילים. עצרה לסייע למשפחה שנפגעה בצד הדרך, ונהרגה מפגיעת רקטה בעת שחבשה פצועים.`,
      image: "/soldiers/soldier3.jpg",
      candlesLit: 189
    }
  ];

  // Choose a random story on component mount
  const [currentStory] = useState(() => {
    const randomIndex = Math.floor(Math.random() * stories.length);
    return stories[randomIndex];
  });

  const handleLightCandle = () => {
    setCandlesLit(prev => prev + 1);
    toast({
      title: "נר הודלק לזכרו",
      description: `הדלקת נר לזכרו של ${currentStory.name}`,
    });
  };

  const handleShare = async (platform: 'facebook' | 'instagram' | 'whatsapp') => {
    const shareText = `היום הנצחתי את ${currentStory.name} באתר 'סיפור אחד ביום', כנסו לקרוא ולהדליק נר לזכרו`;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareText);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, we'll copy to clipboard instead
        navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        toast({
          title: "הטקסט הועתק",
          description: "הטקסט הועתק ללוח. תוכל להדביק אותו באינסטגרם.",
        });
        return;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
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
              src={currentStory.image} 
              alt={currentStory.name}
              className="object-cover w-full h-full brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          
          <CardHeader className="space-y-2">
            <h2 className="text-3xl font-bold text-gradient-gold">{currentStory.name}</h2>
            <p className="text-muted-foreground">
              {currentStory.age} | {currentStory.unit} | {currentStory.date}
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="text-lg leading-relaxed whitespace-pre-line">
              {currentStory.story}
            </div>

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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:text-primary transition-colors">
                    <Share2 className="mr-2" />
                    <span>שיתוף</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
                    <Facebook className="ml-2" size={18} />
                    <span>פייסבוק</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('instagram')} className="cursor-pointer">
                    <Instagram className="ml-2" size={18} />
                    <span>אינסטגרם</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
                    <MessageCircle className="ml-2" size={18} />
                    <span>וואטסאפ</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

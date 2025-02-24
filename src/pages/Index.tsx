
import { useState, useEffect } from "react";
import { Flame, Share2, Facebook, Instagram, MessageCircle, UserPlus, ChevronLeft, ChevronRight, Mail, Phone, Sun, Moon, LogIn } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// ייבוא התמונות באופן סטטי
const IMAGES = {
  soldier1: new URL('/images/soldier1.webp', import.meta.url).href,
  soldier2: new URL('/images/soldier2.webp', import.meta.url).href,
  soldier3: new URL('/images/soldier3.webp', import.meta.url).href,
  soldier4: new URL('/images/soldier4.webp', import.meta.url).href,
};

const Index = () => {
  const [candlesLit, setCandlesLit] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [litCandles, setLitCandles] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const stories = [
    {
      id: "1",
      name: "סגן דוד כהן",
      age: 23,
      date: "7.10.2023",
      unit: "חטיבת גולני",
      story: `דוד היה בן יחיד להוריו רחל ומשה מחיפה. מילדותו בלט בכישוריו המנהיגותיים ואהבתו הגדולה לארץ ישראל. בתיכון היה יושב ראש מועצת התלמידים והתנדב במד"א. התגייס לגולני מתוך בחירה ועבר קורס קצינים בהצטיינות.

דוד נפל בקרב ב-7 באוקטובר, כשפיקד על כוח שנשלח לחלץ משפחות ביישובי עוטף עזה. למרות פציעתו, המשיך לפקד על חייליו ולסייע בחילוץ אזרחים עד שנפל. על גבורתו בקרב הוענק לו צל"ש לאחר מותו.`,
      image: IMAGES.soldier1,
      candlesLit: 342,
      contact: {
        email: "cohen.family@example.com",
        phone: "054-1234567"
      }
    },
    {
      id: "2",
      name: "סמ״ר יובל רוזן",
      age: 21,
      date: "8.10.2023",
      unit: "סיירת מטכ״ל",
      story: `יובל גדל בתל אביב, בן בכור למשפחת רוזן. מגיל צעיר התעניין בספורט ובמוזיקה, ניגן בגיטרה והיה חבר בלהקת בית הספר. התנדב לסיירת מטכ"ל והצטיין באימונים.

בבוקר ה-8 באוקטובר, יובל וצוותו הוזנקו למושב נתיב העשרה בעקבות דיווח על חדירת מחבלים. במהלך הקרב להגנת המושב, זיהה יובל מחבלים שהתקרבו לבית משפחה. הוא חיפה על חבריו ואפשר פינוי בטוח של המשפחה, אך נפגע מירי צלפים.`,
      image: IMAGES.soldier2,
      candlesLit: 256,
      contact: {
        email: "rozen.memory@example.com",
        phone: "054-7654321"
      }
    },
    {
      id: "3",
      name: "סמ״ר שירה לוי",
      age: 20,
      date: "7.10.2023",
      unit: "8200",
      story: `שירה, תושבת ירושלים, הייתה מצטיינת בלימודי המחשב והמתמטיקה. התנדבה לשרת ביחידה 8200 והייתה חלק מצוות פיתוח מערכות הגנה סייבר.

בשבת ה-7 באוקטובר, למרות שהייתה בחופשה, התעקשה לחזור לבסיס כששמעה על המתקפה. בדרכה לבסיס, נתקלה בירי טילים. עצרה לסייע למשפחה שנפגעה בצד הדרך, ונהרגה מפגיעת רקטה בעת שחבשה פצועים.`,
      image: IMAGES.soldier3,
      candlesLit: 189,
      contact: {
        email: "levi.memorial@example.com",
        phone: "054-9876543"
      }
    },
    {
      id: "4",
      name: "רב״ט אדם ברק",
      age: 19,
      date: "7.10.2023",
      unit: "חטיבת הנח״ל",
      story: `אדם היה ספורטאי מחונן ושחקן נבחרת הנוער בכדורסל. למרות שיכול היה לקבל פטור ספורטאי מצטיין, התעקש להתגייס לקרבי. שירת בגדוד 50 של הנח"ל והיה מצטיין מחלקתי.

בבוקר השבת השחורה, היה בין הראשונים שהגיעו לקיבוץ בארי. נלחם בגבורה מול מחבלים שחדרו לקיבוץ, חילץ משפחה שלמה ממרחב מוגן, אך נפגע בחילופי האש האחרונים.`,
      image: IMAGES.soldier4,
      candlesLit: 167,
      contact: {
        email: "barak.family@example.com",
        phone: "054-3216549"
      }
    }
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = stories[currentStoryIndex];

  const handleLightCandle = () => {
    if (litCandles.has(currentStory.id)) {
      toast({
        title: "כבר הדלקת נר לזכרו של חלל זה",
      });
      return;
    }

    setCandlesLit((prevCandlesLit) => prevCandlesLit + 1);
    setLitCandles((prevLitCandles) => new Set(prevLitCandles.add(currentStory.id)));

    toast({
      title: "הדלקת נר זיכרון",
      description: `הדלקת נר לזכרו של ${currentStory.name}`,
    });
  };

  const toggleTheme = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsDarkMode((prevMode) => !prevMode);
      setIsTransitioning(false);
    }, 300);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `סיפור אחד ביום - ${currentStory.name}`,
        text: `הצטרפו אלי להדלקת נר זיכרון לזכרו של ${currentStory.name}`,
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

  const handlePrevStory = () => {
    setCurrentStoryIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNextStory = () => {
    setCurrentStoryIndex((prevIndex) => Math.min(stories.length - 1, prevIndex + 1));
  };

  return (
    <div className={`min-h-screen bg-background font-assistant p-4 interactive-bg transition-colors duration-300`}>
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" onClick={() => navigate("/register")}>
              <UserPlus className="ml-2 h-4 w-4" />
              הרשמה
            </Button>
            {!isLoggedIn && (
              <Button variant="outline" onClick={() => navigate("/login")}>
                <LogIn className="ml-2 h-4 w-4" />
                התחברות
              </Button>
            )}
            {isLoggedIn && (
              <Button 
                variant="outline" 
                onClick={() => supabase.auth.signOut()}
              >
                <LogIn className="ml-2 h-4 w-4 rotate-180" />
                התנתקות
              </Button>
            )}
            <Button variant="outline" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-gradient-gold mb-2">סיפור אחד ביום</h1>
            <p className="text-muted-foreground">לזכר חללי צה״ל במלחמת חרבות ברזל</p>
            <div className="mt-4 text-lg">
              <span className="text-primary font-semibold ml-2">הדלקנו יחד</span>
              <span className="text-amber-500 font-bold text-2xl">{candlesLit.toLocaleString()}</span>
              <span className="text-primary font-semibold mr-2">נרות זיכרון</span>
            </div>
          </div>
        </header>

        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10"
            onClick={handlePrevStory}
            disabled={currentStoryIndex === 0}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-4 z-10"
            onClick={handleNextStory}
            disabled={currentStoryIndex === stories.length - 1}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Card className="fade-slide-in">
            <CardHeader className="text-center space-y-4">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden">
                <img
                  src={currentStory.image}
                  alt={currentStory.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentStory.name}</h2>
                <p className="text-lg text-muted-foreground">
                  {currentStory.unit} | גיל {currentStory.age}
                </p>
                <p className="text-sm text-muted-foreground">
                  נפל ב-{currentStory.date}
                </p>
              </div>
            </CardHeader>

            <CardContent className="text-center">
              <p className="text-md text-white mb-6 leading-relaxed">{currentStory.story}</p>

              <div className="flex justify-center space-x-4">
                <Button onClick={handleLightCandle}>
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
        </div>
      </div>
    </div>
  );
};

export default Index;

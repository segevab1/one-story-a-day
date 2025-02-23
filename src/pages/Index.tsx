import { useState, useEffect } from "react";
import { Flame, Share2, Facebook, Instagram, MessageCircle, UserPlus, ChevronLeft, ChevronRight, Mail, Phone, Sun, Moon } from "lucide-react";
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

const Index = () => {
  const [candlesLit, setCandlesLit] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [litCandles, setLitCandles] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();

  const stories = [
    {
      id: "1",
      name: "סגן דוד כהן",
      age: 23,
      date: "7.10.2023",
      unit: "חטיבת גולני",
      story: `דוד היה בן יחיד להוריו רחל ומשה מחיפה. מילדותו בלט בכישוריו המנהיגותיים ואהבתו הגדולה לארץ ישראל. בתיכון היה יושב ראש מועצת התלמידים והתנדב במד"א. התגייס לגולני מתוך בחירה ועבר קורס קצינים בהצטיינות.

דוד נפל בקרב ב-7 באוקטובר, כשפיקד על כוח שנשלח לחלץ משפחות ביישובי עוטף עזה. למרות פציעתו, המשיך לפקד על חייליו ולסייע בחילוץ אזרחים עד שנפל. על גבורתו בקרב הוענק לו צל"ש לאחר מותו.`,
      image: "public/lovable-uploads/dc4696e4-183d-4087-87c3-8eb7f5a4051d.png",
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

בבוקר ה-8 באוקטובר, יובל וצוותו הוזנקו למושב נתיב העשרה בעקבות דיווח על חדירת מחבלים. במהלך הקרב להגנת המושב, זיהה יובל מחבלים שהתקרבו לבית משפחה. הואicha על חבריו ואפשר פינוי בטוח של המשפחה, אך נפגע מירי צלפים.`,
      image: "public/lovable-uploads/e025cc5f-ce55-49be-8f81-35e5533db778.png",
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
      image: "public/lovable-uploads/619f17ff-df15-44f5-8f2f-9cd3bb9cc2e3.png",
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
      image: "public/lovable-uploads/411c6af2-380e-4c65-89ca-d1e1cfb3c7c6.png",
      candlesLit: 167,
      contact: {
        email: "barak.family@example.com",
        phone: "054-3216549"
      }
    }
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    const loadCandlesCount = async () => {
      try {
        const { count } = await supabase
          .from('candle_lights')
          .select('*', { count: 'exact' });
        
        if (count !== null) {
          setCandlesLit(count);
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userCandles } = await supabase
            .from('candle_lights')
            .select('story_id')
            .eq('lit_by', user.id);

          if (userCandles) {
            const litStoryIds = new Set(userCandles.map(candle => candle.story_id));
            setLitCandles(litStoryIds);
          }
        }
      } catch (error) {
        console.error("Error loading candles:", error);
      }
    };
    
    loadCandlesCount();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.body.style.setProperty('--mouse-x', `${x * 100}%`);
      document.body.style.setProperty('--mouse-y', `${y * 100}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNextStory = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevStory = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handleLightCandle = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          variant: "destructive",
          title: "נדרשת הרשמה",
          description: "יש להתחבר כדי להדליק נר",
        });
        navigate("/register");
        return;
      }

      const { data: existingCandle, error: checkError } = await supabase
        .from('candle_lights')
        .select('id')
        .eq('story_id', currentStory.id)
        .eq('lit_by', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingCandle) {
        toast({
          variant: "destructive",
          title: "נר כבר הודלק",
          description: "כבר הדלקת נר לזכרו של " + currentStory.name,
        });
        return;
      }

      const { error: insertError } = await supabase
        .from('candle_lights')
        .insert({
          story_id: currentStory.id,
          lit_by: user.id
        });

      if (insertError) throw insertError;

      setCandlesLit(prev => prev + 1);
      setLitCandles(prev => new Set([...prev, currentStory.id]));
      
      stories[currentStoryIndex] = {
        ...stories[currentStoryIndex],
        candlesLit: stories[currentStoryIndex].candlesLit + 1
      };

      toast({
        title: "נר הודלק בהצלחה",
        description: `הדלקת נר לזכרו של ${currentStory.name}`,
      });
    } catch (error) {
      console.error("Error lighting candle:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בהדלקת הנר",
        description: error instanceof Error ? error.message : "אירעה שגיאה, אנא נסה שוב",
      });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('light');
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
    <div className={`min-h-screen bg-background font-assistant p-4 interactive-bg transition-colors duration-300`}>
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12 animate-fade-in flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/add-story")}>
            הוספת סיפור
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gradient-gold mb-2">סיפור אחד ביום</h1>
            <p className="text-muted-foreground">לזכר חללי צה״ל במלחמת חרבות ברזל</p>
            <div className="mt-4 text-lg">
              <span className="text-primary font-semibold ml-2">הדלקנו יחד</span>
              <span className="text-amber-500 font-bold text-2xl">{candlesLit.toLocaleString()}</span>
              <span className="text-primary font-semibold mr-2">נרות זיכרון</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={() => navigate("/register")}>
              <UserPlus className="ml-2" />
              הרשמה
            </Button>
          </div>
        </header>

        <div className="relative">
          <Button
            variant="ghost"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hover:bg-background/20"
            onClick={handlePrevStory}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Card className={`memorial-card overflow-hidden ${isTransitioning ? 'opacity-0' : 'opacity-100'} mx-12`}>
            <div className="relative aspect-video">
              <img 
                src={currentStory.image} 
                alt={currentStory.name}
                className="object-cover w-full h-full brightness-90 transition-transform duration-500 hover:scale-105"
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
              <div className="text-lg leading-relaxed whitespace-pre-line fade-slide-in">
                {currentStory.story}
              </div>

              <div className="border-t border-border pt-4 fade-slide-in">
                <h3 className="text-lg font-semibold text-gradient-gold">יצירת קשר עם המשפחה</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center hover:text-primary transition-colors">
                    <Mail className="ml-2" size={18} />
                    <span>{currentStory.contact.email}</span>
                  </p>
                  <p className="flex items-center hover:text-primary transition-colors">
                    <Phone className="ml-2" size={18} />
                    <span>{currentStory.contact.phone}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4 fade-slide-in">
                <Button
                  onClick={handleLightCandle}
                  className={`transition-all duration-300 hover:scale-105 ${
                    litCandles.has(currentStory.id) 
                      ? 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-white hover:from-orange-600 hover:via-yellow-600 hover:to-orange-600'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <Flame 
                    className={`mr-2 transition-all duration-300 ${
                      litCandles.has(currentStory.id) 
                        ? 'text-white animate-pulse'
                        : ''
                    }`}
                  />
                  <span>הדלקת נר</span>
                  <span className="mr-2 text-muted-foreground">| {currentStory.candlesLit.toLocaleString()}</span>
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

          <Button
            variant="ghost"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hover:bg-background/20"
            onClick={handleNextStory}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

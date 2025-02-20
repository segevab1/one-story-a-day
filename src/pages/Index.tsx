
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "התנתקת בהצלחה",
        description: "להתראות!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בהתנתקות",
        description: error instanceof Error ? error.message : "אירעה שגיאה, אנא נסה שוב",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="container mx-auto flex justify-between items-center mb-8 px-4">
        <h1 className="text-3xl font-bold text-gradient-gold">סיפור אחד ביום</h1>
        <nav className="space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" asChild className="memorial-card">
                <Link to="/add-story">הוסף סיפור</Link>
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="text-primary hover:text-primary/80">
                התנתק
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild className="memorial-card">
                <Link to="/login">התחבר</Link>
              </Button>
              <Button variant="default" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/register">הרשמה</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      
      <section className="container mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="memorial-card p-6 fade-slide-in">
          <h2 className="text-xl font-semibold mb-2 text-gradient-gold">שם: דוד כהן</h2>
          <p className="text-muted-foreground">גיל: 22</p>
          <p className="text-muted-foreground">תאריך נפילה: 10/10/2023</p>
          <p className="text-muted-foreground">יחידה: סיירת מטכ"ל</p>
          <p className="mt-4">
            סיפור: דוד היה לוחם אמיץ ומוכשר, שתמיד הוביל את חבריו קדימה. הוא נפל בקרב героіc במהלך מבצע מיוחד בעזה.
          </p>
        </div>

        <div className="memorial-card p-6 fade-slide-in">
          <h2 className="text-xl font-semibold mb-2 text-gradient-gold">שם: רחל לוי</h2>
          <p className="text-muted-foreground">גיל: 19</p>
          <p className="text-muted-foreground">תאריך נפילה: 15/11/2023</p>
          <p className="text-muted-foreground">יחידה: חיל האוויר</p>
          <p className="mt-4">
            סיפור: רחל הייתה טייסת מצטיינת, שהגנה על שמי המדינה במסירות אין קץ. היא נהרגה בתאונת אימונים מצערת.
          </p>
        </div>

        <div className="memorial-card p-6 fade-slide-in">
          <h2 className="text-xl font-semibold mb-2 text-gradient-gold">שם: יוסף מזרחי</h2>
          <p className="text-muted-foreground">גיל: 25</p>
          <p className="text-muted-foreground">תאריך נפילה: 01/12/2023</p>
          <p className="text-muted-foreground">יחידה: הנדסה קרבית</p>
          <p className="mt-4">
            סיפור: יוסף היה חבלן אמיץ לב, שנטרל מטענים רבים והציל חיי אדם. הוא נפל במהלך פיצוץ מטען ממולכד בגבול הצפון.
          </p>
        </div>

        <div className="memorial-card p-6 fade-slide-in">
          <h2 className="text-xl font-semibold mb-2 text-gradient-gold">שם: שרה כהן</h2>
          <p className="text-muted-foreground">גיל: 20</p>
          <p className="text-muted-foreground">תאריך נפילה: 20/12/2023</p>
          <p className="text-muted-foreground">יחידה: משטרה צבאית</p>
          <p className="mt-4">
            סיפור: שרה הייתה שוטרת צבאית מסורה, ששמרה על הסדר והביטחון בבסיסים השונים. היא נדרסה למוות בתאונת דרכים בעת מילוי תפקידה.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;

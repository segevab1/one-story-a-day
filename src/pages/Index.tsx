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

    // האזנה לשינויים במצב ההתחברות
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
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">סיפור אחד ביום</h1>
        <nav className="space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" asChild>
                <Link to="/add-story">הוסף סיפור</Link>
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                התנתק
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">התחבר</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/register">הרשמה</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="border rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">שם: דוד כהן</h2>
          <p className="text-gray-600">גיל: 22</p>
          <p className="text-gray-600">תאריך נפילה: 10/10/2023</p>
          <p className="text-gray-600">יחידה: סיירת מטכ"ל</p>
          <p className="mt-2">
            סיפור: דוד היה לוחם אמיץ ומוכשר, שתמיד הוביל את חבריו קדימה. הוא נפל בקרב героіc במהלך מבצע מיוחד בעזה.
          </p>
        </div>

        <div className="border rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">שם: רחל לוי</h2>
          <p className="text-gray-600">גיל: 19</p>
          <p className="text-gray-600">תאריך נפילה: 15/11/2023</p>
          <p className="text-gray-600">יחידה: חיל האוויר</p>
          <p className="mt-2">
            סיפור: רחל הייתה טייסת מצטיינת, שהגנה על שמי המדינה במסירות אין קץ. היא נהרגה בתאונת אימונים מצערת.
          </p>
        </div>

        <div className="border rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">שם: יוסף מזרחי</h2>
          <p className="text-gray-600">גיל: 25</p>
          <p className="text-gray-600">תאריך נפילה: 01/12/2023</p>
          <p className="text-gray-600">יחידה: הנדסה קרבית</p>
          <p className="mt-2">
            סיפור: יוסף היה חבלן אמיץ לב, שנטרל מטענים רבים והציל חיי אדם. הוא נפל במהלך פיצוץ מטען ממולכד בגבול הצפון.
          </p>
        </div>

        <div className="border rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">שם: שרה כהן</h2>
          <p className="text-gray-600">גיל: 20</p>
          <p className="text-gray-600">תאריך נפילה: 20/12/2023</p>
          <p className="text-gray-600">יחידה: משטרה צבאית</p>
          <p className="mt-2">
            סיפור: שרה הייתה שוטרת צבאית מסורה, ששמרה על הסדר והביטחון בבסיסים השונים. היא נדרסה למוות בתאונת דרכים בעת מילוי תפקידה.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;

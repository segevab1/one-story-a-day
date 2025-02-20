
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    
    const loadStories = async () => {
      const { data, error } = await supabase
        .from('fallen_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading stories:', error);
        return;
      }

      if (data) {
        setStories(data);
      }
    };

    checkAuth();
    loadStories();

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

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage
      .from('fallen-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
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
        {stories.map((story) => (
          <div key={story.id} className="memorial-card p-6 fade-slide-in">
            {story.image_url && (
              <div className="mb-4 aspect-square overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(story.image_url)}
                  alt={`תמונה של ${story.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2 text-gradient-gold">
              {story.name}
            </h2>
            <p className="text-muted-foreground">גיל: {story.age}</p>
            <p className="text-muted-foreground">תאריך נפילה: {story.date}</p>
            <p className="text-muted-foreground">יחידה: {story.unit}</p>
            <p className="mt-4">{story.story}</p>
          </div>
        ))}

        {stories.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            אין סיפורים להצגה כרגע
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Flame } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [isLit, setIsLit] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    
    const loadStories = async () => {
      setLoading(true);
      try {
        const { data: storiesData, error: storiesError } = await supabase
          .from('fallen_stories')
          .select('*')
          .order('created_at', { ascending: false });

        if (storiesError) {
          console.error('Error loading stories:', storiesError);
          toast({
            variant: "destructive",
            title: "שגיאה בטעינת הסיפורים",
            description: "אנא נסה לרענן את הדף",
          });
          return;
        }

        if (storiesData) {
          console.log('Loaded stories:', storiesData);
          setStories(storiesData);
          
          // Load candle states
          const { data: candlesData, error: candlesError } = await supabase
            .from('candle_lights')
            .select('story_id');
            
          if (candlesError) {
            console.error('Error loading candles:', candlesError);
            return;
          }

          console.log('Loaded candles:', candlesData);
          
          const litCandles = (candlesData || []).reduce((acc: { [key: string]: boolean }, candle) => {
            acc[candle.story_id] = true;
            return acc;
          }, {});
          
          setIsLit(litCandles);
        }
      } finally {
        setLoading(false);
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
  }, [toast]);

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

  const toggleCandle = async (storyId: string) => {
    if (!isLoggedIn) {
      toast({
        title: "נדרשת התחברות",
        description: "כדי להדליק נר, יש להתחבר תחילה",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isLit[storyId]) {
        // Remove candle
        const { error: deleteError } = await supabase
          .from('candle_lights')
          .delete()
          .eq('story_id', storyId)
          .eq('lit_by', user.id);

        if (deleteError) throw deleteError;
        setIsLit(prev => ({ ...prev, [storyId]: false }));
        
        toast({
          title: "הנר כבה",
          description: "הנר כובה בהצלחה",
        });
      } else {
        // Add candle
        const { error: insertError } = await supabase
          .from('candle_lights')
          .insert([{ story_id: storyId, lit_by: user.id }]);

        if (insertError) throw insertError;
        setIsLit(prev => ({ ...prev, [storyId]: true }));
        
        toast({
          title: "הנר הודלק",
          description: "הנר הודלק בהצלחה",
        });
      }
    } catch (error) {
      console.error('Error toggling candle:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן להדליק/לכבות את הנר כרגע",
        variant: "destructive",
      });
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    
    // קבלת URL ציבורי לתמונה מה-Storage
    const { data } = supabase.storage
      .from('fallen-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">טוען...</div>
      </div>
    );
  }

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
        {stories.length > 0 ? (
          stories.map((story) => (
            <div key={story.id} className="memorial-card p-6 fade-slide-in relative">
              {story.image_url && (
                <div className="mb-4 aspect-square overflow-hidden rounded-lg">
                  <img
                    src={getImageUrl(story.image_url)}
                    alt={`תמונה של ${story.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <button
                onClick={() => toggleCandle(story.id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
              >
                <Flame 
                  className={`w-6 h-6 transition-all ${
                    isLit[story.id] ? 'text-primary candle-lit' : 'text-muted-foreground'
                  }`}
                />
              </button>
              <h2 className="text-xl font-semibold mb-2 text-gradient-gold">
                {story.name}
              </h2>
              <p className="text-muted-foreground">גיל: {story.age}</p>
              <p className="text-muted-foreground">תאריך נפילה: {story.date}</p>
              <p className="text-muted-foreground">יחידה: {story.unit}</p>
              <p className="mt-4">{story.story}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">אין עדיין סיפורים להצגה</p>
            {isLoggedIn && (
              <Button variant="outline" asChild className="mt-4">
                <Link to="/add-story">הוסף את הסיפור הראשון</Link>
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;

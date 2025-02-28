
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { MemorialHeader } from "@/components/memorial/MemorialHeader";
import { HeaderActions } from "@/components/memorial/HeaderActions";
import { StoryCard, StoryData } from "@/components/memorial/StoryCard";
import { StoryNavigation } from "@/components/memorial/StoryNavigation";
import { stories } from "@/data/stories";

const Index = () => {
  const [candlesLit, setCandlesLit] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [litCandles, setLitCandles] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { toast } = useToast();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    setIsDarkMode((prev) => !prev);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleLightCandle = () => {
    const currentStory = stories[currentStoryIndex];
    
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

  const handlePrevStory = () => {
    setCurrentStoryIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNextStory = () => {
    setCurrentStoryIndex((prevIndex) => Math.min(stories.length - 1, prevIndex + 1));
  };

  const currentStory = stories[currentStoryIndex];

  return (
    <div className={`min-h-screen bg-background font-assistant p-4 interactive-bg transition-colors duration-300 ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="container mx-auto max-w-4xl">
        <HeaderActions 
          isLoggedIn={isLoggedIn} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
        
        <MemorialHeader candlesLit={candlesLit} />

        <div className="relative">
          <StoryNavigation 
            currentIndex={currentStoryIndex} 
            totalStories={stories.length} 
            onPrevious={handlePrevStory} 
            onNext={handleNextStory} 
          />
          
          <StoryCard 
            story={currentStory as StoryData} 
            onLightCandle={handleLightCandle} 
            hasLitCandle={litCandles.has(currentStory.id)} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

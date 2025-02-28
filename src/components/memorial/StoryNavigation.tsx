
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StoryNavigationProps {
  currentIndex: number;
  totalStories: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const StoryNavigation = ({ 
  currentIndex, 
  totalStories, 
  onPrevious, 
  onNext 
}: StoryNavigationProps) => {
  return (
    <>
      <Button
        variant="ghost"
        className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
      
      <Button
        variant="ghost"
        className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-4 z-10"
        onClick={onNext}
        disabled={currentIndex === totalStories - 1}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
    </>
  );
};

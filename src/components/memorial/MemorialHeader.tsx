
import { Flame } from "lucide-react";

interface MemorialHeaderProps {
  candlesLit: number;
}

export const MemorialHeader = ({ candlesLit }: MemorialHeaderProps) => {
  return (
    <header className="text-center mb-12 animate-fade-in">
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
  );
};

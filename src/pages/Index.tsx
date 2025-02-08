
import { useState } from "react";
import { Flame, Share2 } from "lucide-react";

const Index = () => {
  const [candlesLit, setCandlesLit] = useState(0);
  
  // Example story data
  const story = {
    id: "1",
    name: "סגן דוד כהן",
    age: 23,
    date: "7.10.2023",
    unit: "חטיבת גולני",
    story: "דוד היה מפקד מצטיין, אהוב על חייליו ומסור למשפחתו. הוא נפל בקרב בעת הגנה על יישובי עוטף עזה.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    candlesLit: 342
  };

  const handleLightCandle = () => {
    setCandlesLit(prev => prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `לזכרו של ${story.name}`,
        text: `קראו את סיפורו של ${story.name}, שנפל במלחמת חרבות ברזל`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-memorial-background font-assistant">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-memorial-text mb-2">סיפור אחד ביום</h1>
          <p className="text-memorial-accent">לזכר חללי צה״ל במלחמת חרבות ברזל</p>
        </header>

        <main className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-slide-up">
          <div className="aspect-w-16 aspect-h-9">
            <img 
              src={story.image} 
              alt={story.name}
              className="object-cover w-full h-64"
            />
          </div>
          
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-memorial-text mb-2">{story.name}</h2>
              <p className="text-memorial-accent">
                {story.age} | {story.unit} | {story.date}
              </p>
            </div>

            <p className="text-memorial-text text-lg leading-relaxed mb-8">
              {story.story}
            </p>

            <div className="flex justify-between items-center">
              <button
                onClick={handleLightCandle}
                className="flex items-center gap-2 px-6 py-3 bg-memorial-light text-memorial-dark rounded-full hover:bg-memorial-dark hover:text-white transition-colors duration-300"
              >
                <Flame className="w-5 h-5" />
                <span>הדלקת נר | {candlesLit}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 text-memorial-accent hover:text-memorial-dark transition-colors duration-300"
              >
                <Share2 className="w-5 h-5" />
                <span>שיתוף</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

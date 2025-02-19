
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AddStory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    date: "",
    unit: "",
    story: "",
    image: null as File | null,
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("יש להתחבר כדי להוסיף סיפור");
      }

      if (!formData.image) {
        throw new Error("נא להעלות תמונה");
      }

      // העלאת התמונה לאחסון
      const fileExt = formData.image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data: fileData } = await supabase.storage
        .from('fallen-images')
        .upload(fileName, formData.image);

      if (uploadError) throw uploadError;

      if (!fileData) throw new Error("שגיאה בהעלאת התמונה");

      // שמירת הסיפור בדאטהבייס
      const { error: storyError } = await supabase
        .from('fallen_stories')
        .insert([
          {
            name: formData.name,
            age: parseInt(formData.age),
            date: formData.date,
            unit: formData.unit,
            story: formData.story,
            image_url: fileData.path,
            contact_email: formData.email,
            contact_phone: formData.phone,
            created_by: user.id
          }
        ]);

      if (storyError) throw storyError;

      toast({
        title: "הסיפור נשמר בהצלחה",
        description: "תודה על השיתוף. הסיפור יופיע באתר בקרוב.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בשמירת הסיפור",
        description: error instanceof Error ? error.message : "אירעה שגיאה, אנא נסה שוב",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ChevronRight className="ml-2 h-4 w-4" />
          חזרה לדף הראשי
        </Button>

        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="text-2xl text-gradient-gold text-center">הוספת סיפור חלל</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">שם החלל</label>
                <Input
                  placeholder="שם מלא"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">גיל</label>
                <Input
                  type="number"
                  placeholder="גיל"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">תאריך נפילה</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">יחידה</label>
                <Input
                  placeholder="שם היחידה"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">סיפור</label>
                <Textarea
                  placeholder="ספר את סיפורו של החלל..."
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">תמונה</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, image: file });
                    }
                  }}
                  required
                />
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="text-lg font-semibold text-gradient-gold">פרטי קשר של המשפחה</h3>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">דוא״ל</label>
                  <Input
                    type="email"
                    placeholder="כתובת דוא״ל"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">טלפון</label>
                  <Input
                    type="tel"
                    placeholder="מספר טלפון"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "שולח..." : "שלח סיפור"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddStory;

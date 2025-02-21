
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
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
    contact_email: "",
    contact_phone: "",
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
      const { error: uploadError } = await supabase.storage
        .from('fallen-images')
        .upload(fileName, formData.image);

      if (uploadError) throw uploadError;

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
            image_url: fileName,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            created_by: user.id,
          }
        ]);

      if (storyError) throw storyError;

      toast({
        title: "הסיפור נשמר בהצלחה",
        description: "תודה על השיתוף",
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
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">הוספת סיפור</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="שם החלל"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="גיל"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            placeholder="יחידה"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="סיפור"
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            required
            className="min-h-[200px]"
          />
        </div>
        <div>
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
        <div>
          <Input
            type="email"
            placeholder="אימייל ליצירת קשר"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="טלפון ליצירת קשר"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "שומר..." : "שמור סיפור"}
        </Button>
      </form>
    </div>
  );
};

export default AddStory;

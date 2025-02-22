
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // שמירת פרטי ההרשמה בטבלת registrations
        const { error: registrationError } = await supabase
          .from('registrations')
          .insert([
            {
              user_id: authData.user.id,
              email: email,
            }
          ]);

        if (registrationError) throw registrationError;
      }

      toast({
        title: "נרשמת בהצלחה!",
        description: "נשלח אליך מייל אימות. אנא אשר אותו כדי להתחיל.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בהרשמה",
        description: error instanceof Error ? error.message : "אירעה שגיאה, אנא נסה שוב",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">הרשמה</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
            minLength={6}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "מתבצעת הרשמה..." : "הרשמה"}
        </Button>
      </form>
    </div>
  );
};

export default Register;

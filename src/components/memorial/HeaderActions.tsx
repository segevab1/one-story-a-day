
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Moon, PlusCircle, Sun, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HeaderActionsProps {
  isLoggedIn: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const HeaderActions = ({ isLoggedIn, isDarkMode, toggleTheme }: HeaderActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-2 mb-4">
      {isLoggedIn && (
        <Button variant="outline" onClick={() => navigate("/add-story")} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          הוספת סיפור
        </Button>
      )}
      <Button variant="outline" onClick={() => navigate("/register")}>
        <UserPlus className="ml-2 h-4 w-4" />
        הרשמה
      </Button>
      {!isLoggedIn && (
        <Button variant="outline" onClick={() => navigate("/login")}>
          <LogIn className="ml-2 h-4 w-4" />
          התחברות
        </Button>
      )}
      {isLoggedIn && (
        <Button 
          variant="outline" 
          onClick={() => supabase.auth.signOut()}
        >
          <LogIn className="ml-2 h-4 w-4 rotate-180" />
          התנתקות
        </Button>
      )}
      <Button 
        variant="outline" 
        onClick={toggleTheme}
        className="transition-colors duration-300"
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
};

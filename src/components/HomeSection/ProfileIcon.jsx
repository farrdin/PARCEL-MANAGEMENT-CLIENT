import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/Hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function ProfileIcon() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    Swal.fire({
      title: "Want to Log Out?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#03560F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes !",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.error("Error logging out:", error);
          });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          className="w-10 h-10 rounded-full"
          src={
            user.photoURL
              ? user.photoURL
              : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          }
          alt="User Avatar"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <span className="text-left block px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
            {user.displayName ||
              user.email.replace(/(?<=.{1}).*(?=@)/, "******")}
            <span className="ml-2 text-xs text-gray-500">(Profile)</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button className="text-left block px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
            <NavLink to="dashboard">Dashboard</NavLink>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            onClick={handleLogOut}
            className="text-left block px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

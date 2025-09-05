import {
  Button,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Spacer,
} from "@nextui-org/react";
import { LogOutIcon } from "./icons";

interface NavBarProps {
  onLogout?: () => void;
}

export function NavBar({ onLogout }: NavBarProps) {
  return (
    <Navbar>
      <NavbarBrand>
        <Image src="/brand.png" width={40} />
        <Spacer x={4} />
        <h1 className="font-bold">AGENT REFERRAL SYSTEM</h1>
      </NavbarBrand>
      <NavbarContent as="div" justify="end">
        <Button isIconOnly onPress={onLogout}>
          <LogOutIcon />
        </Button>
      </NavbarContent>
    </Navbar>
  );
}

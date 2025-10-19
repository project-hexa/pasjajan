import { Button } from "@workspace/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

export const Password = ({
  field,
  fieldState,
  disabled,
  id,
}: {
  field: Omit<ControllerRenderProps, "password" | "confirmPassword">;
  fieldState: ControllerFieldState;
  disabled?: boolean;
  id?: string;
}) => {
  const [showPassword, setShowPassword] = useState("password");

  const handleClickShowPassword = () =>
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        placeholder="********"
        type={showPassword}
        aria-invalid={fieldState.invalid}
        disabled={disabled}
        {...field}
      />
      <InputGroupAddon align={"inline-end"}>
        <Button
          onClick={handleClickShowPassword}
          variant="ghost"
          size="icon"
          type="button"
        >
          {showPassword === "password" ? <Eye /> : <EyeOff />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};

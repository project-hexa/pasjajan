import { Button } from "@workspace/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { useState } from "react";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { Progress } from "@workspace/ui/components/progress";
import { Icon } from "@workspace/ui/components/icon";

export interface PasswordStrength {
  id: number;
  value: string;
  contains: string[];
  length: number;
}

export interface PasswordRequirement {
  text: string;
  met: boolean;
}

export const PasswordStrengthBar = ({
  strength,
}: {
  strength: PasswordStrength;
}) => {
  const colorMap: Record<string, string> = {
    "Too weak": "bg-red-500",
    Weak: "bg-orange-500",
    Medium: "bg-yellow-500",
    Strong: "bg-green-500",
  };

  const textColorMap: Record<string, string> = {
    "Too weak": "text-red-500",
    Weak: "text-orange-500",
    Medium: "text-yellow-500",
    Strong: "text-green-500",
  };

  const labelMap: Record<string, string> = {
    "Too weak": "Terlalu Lemah",
    Weak: "Lemah",
    Medium: "Sedang",
    Strong: "Kuat",
  };

  const width = (strength.id / 3) * 100;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Kekuatan Password</span>
        <span className={`text-sm font-medium ${textColorMap[strength.value]}`}>
          {labelMap[strength.value]}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <Progress
          indicatorClassName={`${colorMap[strength.value]}`}
          value={width}
        />
      </div>
    </div>
  );
};

export const PasswordRequirements = ({
  strength,
  field,
}: {
  strength: PasswordStrength;
  field: Omit<ControllerRenderProps, "password" | "confirmPassword">;
}) => {
  const requirements: PasswordRequirement[] = [
    {
      text: "Minimal 8 karakter",
      met: strength.length >= 8,
    },
    {
      text: "Mengandung huruf besar",
      met: strength.contains.includes("uppercase"),
    },
    {
      text: "Mengandung huruf kecil",
      met: strength.contains.includes("lowercase"),
    },
    {
      text: "Mengandung angka",
      met: strength.contains.includes("number"),
    },
    {
      text: "Mengandung simbol",
      met: strength.contains.includes("symbol"),
    },
    {
      text: "Tidak Mengandung Spasi",
      met: !/\s/.test(field.value),
    },
  ];

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-gray-600">Syarat Password:</p>
      <div className="grid grid-cols-1 gap-1.5">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {req.met ? (
              <Icon
                icon="lucide:check"
                className="h-4 w-4 flex-shrink-0 text-green-500"
              />
            ) : (
              <Icon
                icon="maki:cross"
                className="text-destructive h-4 w-4 flex-shrink-0"
              />
            )}
            <span
              className={`text-xs ${req.met ? "text-green-600" : "text-gray-500"}`}
            >
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
          {showPassword === "password" ? (
            <Icon icon="lucide:eye" />
          ) : (
            <Icon icon="lucide:eye-off" />
          )}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};

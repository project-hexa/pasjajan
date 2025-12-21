import React from "react";

interface FooterProps {
  text?: string;
  className?: string;
}

export default function Footer({
  text = "© 2025 PasJajan – All Right Reserved",
  className = "",
}: FooterProps) {
  return (
    <footer
      className={`w-full bg-gray-50 border-t border-gray-200 py-3 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-left text-xs text-gray-500">{text}</p>
      </div>
    </footer>
  );
}

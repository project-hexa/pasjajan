import React from "react";

export default function DeliveryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layout ini memastikan route group (delivery) terpisah dari (main)
  // Delivery pages memiliki header sendiri jadi tidak perlu wrapper dari main layout
  return <>{children}</>;
}

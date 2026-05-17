import React from 'react';

export default function OptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-page-gradient flex-1">
      {children}
    </div>
  );
}
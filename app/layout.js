export const metadata = {
  title: "Wallet",
  description: "Your cards, accounts and savings",
  // Opened from the iPhone home screen: full-screen, with a solid black status bar so
  // nothing in the app slides underneath it.
  appleWebApp: {
    capable: true,
    title: "Wallet",
    statusBarStyle: "black",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000" }}>{children}</body>
    </html>
  );
}

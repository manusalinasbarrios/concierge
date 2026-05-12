import localFont from 'next/font/local';

// Configure the Local Font from the public folder
export const mainFont = localFont({
  src: '../public/fonts/adidasFG-Compressed.otf', // Adjust this to your actual filename
  variable: '--font-main',
  display: 'swap',
});
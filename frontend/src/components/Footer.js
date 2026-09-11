function Footer() {
  return (
    <footer className="mt-auto py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-slate-600 dark:text-slate-400 font-medium">&copy; {new Date().getFullYear()} JobBoard. All rights reserved.</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Connect with top employers and find your dream job today.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
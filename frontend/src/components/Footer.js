import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-auto pt-16 pb-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Job</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">Board</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium">
              The most advanced platform for tech and engineering talent. We connect extraordinary people with extraordinary companies.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-sm mb-4">For Candidates</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 font-medium">
              <li><Link to="/candidate-dashboard" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Find Jobs</Link></li>
              <li><Link to="/profile" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Build Profile</Link></li>
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Career Advice</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-sm mb-4">For Employers</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 font-medium">
              <li><Link to="/post-job" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/employer-dashboard" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Browse Candidates</Link></li>
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            &copy; {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
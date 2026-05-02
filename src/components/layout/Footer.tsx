import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { Logo } from "../ui/Logo";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-10 h-10" />
              <span className="text-2xl font-bold text-civic-blue">CivicPath</span>
            </Link>
            <p className="text-slate-500 max-w-sm text-balance">
              Your guided journey to understanding democracy. Accessible, non-partisan, and completely free.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Journey</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/countries" className="hover:text-civic-blue transition-colors">Select Country</Link></li>
              <li><Link to="/india" className="hover:text-civic-blue transition-colors">India Hub 🇮🇳</Link></li>
              <li><Link to="/quiz" className="hover:text-civic-blue transition-colors">Civic Quiz</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Project</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/about" className="hover:text-civic-blue transition-colors">About & Team</Link></li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-civic-blue transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CivicPath. Built for Virtual Prompt Wars.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-slate-900">Privacy & Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

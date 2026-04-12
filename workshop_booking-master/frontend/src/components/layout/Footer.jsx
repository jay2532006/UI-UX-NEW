import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ExternalLink } from 'lucide-react';

/**
 * Footer component — institutional branding and links.
 * MASTER_PROMPT Section 5.1: "FOSSEE + IIT Bombay branding, links, GitHub link"
 */
export default function Footer() {
  return (
    <footer className="bg-fossee-dark text-white/80 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-xl font-bold text-white tracking-tight mb-2">
              FOSSEE
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Free/Libre and Open Source Software for Education.
              An initiative by IIT Bombay, funded by MHRD, Govt. of India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Portal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/statistics" className="hover:text-white transition-colors">
                  Workshop Statistics
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* FOSSEE Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              FOSSEE
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://fossee.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  FOSSEE Website <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.iitb.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  IIT Bombay <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://python.fossee.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Python FOSSEE <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Open Source
            </h3>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors"
            >
              <Globe size={18} />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} FOSSEE, IIT Bombay. All rights reserved.</p>
          <p>Workshop Booking Portal — Enhanced UI</p>
        </div>
      </div>
    </footer>
  );
}

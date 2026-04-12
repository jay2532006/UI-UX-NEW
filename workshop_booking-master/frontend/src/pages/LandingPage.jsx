/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Send,
  CheckCircle,
  BarChart3,
  MapPin,
  ArrowRight,
  BookOpen,
  Users,
} from 'lucide-react';
import StatCard from '../components/stats/StatCard';
import Footer from '../components/layout/Footer';
import client from '../api/client';

/**
 * LandingPage — public marketing page.
 * MASTER_PROMPT Section 5.1: hero, stats strip, how it works, workshop showcase, map teaser, footer.
 */
export default function LandingPage() {
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await client.get('/statistics/public/');
      setStats(res.data);
    } catch {
      // Silent fail — stats are a nice-to-have on the landing page
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Derive counts from stats
  const totalWorkshops = stats?.total_workshops || 0;
  const statesCovered = stats?.ws_states?.length || 0;
  const activeInstructors = stats?.total_instructors || 0;

  return (
    <>
      <Helmet>
        <title>FOSSEE Workshop Booking — IIT Bombay</title>
        <meta
          name="description"
          content="Propose workshops, connect with expert instructors, and bring Python and FOSS education to your campus. An initiative by FOSSEE, IIT Bombay."
        />
        <meta property="og:title" content="FOSSEE Workshop Booking Portal" />
        <meta property="og:description" content="Bring Python workshops to your campus through FOSSEE, IIT Bombay." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-fossee-surface">
        {/* ── Hero Section ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Dot-grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(26,86,219,0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Institutional badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-fossee-border rounded-full px-4 py-1.5 mb-6 shadow-card">
                <span className="text-xs font-bold text-fossee-primary tracking-wider uppercase">
                  FOSSEE · IIT Bombay
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-fossee-dark tracking-tight leading-tight">
                Bring Python Workshops
                <br />
                <span className="text-fossee-primary">to Your Campus</span>
              </h1>

              <p className="mt-5 text-lg md:text-xl text-fossee-muted max-w-2xl mx-auto leading-relaxed">
                Propose a workshop, connect with an expert instructor, and empower
                your students with free, open-source software education.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-fossee-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-card active:scale-[0.98]"
                >
                  Propose a Workshop <ArrowRight size={18} />
                </Link>
                <Link
                  to="/statistics"
                  className="inline-flex items-center gap-2 border-2 border-fossee-primary text-fossee-primary font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <BarChart3 size={18} /> View Statistics
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Animated Stats Strip ───────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 -mt-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Workshops Conducted"
              value={totalWorkshops}
              color="text-fossee-primary"
              bgColor="bg-white"
              icon={<BookOpen size={24} className="text-fossee-primary" />}
            />
            <StatCard
              label="States Covered"
              value={statesCovered}
              color="text-fossee-secondary"
              bgColor="bg-white"
              icon={<MapPin size={24} className="text-fossee-secondary" />}
            />
            <StatCard
              label="Active Instructors"
              value={activeInstructors}
              color="text-fossee-accent"
              bgColor="bg-white"
              icon={<Users size={24} className="text-fossee-accent" />}
            />
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-fossee-dark text-center mb-12">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: UserPlus,
                  title: '1. Register',
                  desc: 'Create an account as a coordinator at your institution.',
                  color: 'text-fossee-primary bg-blue-100',
                },
                {
                  icon: Send,
                  title: '2. Propose',
                  desc: 'Choose a workshop type, pick a date, and submit your proposal.',
                  color: 'text-fossee-accent bg-amber-100',
                },
                {
                  icon: CheckCircle,
                  title: '3. Get Confirmed',
                  desc: 'An instructor reviews and accepts. Your workshop is scheduled!',
                  color: 'text-fossee-secondary bg-green-100',
                },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.15 }}
                    className="text-center"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-fossee-dark mb-2">{step.title}</h3>
                    <p className="text-sm text-fossee-muted leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ── Map Preview / CTA ──────────────────────────────────────── */}
        <section className="bg-white border-y border-fossee-border">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <MapPin size={40} className="text-fossee-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-fossee-dark mb-3">
                {totalWorkshops > 0
                  ? `${totalWorkshops} workshops across ${statesCovered} states`
                  : 'Workshops Across India'}
              </h2>
              <p className="text-fossee-muted mb-6">
                Explore workshop distribution with our interactive India map and detailed analytics.
              </p>
              <Link
                to="/statistics"
                className="inline-flex items-center gap-2 bg-fossee-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-card"
              >
                View Full Statistics <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <Footer />
      </div>
    </>
  );
}

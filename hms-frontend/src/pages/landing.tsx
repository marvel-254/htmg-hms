// Landing page — taste-skill redesign
// Reading this as: B2B SaaS landing for healthcare teams, with a Linear-style minimalist language, leaning toward asymmetric layout + restrained motion.

import { useState } from 'react';
import { LoginPage, RegisterPage } from './auth';
import { motion } from 'motion/react';
import { 
  Hospital, Users, Stethoscope, Calendar, ChartBar, Shield, 
  ArrowRight, CheckCircle, Clock, TrendUp 
} from '@phosphor-icons/react';

export function LandingPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

  if (authMode === 'login') {
    return <LoginPage onSwitchToRegister={() => setAuthMode('register')} />;
  }

  if (authMode === 'register') {
    return <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />;
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <Hospital className="w-5 h-5 text-white" weight="bold" />
            </div>
            <span className="font-semibold text-text-primary">HMS</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#benefits" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Benefits</a>
            <button onClick={() => setAuthMode('login')} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Sign In
            </button>
            <button onClick={() => setAuthMode('register')} className="btn-primary text-sm py-2 px-4">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero - asymmetric split */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl md:text-5xl font-semibold text-text-primary tracking-tight leading-tight">
                Streamline your hospital operations
              </h1>
              <p className="text-lg text-text-tertiary mt-6 leading-relaxed max-w-lg">
                Manage patients, doctors, and appointments in one place. A modern, intuitive platform built for healthcare teams.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <button onClick={() => setAuthMode('register')} className="btn-primary text-base px-8 py-3">
                  Get Started
                  <ArrowRight className="w-5 h-5" weight="bold" />
                </button>
                <button onClick={() => setAuthMode('login')} className="btn-ghost text-base px-8 py-3">
                  Sign In
                </button>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-bg-surface rounded-2xl border border-border-standard overflow-hidden"
          >
            <div className="bg-bg-panel p-4 border-b border-border-subtle flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success-alt/60" />
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-base rounded-xl p-4 border border-border-subtle">
                  <Calendar className="w-6 h-6 text-brand-accent mb-2" weight="bold" />
                  <p className="text-xs text-text-muted">Today</p>
                  <p className="text-xl font-semibold text-text-primary">12</p>
                </div>
                <div className="bg-bg-base rounded-xl p-4 border border-border-subtle">
                  <CheckCircle className="w-6 h-6 text-success-alt mb-2" weight="bold" />
                  <p className="text-xs text-text-muted">Completed</p>
                  <p className="text-xl font-semibold text-text-primary">28</p>
                </div>
                <div className="bg-bg-base rounded-xl p-4 border border-border-subtle">
                  <Clock className="w-6 h-6 text-warning mb-2" weight="bold" />
                  <p className="text-xs text-text-muted">Pending</p>
                  <p className="text-xl font-semibold text-text-primary">5</p>
                </div>
                <div className="bg-bg-base rounded-xl p-4 border border-border-subtle">
                  <Users className="w-6 h-6 text-text-secondary mb-2" weight="bold" />
                  <p className="text-xs text-text-muted">Total</p>
                  <p className="text-xl font-semibold text-text-primary">156</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Johnson', time: '09:00 AM', status: 'confirmed' },
                  { name: 'Michael Chen', time: '10:30 AM', status: 'pending' },
                  { name: 'Emily Davis', time: '02:00 PM', status: 'completed' },
                ].map((appt) => (
                  <div key={appt.name} className="flex items-center justify-between bg-bg-panel rounded-lg px-4 py-3 border border-border-subtle">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-brand-accent">{appt.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{appt.name}</p>
                        <p className="text-xs text-text-muted">{appt.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'confirmed' ? 'bg-brand/10 text-brand-accent' :
                      appt.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-success-alt/10 text-success-alt'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features - bento grid, not 3 equal cards */}
      <section id="features" className="border-t border-border-subtle py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-semibold text-text-primary">Everything you need</h2>
            <p className="text-text-tertiary mt-3">Powerful features to manage your hospital efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-bg-surface rounded-xl border border-border-standard p-8">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-brand-accent" weight="bold" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Patient Management</h3>
              <p className="text-text-tertiary leading-relaxed">Register, search, and manage patient records with ease. Track conditions, contact info, and visit history in one place.</p>
            </div>
            
            <div className="bg-bg-surface rounded-xl border border-border-standard p-8">
              <div className="w-12 h-12 rounded-lg bg-success-alt/10 flex items-center justify-center mb-6">
                <Stethoscope className="w-6 h-6 text-success-alt" weight="bold" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Doctor Directory</h3>
              <p className="text-text-tertiary leading-relaxed">Maintain a complete directory with specialties, schedules, and contact details.</p>
            </div>
            
            <div className="bg-bg-surface rounded-xl border border-border-standard p-8">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-warning" weight="bold" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Appointment Booking</h3>
              <p className="text-text-tertiary leading-relaxed">Book and manage appointments with conflict detection built in.</p>
            </div>
            
            <div className="lg:col-span-2 bg-bg-surface rounded-xl border border-border-standard p-8">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-6">
                <ChartBar className="w-6 h-6 text-brand-accent" weight="bold" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Dashboard Analytics</h3>
              <p className="text-text-tertiary leading-relaxed">Get a real-time overview of your hospital operations with stats, trends, and activity feeds that keep your team aligned.</p>
            </div>
            
            <div className="bg-bg-surface rounded-xl border border-border-standard p-8">
              <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-error" weight="bold" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Role-Based Access</h3>
              <p className="text-text-tertiary leading-relaxed">Secure access control with Admin, Receptionist, and Doctor roles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - zigzag layout */}
      <section id="benefits" className="border-t border-border-subtle py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-text-primary">Built for healthcare teams</h2>
              <p className="text-text-tertiary mt-3">Focus on patient care, not paperwork.</p>
              
              <div className="mt-8 space-y-4">
                {[
                  'Clean, modern interface with no training required',
                  'Works on any device - desktop, tablet, or phone',
                  'Real-time updates across all users',
                  'Secure JWT authentication',
                  'Role-based permissions built in',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success-alt flex-shrink-0" weight="bold" />
                    <span className="text-text-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-bg-surface rounded-2xl border border-border-standard p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <TrendUp className="w-6 h-6 text-brand-accent" weight="bold" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Built with modern stack</p>
                  <p className="font-semibold text-text-primary">React + TypeScript + PostgreSQL</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">React 19.2</span>
                  <span className="text-text-muted">Fast UI</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">TypeScript 6</span>
                  <span className="text-text-muted">Type safe</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tailwind CSS 4</span>
                  <span className="text-text-muted">Modern styling</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Express + PostgreSQL</span>
                  <span className="text-text-muted">Reliable backend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border-subtle py-24">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-semibold text-text-primary">Ready to get started?</h2>
          <p className="text-text-tertiary mt-3">Create your account and start managing your hospital today.</p>
          <button onClick={() => setAuthMode('register')} className="btn-primary text-base px-8 py-3 mt-8">
            Create Account
            <ArrowRight className="w-5 h-5" weight="bold" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <Hospital className="w-4 h-4 text-white" weight="bold" />
            </div>
            <span className="text-sm text-text-muted">HMS - Hospital Management System</span>
          </div>
          <p className="text-sm text-text-muted">Prototype version</p>
        </div>
      </footer>
    </div>
  );
}

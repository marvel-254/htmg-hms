// Landing page - proper dark-mode design with CSS utilities

import { useState } from 'react';
import { LoginPage, RegisterPage } from './auth';
import { motion } from 'motion/react';
import { 
  Hospital, Users, Stethoscope, Calendar, ChartBar, Shield, 
  ArrowRight, CheckCircle, Clock, TrendUp, List, X 
} from '@phosphor-icons/react';

export function LandingPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  if (authMode === 'login') {
    return <LoginPage onSwitchToRegister={() => setAuthMode('register')} />;
  }

  if (authMode === 'register') {
    return <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header - fixed position */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
                <Hospital className="w-5 h-5 text-white" weight="bold" />
              </div>
              <span className="font-semibold text-primary text-lg">HMS</span>
            </div>
            
            {/* Desktop nav */}
            <nav className="md:flex items-center gap-8 hidden">
              <a href="#features" className="text-sm text-secondary hover:text-primary transition">Features</a>
              <a href="#benefits" className="text-sm text-secondary hover:text-primary transition">Benefits</a>
              <button onClick={() => setAuthMode('login')} className="text-sm text-secondary hover:text-primary transition">
                Sign In
              </button>
              <button onClick={() => setAuthMode('register')} className="btn-primary text-sm py-2 px-4">
                Get Started
              </button>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-surface border border"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenu && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-panel border-b border p-6">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-secondary hover:text-primary transition">Features</a>
                <a href="#benefits" className="text-secondary hover:text-primary transition">Benefits</a>
                <button onClick={() => setAuthMode('login')} className="text-secondary hover:text-primary transition text-left">
                  Sign In
                </button>
                <button onClick={() => setAuthMode('register')} className="btn-primary">
                  Get Started
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary tracking-tight leading-tight">
                  Streamline your hospital operations
                </h1>
                <p className="text-lg text-tertiary mt-6 leading-relaxed max-w-lg">
                  Manage patients, doctors, and appointments in one place. A modern, intuitive platform built for healthcare teams.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <button onClick={() => setAuthMode('register')} className="btn-primary text-base px-8 py-3">
                    Get Started
                    <ArrowRight className="w-5 h-5" weight="bold" />
                  </button>
                  <button onClick={() => setAuthMode('login')} className="btn-ghost text-base px-8 py-3">
                    Sign In
                  </button>
                </div>
                <div className="mt-8 p-4 bg-panel/50 rounded-xl border border-border-subtle">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Demo Accounts</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Admin</span>
                      <code className="text-brand-accent bg-brand/10 px-2 py-0.5 rounded text-xs">admin@hospital.com</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Receptionist</span>
                      <code className="text-brand-accent bg-brand/10 px-2 py-0.5 rounded text-xs">receptionist@hospital.com</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Doctor</span>
                      <code className="text-brand-accent bg-brand/10 px-2 py-0.5 rounded text-xs">doctor@hospital.com</code>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Password for all: <code className="text-success-alt bg-success-alt/10 px-2 py-0.5 rounded">demo1234</code></p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-surface rounded-2xl border overflow-hidden"
            >
              <div className="bg-panel p-4 border-b flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-elevated rounded-xl p-4 border">
                    <Calendar className="w-6 h-6 text-brand mb-2" weight="bold" />
                    <p className="text-xs text-muted">Today</p>
                    <p className="text-xl font-semibold text-primary">12</p>
                  </div>
                  <div className="bg-elevated rounded-xl p-4 border">
                    <CheckCircle className="w-6 h-6 text-success mb-2" weight="bold" />
                    <p className="text-xs text-muted">Completed</p>
                    <p className="text-xl font-semibold text-primary">28</p>
                  </div>
                  <div className="bg-elevated rounded-xl p-4 border">
                    <Clock className="w-6 h-6 text-warning mb-2" weight="bold" />
                    <p className="text-xs text-muted">Pending</p>
                    <p className="text-xl font-semibold text-primary">5</p>
                  </div>
                  <div className="bg-elevated rounded-xl p-4 border">
                    <Users className="w-6 h-6 text-secondary mb-2" weight="bold" />
                    <p className="text-xs text-muted">Total</p>
                    <p className="text-xl font-semibold text-primary">156</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Johnson', time: '09:00 AM', status: 'confirmed' },
                    { name: 'Michael Chen', time: '10:30 AM', status: 'pending' },
                    { name: 'Emily Davis', time: '02:00 PM', status: 'completed' },
                  ].map((appt) => (
                    <div key={appt.name} className="flex items-center justify-between bg-bg rounded-lg px-4 py-3 border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-brand">{appt.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary">{appt.name}</p>
                          <p className="text-xs text-muted">{appt.time}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appt.status === 'confirmed' ? 'bg-brand/10 text-brand' :
                        appt.status === 'pending' ? 'bg-warning/10 text-warning' :
                        'bg-success/10 text-success'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-primary">Everything you need</h2>
            <p className="text-tertiary mt-3">Powerful features to manage your hospital efficiently</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Patient Management',
                description: 'Register, search, and manage patient records with ease. Track conditions, contact info, and visit history.',
              },
              {
                icon: Stethoscope,
                title: 'Doctor Directory',
                description: 'Maintain a complete directory of doctors with specialties, schedules, and contact details.',
              },
              {
                icon: Calendar,
                title: 'Appointment Booking',
                description: 'Book and manage appointments with conflict detection built in.',
              },
              {
                icon: ChartBar,
                title: 'Dashboard Analytics',
                description: 'Get a real-time overview with stats, trends, and activity feeds.',
              },
              {
                icon: Shield,
                title: 'Role-Based Access',
                description: 'Secure access control with Admin, Receptionist, and Doctor roles.',
              },
              {
                icon: Clock,
                title: 'Conflict Prevention',
                description: 'Prevent double-booking with real-time conflict detection.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-surface rounded-xl border p-6 hover:border-border-strong transition">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-brand" weight="bold" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-tertiary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="border-t py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-primary">Built for healthcare teams</h2>
              <p className="text-tertiary mt-3">Focus on patient care, not paperwork.</p>
              
              <div className="mt-8 space-y-4">
                {[
                  'Clean, modern interface with no training required',
                  'Works on any device - desktop, tablet, or phone',
                  'Real-time updates across all users',
                  'Secure JWT authentication',
                  'Role-based permissions built in',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" weight="bold" />
                    <span className="text-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-surface rounded-2xl border p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <TrendUp className="w-6 h-6 text-brand" weight="bold" />
                </div>
                <div>
                  <p className="text-sm text-muted">Built with modern stack</p>
                  <p className="font-semibold text-primary">React + TypeScript + PostgreSQL</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">React 19.2</span>
                  <span className="text-muted">Fast UI</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">TypeScript 6</span>
                  <span className="text-muted">Type safe</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Tailwind CSS 4</span>
                  <span className="text-muted">Modern styling</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Express + PostgreSQL</span>
                  <span className="text-muted">Reliable backend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-semibold text-primary">Ready to get started?</h2>
          <p className="text-tertiary mt-3">Create your account and start managing your hospital today.</p>
          <button onClick={() => setAuthMode('register')} className="btn-primary text-base px-8 py-3 mt-8">
            Create Account
            <ArrowRight className="w-5 h-5" weight="bold" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <Hospital className="w-4 h-4 text-white" weight="bold" />
            </div>
            <span className="text-sm text-muted">HMS - Hospital Management System</span>
          </div>
          <p className="text-sm text-muted">Prototype version</p>
        </div>
      </footer>
    </div>
  );
}

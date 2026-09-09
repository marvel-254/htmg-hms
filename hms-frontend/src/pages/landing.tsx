// Landing page — public marketing page

import { useState } from 'react';
import { LoginPage, RegisterPage } from './auth';
import { 
  Hospital, Users, Stethoscope, Calendar, ChartBar, Shield, 
  ArrowRight, CheckCircle, Sparkle, Clock, TrendUp 
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

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand-accent text-sm font-medium mb-8">
          <Sparkle className="w-4 h-4" weight="bold" />
          Now live — Hospital Management System
        </div>
        
        <h1 className="text-5xl md:text-6xl font-semibold text-text-primary tracking-tight leading-tight max-w-3xl mx-auto">
          Streamline your hospital operations
        </h1>
        
        <p className="text-xl text-text-tertiary mt-6 max-w-2xl mx-auto leading-relaxed">
          Manage patients, doctors, and appointments in one place. A modern, intuitive platform built for healthcare teams.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-10">
          <button onClick={() => setAuthMode('register')} className="btn-primary text-base px-8 py-3">
            Get Started
            <ArrowRight className="w-5 h-5" weight="bold" />
          </button>
          <button onClick={() => setAuthMode('login')} className="btn-ghost text-base px-8 py-3">
            Sign In
          </button>
        </div>

        {/* Hero visual */}
        <div className="mt-16 rounded-2xl border border-border-standard overflow-hidden shadow-2xl">
          <div className="bg-bg-panel p-4 border-b border-border-subtle flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error/60" />
            <div className="w-3 h-3 rounded-full bg-warning/60" />
            <div className="w-3 h-3 rounded-full bg-success-alt/60" />
          </div>
          <div className="bg-bg-surface p-8 text-left">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                <Calendar className="w-6 h-6 text-brand-accent mb-2" weight="bold" />
                <p className="text-xs text-text-muted">Today</p>
                <p className="text-xl font-semibold text-text-primary">12</p>
              </div>
              <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                <CheckCircle className="w-6 h-6 text-success-alt mb-2" weight="bold" />
                <p className="text-xs text-text-muted">Completed</p>
                <p className="text-xl font-semibold text-text-primary">28</p>
              </div>
              <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                <Clock className="w-6 h-6 text-warning mb-2" weight="bold" />
                <p className="text-xs text-text-muted">Pending</p>
                <p className="text-xl font-semibold text-text-primary">5</p>
              </div>
              <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
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
                <div key={appt.name} className="flex items-center justify-between bg-bg-base rounded-lg px-4 py-3 border border-border-subtle">
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
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border-subtle py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-text-primary">Everything you need</h2>
            <p className="text-text-tertiary mt-3">Powerful features to manage your hospital efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                description: 'Book and manage appointments with conflict detection. Confirm, complete, or reschedule with one click.',
              },
              {
                icon: ChartBar,
                title: 'Dashboard Analytics',
                description: 'Get a real-time overview of your hospital operations with stats, trends, and activity feeds.',
              },
              {
                icon: Shield,
                title: 'Role-Based Access',
                description: 'Secure access control with Admin, Receptionist, and Doctor roles. Each sees only what they need.',
              },
              {
                icon: Clock,
                title: 'Conflict Prevention',
                description: 'Prevent double-booking with real-time conflict detection. Smart scheduling saves time and errors.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-bg-surface rounded-xl border border-border-standard p-6 hover:border-border-strong transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-brand-accent" weight="bold" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-tertiary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="border-t border-border-subtle py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-text-primary">Built for healthcare teams</h2>
              <p className="text-text-tertiary mt-3">Focus on patient care, not paperwork.</p>
              
              <div className="mt-8 space-y-4">
                {[
                  'Clean, modern interface — no training required',
                  'Works on any device — desktop, tablet, or phone',
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
            <span className="text-sm text-text-muted">HMS — Hospital Management System</span>
          </div>
          <p className="text-sm text-text-muted">Prototype version</p>
        </div>
      </footer>
    </div>
  );
}

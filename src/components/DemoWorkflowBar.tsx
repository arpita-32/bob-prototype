import React from 'react';
import {
  Users,
  UserPlus,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { UserRole, AuthUser } from '../types';

interface DemoWorkflowBarProps {
  currentRole: UserRole;
  isBillerPortalOpen: boolean;
  onSwitchRole: (role: UserRole) => void;
  onOpenBillerPortal: () => void;
  onOpenEmailSimulation: () => void;
}

export const DemoWorkflowBar: React.FC<DemoWorkflowBarProps> = ({
  currentRole,
  isBillerPortalOpen,
  onSwitchRole,
  onOpenBillerPortal,
  onOpenEmailSimulation,
}) => {
  const steps = [
    {
      id: 'step-admin',
      stepNum: 1,
      title: 'Admin',
      subtitle: 'Manage Makers & Checkers',
      role: 'Admin' as UserRole,
      icon: Users,
      isActive: currentRole === 'Admin' && !isBillerPortalOpen,
    },
    {
      id: 'step-maker',
      stepNum: 2,
      title: 'Maker',
      subtitle: 'Create Biller Onboarding',
      role: 'Maker' as UserRole,
      icon: UserPlus,
      isActive: currentRole === 'Maker' && !isBillerPortalOpen,
    },
    {
      id: 'step-biller',
      stepNum: 3,
      title: 'Biller Portal',
      subtitle: 'Complete 4-Step KYC',
      role: 'Biller' as UserRole,
      icon: Building2,
      isActive: isBillerPortalOpen || currentRole === 'Biller',
    },
    {
      id: 'step-checker',
      stepNum: 4,
      title: 'Checker',
      subtitle: 'Review & KYC Approval',
      role: 'Checker' as UserRole,
      icon: ShieldCheck,
      isActive: currentRole === 'Checker' && !isBillerPortalOpen,
    },
  ];

  return (
    <div
      id="demo-workflow-guide-bar"
      className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 shadow-inner flex flex-wrap items-center justify-between gap-3 text-xs select-none z-40"
    >
      {/* Workflow Label */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF6B11] text-white">
          <Sparkles className="w-3 h-3" />
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-bold text-white tracking-wide text-[11px] uppercase">
            End-to-End KYC Workflow :
          </span>
          <span className="text-[11px] text-slate-300 hidden md:inline">
            Admin → Maker → Biller Email & KYC → Checker Approval
          </span>
        </div>
      </div>

      {/* Steps Pill Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 no-scrollbar py-0.5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => {
                  if (step.role === 'Biller') {
                    onOpenBillerPortal();
                  } else {
                    onSwitchRole(step.role);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  step.isActive
                    ? 'bg-[#FF6B11] text-white shadow-xs scale-100 ring-1 ring-orange-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
                title={`Switch to ${step.title} role (${step.subtitle})`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.isActive
                      ? 'bg-white text-[#FF6B11]'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {step.stepNum}
                </span>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{step.title}</span>
              </button>

              {index < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:inline" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Quick Email Simulation Trigger */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenEmailSimulation}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-amber-400 font-medium cursor-pointer transition-colors"
          title="Open simulated email notification"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Simulated Biller Email</span>
        </button>
      </div>
    </div>
  );
};

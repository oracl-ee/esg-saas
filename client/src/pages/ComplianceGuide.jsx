import React from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Calendar, FileText, Users, Building2, TrendingUp } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

function ComplianceGuide({ onBack }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <AnimatedBackground />
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              CarboniQ
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-purple-900/20 to-transparent py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-6">
            Step-by-Step Guide
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SB 253 Compliance Guide
          </h1>
          <p className="text-xl text-gray-400">
            Your roadmap to successful emissions reporting and compliance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Do You Need to Comply? */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">Do You Need to Comply?</h2>
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30 p-8 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">You must comply if ALL of these apply:</h3>
            <div className="space-y-4">
              {[
                "Your company has total annual revenues exceeding $1 billion",
                "Your company does business in California (has employees, facilities, sales, or operations)",
                "Your company is a U.S. public or private entity"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Not Sure?</h4>
                <p className="text-gray-300 mb-4">
                  The $1 billion threshold is based on total annual revenues, not just California revenue. "Doing business" includes active engagement in transactions for financial gain within the state.
                </p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition text-sm font-semibold"
                >
                  Contact Us for Assessment
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6-Step Compliance Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">6-Step Compliance Process</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Assess Your Obligation",
                icon: Building2,
                description: "Confirm your company meets the revenue and California business criteria. Document your determination.",
                timeline: "Now",
                actions: [
                  "Review annual revenue records",
                  "Identify California business activities",
                  "Determine compliance timeline"
                ]
              },
              {
                step: 2,
                title: "Build Your Team",
                icon: Users,
                description: "Assemble internal stakeholders and identify roles for data collection, analysis, and reporting.",
                timeline: "1-2 months before first deadline",
                actions: [
                  "Assign project lead",
                  "Engage finance, operations, facilities teams",
                  "Consider hiring external consultants",
                  "Select assurance provider"
                ]
              },
              {
                step: 3,
                title: "Inventory Emission Sources",
                icon: FileText,
                description: "Identify all emission sources across Scope 1, 2, and 3 categories relevant to your operations.",
                timeline: "3-6 months before deadline",
                actions: [
                  "Map organizational boundaries",
                  "List facilities and operations",
                  "Identify energy and fuel sources",
                  "Determine relevant Scope 3 categories"
                ]
              },
              {
                step: 4,
                title: "Collect & Calculate Data",
                icon: TrendingUp,
                description: "Gather activity data (energy bills, fuel receipts, etc.) and calculate emissions using GHG Protocol.",
                timeline: "6-9 months before deadline",
                actions: [
                  "Collect utility bills and fuel records",
                  "Input data into CarboniQ platform",
                  "Review calculated emissions",
                  "Identify data gaps and improve"
                ]
              },
              {
                step: 5,
                title: "Prepare for Assurance",
                icon: CheckCircle,
                description: "Organize documentation and work with your assurance provider to verify emissions data.",
                timeline: "3-4 months before deadline",
                actions: [
                  "Document methodology and assumptions",
                  "Prepare supporting evidence",
                  "Engage with assurance provider",
                  "Address audit findings"
                ]
              },
              {
                step: 6,
                title: "Submit Report to CARB",
                icon: Calendar,
                description: "Submit your verified emissions report through CARB's reporting system by the deadline.",
                timeline: "By deadline",
                actions: [
                  "Review final report",
                  "Obtain assurance statement",
                  "Submit via CARB portal",
                  "Retain records for 7 years"
                ]
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-white/20 transition">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">0{item.step}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300 mb-4">{item.description}</p>
                    <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs mb-4">
                      Timeline: {item.timeline}
                    </div>
                    <div className="space-y-2">
                      {item.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span className="text-sm text-gray-400">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Deadlines */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">Key Deadlines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl border border-orange-500/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-orange-400" />
                <h3 className="text-xl font-semibold text-white">2026 Deadline</h3>
              </div>
              <p className="text-gray-300 mb-4">
                First report due for <strong>Scope 1 & 2 emissions</strong> covering calendar year 2025
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-400">
                <AlertCircle className="w-4 h-4" />
                <span>Limited assurance required</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">2027 Deadline</h3>
              </div>
              <p className="text-gray-300 mb-4">
                First report due for <strong>Scope 3 emissions</strong> covering calendar year 2026
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-400">
                <AlertCircle className="w-4 h-4" />
                <span>Limited assurance required</span>
              </div>
            </div>
          </div>
        </section>

        {/* Common Challenges */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">Common Challenges & Solutions</h2>
          <div className="space-y-4">
            {[
              {
                challenge: "Incomplete Data",
                solution: "Start with available data and use reasonable estimates where necessary. Document assumptions and work to improve data quality over time. CarboniQ helps identify gaps and prioritize collection efforts."
              },
              {
                challenge: "Scope 3 Complexity",
                solution: "Focus on material Scope 3 categories first. Not all 15 categories apply to every business. CarboniQ's screening tool helps identify your most significant categories."
              },
              {
                challenge: "Resource Constraints",
                solution: "Automate where possible using CarboniQ. Leverage existing data systems (utility bills, fleet tracking, travel expenses). Start early to spread work over time."
              },
              {
                challenge: "Cross-Department Coordination",
                solution: "Establish clear roles and regular check-ins. Use CarboniQ's multi-user features to assign responsibilities and track progress. Create a central repository for documentation."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.challenge}</h3>
                    <p className="text-gray-300">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">Best Practices for Success</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Start Early", tip: "Don't wait until the deadline. Begin data collection 6-12 months in advance." },
              { title: "Document Everything", tip: "Keep detailed records of methodology, data sources, and assumptions for auditors." },
              { title: "Engage Leadership", tip: "Secure executive buy-in and resources early. This is a compliance requirement, not optional." },
              { title: "Use Technology", tip: "Manual tracking is error-prone. CarboniQ automates calculations and ensures accuracy." },
              { title: "Plan for Assurance", tip: "Build your data systems with assurance in mind. Clean, well-documented data reduces audit time." },
              { title: "Think Long-Term", tip: "SB 253 is annual. Build sustainable processes, not one-time reports." }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <p className="text-gray-300 text-sm">{item.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How CarboniQ Helps */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">How CarboniQ Simplifies Compliance</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                { title: "Guided Workflow", desc: "Step-by-step process ensures you don't miss anything" },
                { title: "Auto-Calculate", desc: "GHG Protocol calculations done automatically" },
                { title: "Assurance-Ready", desc: "Built-in documentation and audit trails" },
                { title: "Deadline Alerts", desc: "Never miss a reporting deadline" },
                { title: "Multi-User", desc: "Collaborate with your team seamlessly" },
                { title: "Track Progress", desc: "Monitor year-over-year emissions trends" }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-6 text-center border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={onBack}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Start Your Compliance Journey
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400 text-sm">
            © 2026 CarboniQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ComplianceGuide;
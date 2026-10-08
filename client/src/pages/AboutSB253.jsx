import React from 'react';
import { ArrowLeft, Calendar, DollarSign, Building2, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

function AboutSB253({ onBack }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <AnimatedBackground />
      {/* Navigation Bar */}
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

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-900/20 to-transparent py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
            California Climate Legislation
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Understanding SB 253
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            The Climate Corporate Data Accountability Act requires large corporations operating in California to publicly disclose their greenhouse gas emissions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        
        {/* What is SB 253 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">What is SB 253?</h2>
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Senate Bill 253, also known as the <strong>Climate Corporate Data Accountability Act</strong>, was signed into law by Governor Gavin Newsom on October 7, 2023. This landmark legislation makes California the first state in the nation to require comprehensive climate disclosure from large corporations.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The law requires U.S. public and private companies with total annual revenues exceeding $1 billion that do business in California to publicly disclose their Scope 1, Scope 2, and Scope 3 greenhouse gas emissions.
            </p>
          </div>
        </section>

        {/* Key Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">Key Requirements</h2>
          <div className="grid gap-6">
            {[
              {
                icon: Building2,
                title: "Who Must Comply",
                description: "U.S. public and private companies with total annual revenues exceeding $1 billion that do business in California",
                color: "blue"
              },
              {
                icon: FileText,
                title: "What to Report",
                description: "Scope 1 (direct emissions), Scope 2 (indirect emissions from purchased energy), and Scope 3 (value chain emissions)",
                color: "purple"
              },
              {
                icon: Calendar,
                title: "When to Report",
                description: "Scope 1 & 2 by 2026 (for 2025 data), Scope 3 by 2027 (for 2026 data)",
                color: "pink"
              },
              {
                icon: CheckCircle,
                title: "Verification Required",
                description: "Third-party assurance required - limited assurance initially, reasonable assurance by 2030",
                color: "green"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-white/20 transition">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${item.color}-500 to-${item.color}-700 flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">Compliance Timeline</h2>
          <div className="space-y-4">
            {[
              { year: "2026", event: "First reporting deadline for Scope 1 & 2 emissions (2025 data)", status: "upcoming" },
              { year: "2027", event: "First reporting deadline for Scope 3 emissions (2026 data)", status: "upcoming" },
              { year: "2030", event: "Reasonable assurance required for Scope 1 & 2 emissions", status: "future" }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{item.year}</span>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-200">{item.event}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                    item.status === 'upcoming' 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' 
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  }`}>
                    {item.status === 'upcoming' ? 'Upcoming' : 'Future'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Penalties */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">Penalties for Non-Compliance</h2>
          <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/30 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Financial Penalties</h3>
                <p className="text-gray-300">Companies that fail to comply face significant financial penalties administered by the California Air Resources Board (CARB).</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-gray-400">Initial Violation</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">$500,000</div>
                <p className="text-sm text-gray-400">Maximum penalty per reporting year</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-gray-400">Subsequent Violations</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">Additional</div>
                <p className="text-sm text-gray-400">Penalties may increase for repeated violations</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Important:</strong> CARB may grant extensions for companies making good-faith efforts to comply but facing unforeseen circumstances.
              </p>
            </div>
          </div>
        </section>

        {/* GHG Protocol Alignment */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">GHG Protocol Alignment</h2>
          <p className="text-gray-300 mb-6">
            SB 253 requires emissions to be measured according to the <strong>Greenhouse Gas Protocol</strong>, the world's most widely used greenhouse gas accounting standards.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                scope: "Scope 1",
                title: "Direct Emissions",
                examples: ["Company vehicles", "On-site fuel combustion", "Manufacturing processes", "Refrigerant leaks"],
                color: "orange"
              },
              {
                scope: "Scope 2",
                title: "Indirect Energy",
                examples: ["Purchased electricity", "Purchased heating", "Purchased cooling", "Purchased steam"],
                color: "yellow"
              },
              {
                scope: "Scope 3",
                title: "Value Chain",
                examples: ["Business travel", "Employee commuting", "Purchased goods", "Product transportation"],
                color: "purple"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 p-6">
                <div className={`inline-block px-3 py-1 rounded-full bg-${item.color}-500/10 text-${item.color}-400 border border-${item.color}-500/30 text-sm mb-4`}>
                  {item.scope}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <ul className="space-y-2">
                  {item.examples.map((example, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-green-400 mt-1">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Why It Matters */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">Why SB 253 Matters</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30 p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Transparency & Accountability</h3>
              <p className="text-gray-300">
                SB 253 brings unprecedented transparency to corporate climate impacts, enabling investors, consumers, and policymakers to make informed decisions based on verified emissions data.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl border border-green-500/30 p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Climate Action</h3>
              <p className="text-gray-300">
                By requiring disclosure of Scope 3 emissions, the law addresses the full climate impact of business operations, encouraging companies to reduce emissions across their entire value chain.
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Market Leadership</h3>
              <p className="text-gray-300">
                California is setting the standard for climate disclosure in the U.S., with potential influence on federal policy and corporate practices nationwide.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Compliant?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            CarboniQ makes SB 253 compliance simple. Start your emissions assessment today and ensure you're ready for the 2026 deadline.
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started Now
          </button>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-white/10 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400 text-sm">
            © 2026 CarboniQ. All rights reserved. Information provided for educational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AboutSB253;
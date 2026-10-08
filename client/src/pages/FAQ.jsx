import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

function FAQ({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "Who needs to comply with SB 253?",
          a: "U.S. public and private companies with total annual revenues exceeding $1 billion that do business in California must comply with SB 253. This includes companies headquartered outside California if they conduct business within the state."
        },
        {
          q: "When do I need to start reporting?",
          a: "The first reporting deadline is in 2026 for Scope 1 and Scope 2 emissions (covering 2025 data). Scope 3 emissions must be reported starting in 2027 (covering 2026 data)."
        },
        {
          q: "How do I know if my company 'does business' in California?",
          a: "Your company 'does business' in California if it actively engages in transactions in the state for financial gain. This includes having employees, facilities, sales, or operations in California. Simply having customers in California may not be sufficient."
        }
      ]
    },
    {
      category: "Emissions Measurement",
      questions: [
        {
          q: "What are Scope 1, 2, and 3 emissions?",
          a: "Scope 1 covers direct emissions from company-owned sources (vehicles, facilities). Scope 2 covers indirect emissions from purchased energy. Scope 3 covers all other indirect emissions in the value chain (business travel, supply chain, product use)."
        },
        {
          q: "How do I measure my emissions?",
          a: "CarboniQ guides you through the GHG Protocol methodology. You'll input data like electricity usage, natural gas consumption, and vehicle fuel. Our platform automatically calculates emissions using EPA-approved emission factors."
        },
        {
          q: "What if I don't have complete data?",
          a: "For initial reporting, reasonable estimates are acceptable if documented properly. However, you should work toward improving data quality over time. CarboniQ helps identify data gaps and suggests collection strategies."
        },
        {
          q: "Do I need to measure Scope 3 emissions?",
          a: "Yes, SB 253 requires Scope 3 reporting starting in 2027. While Scope 3 is complex (covering 15 categories), CarboniQ helps you identify which categories are most relevant to your business."
        }
      ]
    },
    {
      category: "Verification & Assurance",
      questions: [
        {
          q: "What is third-party assurance?",
          a: "Third-party assurance means an independent auditor reviews your emissions data to verify accuracy. SB 253 requires limited assurance initially, with reasonable assurance (higher level) required by 2030 for Scope 1 and 2."
        },
        {
          q: "When do I need assurance?",
          a: "Limited assurance is required starting with your first Scope 1 and 2 report in 2026. Reasonable assurance becomes mandatory in 2030. Scope 3 emissions only require limited assurance."
        },
        {
          q: "How much does assurance cost?",
          a: "Assurance costs vary based on company size and complexity, typically ranging from $15,000-$100,000+ annually. CarboniQ prepares your data to assurance-ready standards, potentially reducing audit time and costs."
        },
        {
          q: "Can I use the same assurance provider as my financial auditor?",
          a: "Yes, many accounting firms offer GHG assurance services. However, ensure they have specific GHG Protocol expertise and are accredited for climate-related assurance."
        }
      ]
    },
    {
      category: "Compliance & Penalties",
      questions: [
        {
          q: "What happens if I miss the deadline?",
          a: "Late or incomplete reporting can result in penalties up to $500,000 per reporting year. CARB may grant extensions for good-faith efforts facing unforeseen circumstances. It's crucial to start early."
        },
        {
          q: "Can I get an extension?",
          a: "CARB may grant extensions if you can demonstrate good-faith efforts to comply but face circumstances beyond your control. However, extensions are not guaranteed, so plan to meet the original deadline."
        },
        {
          q: "What if my data changes after I report?",
          a: "You may need to file an amended report if you discover material errors. Minor adjustments can often be addressed in the following year's submission. Maintain documentation of all changes."
        },
        {
          q: "Is there a safe harbor provision?",
          a: "While SB 253 doesn't explicitly include safe harbor, CARB considers good-faith efforts and transparency. Documenting your methodology, assumptions, and limitations is crucial if issues arise."
        }
      ]
    },
    {
      category: "Using CarboniQ",
      questions: [
        {
          q: "How does CarboniQ help with compliance?",
          a: "CarboniQ automates emissions calculations using GHG Protocol standards, guides you through data collection, identifies gaps, generates assurance-ready reports, and tracks compliance deadlines—all in one platform."
        },
        {
          q: "Can I import data from other systems?",
          a: "Yes! CarboniQ supports CSV imports and integrates with common accounting and facility management systems. You can also manually enter data or use our Excel templates."
        },
        {
          q: "Is my data secure?",
          a: "Absolutely. CarboniQ uses enterprise-grade encryption (AES-256), secure cloud storage, and regular security audits. Your emissions data is confidential and never shared without your permission."
        },
        {
          q: "Can multiple team members access our account?",
          a: "Yes, CarboniQ supports multi-user accounts with role-based permissions. You can invite colleagues, assign specific responsibilities, and track who entered each data point."
        },
        {
          q: "What if I need help?",
          a: "CarboniQ offers email support, video tutorials, and documentation. Premium plans include priority support and optional consulting services for complex questions."
        }
      ]
    },
    {
      category: "Technical Questions",
      questions: [
        {
          q: "Which emission factors does CarboniQ use?",
          a: "CarboniQ uses EPA emission factors by default, with options for regional factors when applicable. We update factors annually to reflect the latest science and regulatory guidance."
        },
        {
          q: "How do you handle renewable energy?",
          a: "For Scope 2, you can input renewable energy purchases (RECs) separately. CarboniQ calculates both location-based and market-based emissions to give you a complete picture."
        },
        {
          q: "Can I track emissions over multiple years?",
          a: "Yes! CarboniQ maintains historical data, allowing you to track year-over-year changes, identify trends, and demonstrate progress toward reduction goals."
        },
        {
          q: "Does CarboniQ support other frameworks (CDP, TCFD)?",
          a: "While focused on SB 253/GHG Protocol, many outputs align with CDP and TCFD requirements. We're working on dedicated modules for these frameworks."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(item =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

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
      <div className="bg-gradient-to-b from-blue-900/20 to-transparent py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-400">
            Everything you need to know about SB 253 compliance and CarboniQ
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No questions found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold mb-6 text-white">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;
                    
                    return (
                      <div
                        key={questionIndex}
                        className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left"
                        >
                          <span className="text-lg font-semibold text-white pr-4">{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-300 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-white/90 mb-6">
            Our team is here to help you navigate SB 253 compliance.
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Contact Support
          </button>
        </div>
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

export default FAQ;
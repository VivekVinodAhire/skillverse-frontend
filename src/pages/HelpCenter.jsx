import { useState } from "react";

import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const faqs = [
  {
    question:
      "How does AI course generation work?",
    answer:
      "Enter a topic, choose your level and learning preferences. SkillVerse then creates structured modules, lessons, quizzes and resources.",
  },
  {
    question:
      "Can I access generated courses offline?",
    answer:
      "Offline lesson downloads will be available after backend storage and file generation are integrated.",
  },
  {
    question:
      "How can I track my learning progress?",
    answer:
      "Your dashboard and My Courses page display lesson completion, learning time, quiz scores and course progress.",
  },
  {
    question:
      "Can I change the difficulty of a course?",
    answer:
      "Yes. Course difficulty can be configured in Settings and later adjusted for individual courses.",
  },
];

function HelpCenter() {
  const [openFaq, setOpenFaq] =
    useState(0);

  return (
    <div className="application-page">
      <section className="help-hero">
        <span>
          <CircleHelp size={18} />
          SKILLVERSE SUPPORT
        </span>

        <h1>How can we help you?</h1>

        <p>
          Search help articles, read common
          answers or contact our support team.
        </p>

        <div className="help-search-box">
          <Search size={19} />

          <input
            type="search"
            placeholder="Search for answers..."
          />
        </div>
      </section>

      <section className="help-category-grid">
        <article>
          <span>
            <BookOpen size={22} />
          </span>

          <h3>Courses & Learning</h3>

          <p>
            Course generation, lessons, quizzes
            and progress.
          </p>

          <button type="button">
            Browse articles
          </button>
        </article>

        <article>
          <span>
            <Sparkles size={22} />
          </span>

          <h3>AI Features</h3>

          <p>
            AI Tutor, personalization and course
            generation.
          </p>

          <button type="button">
            Browse articles
          </button>
        </article>

        <article>
          <span>
            <ShieldCheck size={22} />
          </span>

          <h3>Account & Security</h3>

          <p>
            Password, account privacy and profile
            management.
          </p>

          <button type="button">
            Browse articles
          </button>
        </article>
      </section>

      <section className="faq-professional-section">
        <div className="faq-section-heading">
          <div>
            <span>POPULAR QUESTIONS</span>
            <h2>Frequently asked questions</h2>
          </div>
        </div>

        <div className="professional-faq-list">
          {faqs.map((faq, index) => (
            <article
              key={faq.question}
              className={
                openFaq === index
                  ? "active"
                  : ""
              }
            >
              <button
                type="button"
                onClick={() =>
                  setOpenFaq(
                    openFaq === index
                      ? null
                      : index
                  )
                }
              >
                <span>{faq.question}</span>

                <ChevronDown size={19} />
              </button>

              {openFaq === index && (
                <p>{faq.answer}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="support-contact-card">
        <div>
          <span>
            <MessageCircle size={24} />
          </span>

          <div>
            <h2>Still need assistance?</h2>

            <p>
              Contact our support team and we
              will help resolve your issue.
            </p>
          </div>
        </div>

        <button type="button">
          <Mail size={17} />
          Contact Support
        </button>
      </section>
    </div>
  );
}

export default HelpCenter;
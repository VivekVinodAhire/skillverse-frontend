import {
  Check,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    description:
      "For learners starting their journey.",
    price: "₹0",
    period: "forever",
    icon: Sparkles,
    features: [
      "3 AI-generated courses",
      "Basic learning roadmaps",
      "Course progress tracking",
      "Standard AI Tutor access",
    ],
  },
  {
    name: "Pro",
    description:
      "For serious learners and professionals.",
    price: "₹499",
    period: "per month",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited AI-generated courses",
      "Advanced personalized roadmaps",
      "Unlimited AI Tutor access",
      "Offline course downloads",
      "Certificates",
      "Priority support",
    ],
  },
  {
    name: "Team",
    description:
      "For companies and learning groups.",
    price: "₹1,499",
    period: "per month",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team learning analytics",
      "Shared course library",
      "Administrative controls",
    ],
  },
];

function Pricing() {
  return (
    <div className="application-page pricing-dashboard-page">
      <header className="pricing-page-header">
        <span>
          <Sparkles size={15} />
          SIMPLE AND TRANSPARENT PRICING
        </span>

        <h1>
          Invest in your learning journey
        </h1>

        <p>
          Choose a plan that matches your goals.
          Upgrade or cancel anytime.
        </p>
      </header>

      <section className="dashboard-pricing-grid">
        {plans.map((plan) => {
          const Icon = plan.icon;

          return (
            <article
              key={plan.name}
              className={
                plan.popular
                  ? "popular-plan"
                  : ""
              }
            >
              {plan.popular && (
                <span className="popular-plan-label">
                  MOST POPULAR
                </span>
              )}

              <span className="pricing-plan-icon">
                <Icon size={23} />
              </span>

              <h2>{plan.name}</h2>

              <p>{plan.description}</p>

              <div className="pricing-plan-price">
                <strong>{plan.price}</strong>
                <span>{plan.period}</span>
              </div>

              <button type="button">
                {plan.name === "Free"
                  ? "Current Plan"
                  : `Choose ${plan.name}`}
              </button>

              <div className="pricing-feature-list">
                {plan.features.map(
                  (feature) => (
                    <div key={feature}>
                      <Check size={15} />
                      {feature}
                    </div>
                  )
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default Pricing;
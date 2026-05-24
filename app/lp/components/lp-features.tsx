import type { ReactNode } from "react";

type Feature = {
  icon: ReactNode;
  title: string;
  description: string;
};

type LPFeaturesProps = {
  /** Section heading */
  heading: string;
  /** Section subheading */
  subheading?: string;
  /** Array of features to display */
  features: Feature[];
};

/**
 * 3-column feature/benefit section for landing pages.
 */
export function LPFeatures({ heading, subheading, features }: LPFeaturesProps) {
  return (
    <section className="py-20 px-6 bg-gray-900" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold text-white"
          >
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center hover:border-emerald-500/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 text-emerald-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LPFeatures;

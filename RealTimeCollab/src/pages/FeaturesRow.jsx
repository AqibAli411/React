import React from "react";
import { BarChart3, Clock, TrendingUp } from "lucide-react";

const FeaturesRow = () => {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "AI-Driven Strategy",
      description:
        "Unlock tailored ad strategies to boost campaign performance",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Real-Time Optimization",
      description: "Automatically adjust budgets for maximum ROI",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Boost Engagement",
      description: "Drive higher conversions with data backed decisions",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 md:divide-x md:divide-gray-200">
        {features.map((feature, index) => (
          <div key={index} className="text-center md:px-6">
            {/* Icon and Title Row */}
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="text-gray-700">{feature.icon}</div>
              <h3 className="text-lg font-semibold whitespace-nowrap text-gray-900">
                {feature.title}
              </h3>
            </div>
            {/* Description */}
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-500">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesRow;

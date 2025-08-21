import React from "react";
import { Users, Paintbrush, Edit3, Zap, Share2, Save } from "lucide-react";
import FeaturesRow from "./FeaturesRow";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with your team. See changes instantly as multiple users edit and draw simultaneously on the same canvas.",
    },
    {
      icon: <Paintbrush className="h-8 w-8" />,
      title: "Advanced Drawing Tools",
      description:
        "Professional drawing tools with layers, brushes, shapes, and colors. Create stunning visual content with precision and ease.",
    },
    {
      icon: <Edit3 className="h-8 w-8" />,
      title: "Rich Text Editor",
      description:
        "Powerful text editing capabilities with formatting, styling, and collaborative editing features for comprehensive documentation.",
    },
  ];

  return (
    <section className="py-20">
      <FeaturesRow />
      <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
        {/* Placeholder for Dashboard Image */}
        <div className="relative flex h-[560px] items-center justify-center overflow-hidden rounded-4xl shadow-xl">
          <div className="absolute inset-0 overflow-hidden rounded-4xl bg-gradient-to-b from-blue-400/95 to-blue-500">
            <div className="grid h-full w-full -translate-42 -rotate-35 grid-cols-6 grid-rows-10">
              <div className="col-span-2 row-span-4 bg-gradient-to-r from-blue-300/60 to-blue-400/10"></div>
              <div className="col-span-3 col-start-4 row-span-4 row-start-6 bg-gradient-to-l from-blue-300/85 to-transparent"></div>
            </div>
            <div className="grid h-full w-full translate-x-90 -translate-y-65 -rotate-37 grid-cols-6 grid-rows-10">
              <div className="col-span-3 col-start-4 row-span-3 row-start-1 bg-blue-400/70"></div>
            </div>
          </div>

          <div className="relative z-50 mx-auto max-w-[90%]">
            <img
              src="/trythis.png"
              className="rounded-xl border border-neutral-100 shadow-xs"
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 hover:shadow-xl">
            Try It Free
          </button>
          <button className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50">
            Watch Demo
          </button>
        </div>

        <div className="bg-gray-50 p-10 mt-10">
          <div className="text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Everything You Need for
              <span className="mt-2 block text-blue-500">
                Creative Collaboration
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Transform your ideas into reality with our comprehensive suite of
              collaboration tools. Draw, write, and create together in
              real-time.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Header */}
    </section>
  );
};

export default FeaturesSection;

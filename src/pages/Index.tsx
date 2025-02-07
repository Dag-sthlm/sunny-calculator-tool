import { Calculator } from "@/components/SolarCalculator/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-solar-background to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-solar-primary mb-4">
            Solar Panel Calculator
          </h1>
          <p className="text-lg text-solar-text/70 max-w-2xl mx-auto">
            Discover how much you could save by switching to solar energy. Answer a
            few simple questions to get your personalized estimate.
          </p>
        </div>
        <Calculator />
      </div>
    </div>
  );
};

export default Index;
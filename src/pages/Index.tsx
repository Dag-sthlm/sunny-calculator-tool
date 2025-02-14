
import { Calculator } from "@/components/SolarCalculator/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-solar-background to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#443dc1] mb-4">
            Solcellskalkylator
          </h1>
          <p className="text-lg text-solar-text/70 max-w-2xl mx-auto">
            Upptäck hur mycket du kan spara genom att installera solceller på ditt tak. 
            Svara på några enkla frågor för att få din personliga uppskattning.
          </p>
        </div>
        <Calculator />
      </div>
    </div>
  );
};

export default Index;

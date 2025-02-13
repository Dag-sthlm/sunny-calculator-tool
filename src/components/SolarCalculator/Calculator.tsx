import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface CalculatorData {
  roofSize: number;
  roofAngle: number;
  roofDirection: string;
  monthlyBill: number;
  estimatedProduction: number;
}

const initialData: CalculatorData = {
  roofSize: 0,
  roofAngle: 0,
  roofDirection: "",
  monthlyBill: 0,
  estimatedProduction: 0,
};

export const Calculator = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CalculatorData>(initialData);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (step === 3) {
        const estimatedProduction = calculateEstimatedProduction(data);
        setData(prev => ({ ...prev, estimatedProduction }));
      }
      if (step === 6 && data.monthlyBill) {
        setShowResults(true);
      } else {
        setStep((prev) => Math.min(prev + 1, 6));
      }
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const calculateEstimatedProduction = (data: CalculatorData) => {
    const baseProduction = data.roofSize * 0.23;
    const optimalAngle = 42;
    const angleEfficiency = Math.cos((Math.abs(data.roofAngle - optimalAngle) * Math.PI) / 180);
    
    let directionMultiplier = 1;
    switch (data.roofDirection) {
      case "south":
        directionMultiplier = 1;
        break;
      case "east":
        directionMultiplier = 0.8;
        break;
      case "west":
        directionMultiplier = 0.8;
        break;
      case "north":
        directionMultiplier = 0.45;
        break;
    }
    
    const totalProduction = baseProduction * angleEfficiency * directionMultiplier;
    return totalProduction;
  };

  const calculateSavings = () => {
    const yearlyProduction = data.estimatedProduction * 1000; // Konvertera från kW till kWh
    const estimatedPricePerKwh = 2; // Genomsnittligt elpris inkl. nätavgifter
    const yearlySavings = yearlyProduction * estimatedPricePerKwh;
    const installationCost = Math.round(data.estimatedProduction * 15000);
    const paybackYears = installationCost / yearlySavings;
    
    return {
      yearlySavings,
      paybackYears,
      installationCost
    };
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!data.roofSize) {
          toast({
            title: "Ange takets storlek",
            description: "Detta behövs för att beräkna potentiell produktion",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!data.roofAngle) {
          toast({
            title: "Ange takets vinkel",
            description: "Detta påverkar solpanelernas effektivitet",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (!data.roofDirection) {
          toast({
            title: "Välj takets riktning",
            description: "Detta är viktigt för solpanelernas prestanda",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 6:
        if (!data.monthlyBill) {
          toast({
            title: "Ange månadskostnad",
            description: "Detta behövs för att beräkna besparingen",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const renderQuestion = () => {
    if (showResults) {
      const { yearlySavings, paybackYears, installationCost } = calculateSavings();
      return (
        <QuestionCard
          question="Din potentiella besparing"
          description="Baserat på din information har vi beräknat följande:"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg text-solar-text/70 mb-1">Årlig besparing</p>
                <p className="text-3xl font-bold text-solar-primary">
                  {Math.round(yearlySavings).toLocaleString()} kr/år
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg text-solar-text/70 mb-1">Återbetalningstid</p>
                <p className="text-3xl font-bold text-solar-primary">
                  {Math.round(paybackYears * 10) / 10} år
                </p>
              </div>
            </div>
            <div className="text-solar-text/70 space-y-2 text-sm">
              <p>Beräkningen baseras på:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Din uppskattade årsproduktion: {Math.round(data.estimatedProduction * 1000)} kWh</li>
                <li>Genomsnittligt elpris: 2 kr/kWh</li>
                <li>Installationskostnad: {installationCost.toLocaleString()} kr</li>
              </ul>
              <p className="mt-4">
                Observera att detta är en förenklad beräkning. Faktiska besparingar kan variera beroende 
                på elprisets utveckling, din elförbrukning och när på dygnet du använder mest el.
              </p>
            </div>
          </div>
        </QuestionCard>
      );
    }

    switch (step) {
      case 1:
        return (
          <QuestionCard
            question="Hur stor är din takyta?"
            description="Ange den tillgängliga takytan för solpaneler i kvadratmeter."
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={data.roofSize || ""}
                  onChange={(e) =>
                    setData({ ...data, roofSize: Number(e.target.value) })
                  }
                  className="text-lg"
                  placeholder="0"
                />
                <span className="text-lg">m²</span>
              </div>
              <p className="text-sm text-solar-text/70">
                Osäker på ytan? Du kan räkna ut en ungefärlig yta genom att exempelvis ta bostadens yta 
                (ett våningsplan) och dela med två (i det fall du har sadeltak och bara vill ha solpaneler i ett väderstreck).
              </p>
            </div>
          </QuestionCard>
        );

      case 2:
        return (
          <QuestionCard
            question="Vilken lutning har ditt tak?"
            description="Välj det alternativ som bäst beskriver ditt tak."
          >
            <Select
              value={data.roofAngle.toString()}
              onValueChange={(value) => setData({ ...data, roofAngle: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj taklutning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Platt eller flackt tak</SelectItem>
                <SelectItem value="27">Normalt tak</SelectItem>
                <SelectItem value="40">Brant tak</SelectItem>
              </SelectContent>
            </Select>
          </QuestionCard>
        );

      case 3:
        return (
          <QuestionCard
            question="I vilken riktning ligger taket?"
            description="Välj det väderstreck som taket huvudsakligen är ritat emot."
          >
            <Select
              value={data.roofDirection}
              onValueChange={(value) => setData({ ...data, roofDirection: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj riktning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">Norr</SelectItem>
                <SelectItem value="south">Söder</SelectItem>
                <SelectItem value="east">Öster</SelectItem>
                <SelectItem value="west">Väster</SelectItem>
              </SelectContent>
            </Select>
          </QuestionCard>
        );

      case 4:
        return (
          <QuestionCard
            question="Uppskattad produktion"
            description="Baserat på dina svar kan din anläggning producera:"
          >
            <div className="text-center space-y-4">
              <p className="text-3xl font-bold text-solar-primary mb-2">
                {Math.round(data.estimatedProduction)} kW
              </p>
              <div className="text-solar-text/70 space-y-2 text-left">
                <p>Beräkningen baseras på:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Modern solpanelsteknik (230W/m²)</li>
                  <li>Din takvinkel ({data.roofAngle}°)</li>
                  <li>Takets riktning ({data.roofDirection === "south" ? "söder" : 
                                      data.roofDirection === "north" ? "norr" : 
                                      data.roofDirection === "east" ? "öster" : "väster"})</li>
                </ul>
              </div>
            </div>
          </QuestionCard>
        );

      case 5:
        return (
          <QuestionCard
            question="Uppskattad installationskostnad"
            description="Baserat på dina svar kan en solcellsinstallation kosta cirka:"
          >
            <div className="text-center space-y-4">
              <p className="text-3xl font-bold text-solar-primary mb-2">
                {Math.round(data.estimatedProduction * 15000).toLocaleString()} kr
              </p>
              <div className="text-solar-text/70 space-y-2 text-left">
                <p className="text-sm">
                  Beräkningen baseras på en ungefärlig uppskattning av installationskostnader inklusive skatteavdrag. 
                  Beroende på ett flertal faktorer, exempelvis hur stor installationen är, kan siffrorna vara missvisande. 
                  Ta alltid in flera offerter och jämför verkliga priser.
                </p>
              </div>
            </div>
          </QuestionCard>
        );

      case 6:
        return (
          <QuestionCard
            question="Vad är din genomsnittliga månadskostnad för el?"
            description="Detta hjälper oss beräkna din potentiella besparing."
          >
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={data.monthlyBill || ""}
                onChange={(e) =>
                  setData({ ...data, monthlyBill: Number(e.target.value) })
                }
                className="text-lg"
                placeholder="0"
              />
              <span className="text-lg">kr/mån</span>
            </div>
          </QuestionCard>
        );
    }
  };

  return (
    <div className="min-h-screen bg-solar-background p-6">
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator currentStep={showResults ? 6 : step} totalSteps={6} />
        <AnimatePresence mode="wait">{renderQuestion()}</AnimatePresence>
        <div className="flex justify-between mt-8">
          {!showResults && (
            <>
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
                className="px-6"
              >
                Föregående
              </Button>
              <Button onClick={handleNext} className="px-6 bg-solar-primary">
                {step === 6 ? "Beräkna" : "Nästa"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

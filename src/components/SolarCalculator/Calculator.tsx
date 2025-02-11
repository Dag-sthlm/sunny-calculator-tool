
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
  const { toast } = useToast();

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (step === 3) {
        // Efter takvinkel och riktning, beräkna uppskattad produktion
        const estimatedProduction = calculateEstimatedProduction(data);
        setData(prev => ({ ...prev, estimatedProduction }));
      }
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const calculateEstimatedProduction = (data: CalculatorData) => {
    // Förenklad beräkning - kan förfinas senare
    const baseProduction = data.roofSize * 0.15; // 150W per kvadratmeter
    const angleMultiplier = Math.cos((90 - data.roofAngle) * Math.PI / 180);
    
    let directionMultiplier = 1;
    switch (data.roofDirection) {
      case "south":
        directionMultiplier = 1;
        break;
      case "east":
      case "west":
        directionMultiplier = 0.8;
        break;
      case "north":
        directionMultiplier = 0.6;
        break;
    }
    
    return baseProduction * angleMultiplier * directionMultiplier;
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
    }
    return true;
  };

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <QuestionCard
            question="Hur stor är din takyta?"
            description="Ange den tillgängliga takytan för solpaneler i kvadratmeter."
          >
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
          </QuestionCard>
        );
      case 2:
        return (
          <QuestionCard
            question="Vilken lutning har ditt tak?"
            description="Ange takets vinkel i grader (0° är platt, 45° är ett normalt lutande tak)"
          >
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={data.roofAngle || ""}
                onChange={(e) =>
                  setData({ ...data, roofAngle: Number(e.target.value) })
                }
                className="text-lg"
                placeholder="0"
                min="0"
                max="90"
              />
              <span className="text-lg">grader</span>
            </div>
          </QuestionCard>
        );
      case 3:
        return (
          <QuestionCard
            question="I vilken riktning ligger taket?"
            description="Välj den väderstreck som taket är riktat mot."
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
            <div className="text-center">
              <p className="text-3xl font-bold text-solar-primary mb-2">
                {Math.round(data.estimatedProduction)} kW
              </p>
              <p className="text-solar-text/70">
                Detta är en uppskattning baserad på takytans storlek, vinkel och riktning.
              </p>
            </div>
          </QuestionCard>
        );
      case 5:
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
        <ProgressIndicator currentStep={step} totalSteps={5} />
        <AnimatePresence mode="wait">{renderQuestion()}</AnimatePresence>
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            className="px-6"
          >
            Föregående
          </Button>
          <Button onClick={handleNext} className="px-6 bg-solar-primary">
            {step === 5 ? "Beräkna" : "Nästa"}
          </Button>
        </div>
      </div>
    </div>
  );
};

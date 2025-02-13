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
    // Moderna solpaneler producerar cirka 230W per kvadratmeter
    const baseProduction = data.roofSize * 0.23;
    
    // Optimal vinkel i Sverige är cirka 42 grader
    // Vi använder en sinusfunktion för att beräkna effektiviteten baserat på avvikelsen från optimal vinkel
    const optimalAngle = 42;
    const angleEfficiency = Math.cos((Math.abs(data.roofAngle - optimalAngle) * Math.PI) / 180);
    
    // Riktningsfaktorer baserade på data från Energimyndigheten
    let directionMultiplier = 1;
    switch (data.roofDirection) {
      case "south":
        directionMultiplier = 1; // 100% för söderläge
        break;
      case "east":
        directionMultiplier = 0.8; // 80% för österläge
        break;
      case "west":
        directionMultiplier = 0.8; // 80% för västerläge
        break;
      case "north":
        directionMultiplier = 0.45; // 45% för norrläge
        break;
    }
    
    const totalProduction = baseProduction * angleEfficiency * directionMultiplier;
    return totalProduction;
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
            <div className="space-y-4">
              <Select
                value={data.roofAngle.toString()}
                onValueChange={(value) => setData({ ...data, roofAngle: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj taklutning" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Platt tak</SelectItem>
                  <SelectItem value="15">Flackt tak</SelectItem>
                  <SelectItem value="27">Normalt tak</SelectItem>
                  <SelectItem value="40">Brant tak</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-solar-text/70">
                Vid platta eller mycket flacka tak kan installatören föreslå att panelerna vinklas upp
              </p>
            </div>
          </QuestionCard>
        );

      case 3:
        return (
          <QuestionCard
            question="I vilken riktning ligger taket?"
            description="Välj den väderstreck som taket är riktat mot. Söderläge ger bäst effekt."
          >
            <Select
              value={data.roofDirection}
              onValueChange={(value) => setData({ ...data, roofDirection: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj riktning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">Norr (45% effekt)</SelectItem>
                <SelectItem value="south">Söder (100% effekt)</SelectItem>
                <SelectItem value="east">Öster (80% effekt)</SelectItem>
                <SelectItem value="west">Väster (80% effekt)</SelectItem>
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
                  <li>Din takvinkel ({data.roofAngle}°) jämfört med optimal vinkel (42°)</li>
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

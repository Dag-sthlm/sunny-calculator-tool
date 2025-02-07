import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface CalculatorData {
  monthlyBill: number;
  roofSize: number;
  roofDirection: string;
  location: string;
  shadingLevel: string;
  electricityRate: number;
}

const initialData: CalculatorData = {
  monthlyBill: 0,
  roofSize: 0,
  roofDirection: "",
  location: "",
  shadingLevel: "",
  electricityRate: 0,
};

export const Calculator = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CalculatorData>(initialData);
  const { toast } = useToast();

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!data.monthlyBill) {
          toast({
            title: "Please enter your monthly bill",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!data.roofSize) {
          toast({
            title: "Please enter your roof size",
            variant: "destructive",
          });
          return false;
        }
        break;
      // Add validation for other steps
    }
    return true;
  };

  const calculateResults = () => {
    // Simple calculation example - replace with actual calculations
    const installationCost = data.roofSize * 100; // $100 per square foot
    const annualSavings = data.monthlyBill * 12 * 0.7; // 70% savings
    const breakEvenYears = installationCost / annualSavings;
    const co2Reduction = data.monthlyBill * 0.85; // kg CO2 per month

    return {
      installationCost,
      annualSavings,
      breakEvenYears,
      co2Reduction,
    };
  };

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <QuestionCard
            question="What's your average monthly electricity bill?"
            description="This helps us estimate your energy consumption."
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">$</span>
              <Input
                type="number"
                value={data.monthlyBill || ""}
                onChange={(e) =>
                  setData({ ...data, monthlyBill: Number(e.target.value) })
                }
                className="text-lg"
                placeholder="0"
              />
            </div>
          </QuestionCard>
        );
      case 2:
        return (
          <QuestionCard
            question="What's your roof size?"
            description="Approximate square footage of your roof."
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
              <span className="text-lg">sq ft</span>
            </div>
          </QuestionCard>
        );
      case 3:
        return (
          <QuestionCard
            question="Which direction does your roof face?"
            description="The direction affects solar panel efficiency."
          >
            <Select
              value={data.roofDirection}
              onValueChange={(value) => setData({ ...data, roofDirection: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
              </SelectContent>
            </Select>
          </QuestionCard>
        );
      // Add more cases for remaining questions
    }
  };

  return (
    <div className="min-h-screen bg-solar-background p-6">
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator currentStep={step} totalSteps={6} />
        <AnimatePresence mode="wait">{renderQuestion()}</AnimatePresence>
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            className="px-6"
          >
            Previous
          </Button>
          <Button onClick={handleNext} className="px-6 bg-solar-primary">
            {step === 6 ? "Calculate" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};
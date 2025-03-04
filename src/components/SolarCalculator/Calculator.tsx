
import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { ProgressIndicator } from "./ProgressIndicator";

// Constants for solar panel dimensions in meters
const PANEL_WIDTH = 1.7;
const PANEL_HEIGHT = 1.0;

export interface CalculatorData {
  roofSize: number;
  roofAngle: number;
  roofDirection: string;
  numberOfPanels: number;
  actualSolarPanelArea: number;
  estimatedProduction: number;
}

export const Calculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CalculatorData>({
    roofSize: 0,
    roofAngle: 0,
    roofDirection: "south",
    numberOfPanels: 0,
    actualSolarPanelArea: 0,
    estimatedProduction: 0,
  });

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const updateData = (updates: Partial<CalculatorData>) => {
    setData((prev) => {
      const newData = { ...prev, ...updates };

      // Calculate number of panels that can fit on the roof
      const panelsPerRow = Math.floor(Math.sqrt(newData.roofSize) / PANEL_WIDTH);
      const panelsPerColumn = Math.floor(Math.sqrt(newData.roofSize) / PANEL_HEIGHT);
      newData.numberOfPanels = panelsPerRow * panelsPerColumn;

      // Calculate actual solar panel area
      newData.actualSolarPanelArea = newData.numberOfPanels * PANEL_WIDTH * PANEL_HEIGHT;

      // Calculate estimated production based on roof angle, direction and size
      let angleEfficiency = 0.8; // default efficiency
      if (newData.roofAngle >= 30 && newData.roofAngle <= 45) {
        angleEfficiency = 1.0; // optimal angle
      } else if (newData.roofAngle > 45) {
        angleEfficiency = 0.9;
      }

      let directionEfficiency = 0.7; // default for east/west
      if (newData.roofDirection === "south") {
        directionEfficiency = 1.0;
      } else if (newData.roofDirection === "north") {
        directionEfficiency = 0.5;
      } else if (newData.roofDirection === "flat") {
        directionEfficiency = 0.85; // efficiency for flat roofs
      }

      // Production formula: area * 230W/m² * efficiencies
      newData.estimatedProduction = 
        newData.actualSolarPanelArea * 0.23 * angleEfficiency * directionEfficiency;

      return newData;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuestionCard
            question="Hur stor är din takyta?"
            description="Ange uppskattad yta i kvadratmeter där du planerar att installera solpaneler."
          >
            <div className="flex flex-col items-center">
              <input
                type="number"
                className="w-full max-w-md p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="t.ex. 30"
                value={data.roofSize === 0 ? "" : data.roofSize}
                onChange={(e) => 
                  updateData({ roofSize: Math.max(0, Number(e.target.value)) })
                }
              />
              <span className="mt-2 text-gray-600">m²</span>
              <button
                onClick={handleNext}
                disabled={data.roofSize === 0}
                className={`mt-6 px-6 py-2 rounded transition-colors ${
                  data.roofSize === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Nästa
              </button>
            </div>
          </QuestionCard>
        );
      case 2:
        return (
          <QuestionCard
            question="Vilken lutning har ditt tak?"
            description="Ange ungefärlig taklutning i grader."
          >
            <div className="flex flex-col items-center">
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                className="w-full max-w-md"
                value={data.roofAngle}
                onChange={(e) => 
                  updateData({ roofAngle: Number(e.target.value) })
                }
              />
              <span className="mt-2 text-gray-600">{data.roofAngle}°</span>
              <div className="flex justify-between w-full max-w-md mt-1">
                <span>0°</span>
                <span>60°</span>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Tillbaka
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Nästa
                </button>
              </div>
            </div>
          </QuestionCard>
        );
      case 3:
        return (
          <QuestionCard
            question="Vilket väderstreck är taket riktat mot?"
            description="Välj det väderstreck som bäst motsvarar takets riktning."
          >
            <div className="flex flex-col items-center">
              <select
                className="w-full max-w-md p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.roofDirection}
                onChange={(e) => 
                  updateData({ roofDirection: e.target.value })
                }
              >
                <option value="south">Söder</option>
                <option value="east">Öster</option>
                <option value="west">Väster</option>
                <option value="north">Norr</option>
                <option value="flat">Taket är platt</option>
              </select>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Tillbaka
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Beräkna
                </button>
              </div>
            </div>
          </QuestionCard>
        );
      case 4:
        return (
          <QuestionCard
            question="Uppskattad produktion"
            description="Baserat på dina svar kan din anläggning producera:"
          >
            <div className="text-center space-y-4">
              <p className="text-3xl font-bold text-[#26292a] mb-2">
                {Math.round(data.estimatedProduction)} kW
              </p>
              <div className="text-[#26292a]/70 space-y-2 text-left">
                <p>Beräkningen baseras på:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Modern solpanelsteknik (230W/m²)</li>
                  <li>Din ungefärliga takvinkel ({data.roofAngle}°)</li>
                  <li>Takets riktning ({data.roofDirection === "south" ? "söder" : 
                                      data.roofDirection === "north" ? "norr" : 
                                      data.roofDirection === "east" ? "öster" : 
                                      data.roofDirection === "west" ? "väster" :
                                      data.roofDirection === "flat" ? "platt tak" : ""})</li>
                  <li>Antal solpaneler som får plats: {data.numberOfPanels} st (standardstorlek {PANEL_WIDTH}x{PANEL_HEIGHT}m)</li>
                  <li>Total yta solceller: {Math.round(data.actualSolarPanelArea * 100) / 100} m² (uppgiven takyta: {data.roofSize} m²)</li>
                </ul>
              </div>
              <button
                onClick={handlePrevious}
                className="mt-6 px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Tillbaka
              </button>
            </div>
          </QuestionCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <ProgressIndicator currentStep={currentStep} totalSteps={4} />
      {renderStep()}
    </div>
  );
};

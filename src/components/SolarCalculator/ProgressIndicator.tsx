
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onReset?: () => void;
}

export const ProgressIndicator = ({
  currentStep,
  totalSteps,
  onReset,
}: ProgressIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-solar-text/70">
          Steg {currentStep} av {totalSteps}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-solar-text/70">
            {Math.round((currentStep / totalSteps) * 100)}% färdigt
          </span>
          {currentStep === totalSteps && (
            <Button
              variant="link"
              className="text-sm text-solar-text/70 p-0 h-auto"
              onClick={onReset}
            >
              Börja om
            </Button>
          )}
        </div>
      </div>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{ 
            width: `${(currentStep / totalSteps) * 100}%`,
            backgroundColor: "#f7b746"
          }}
        />
      </div>
    </div>
  );
};

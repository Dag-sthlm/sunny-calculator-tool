import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const QuestionCard = ({
  question,
  description,
  children,
  className,
}: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full max-w-2xl mx-auto p-8 rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg border border-gray-100",
        className
      )}
    >
      <h2 className="text-2xl font-semibold text-solar-text mb-2">{question}</h2>
      {description && (
        <p className="text-solar-text/70 mb-6">{description}</p>
      )}
      {children}
    </motion.div>
  );
};
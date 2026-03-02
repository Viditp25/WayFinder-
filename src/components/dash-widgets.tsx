"use client";

import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';
import { Target, Wallet, Briefcase, GraduationCap } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetMeterProps {
  estimatedCost: number;
  futureSalary: number;
}

export function BudgetMeter({ estimatedCost, futureSalary }: BudgetMeterProps) {
  const chartData = {
    labels: ['Education Cost', 'Projected Y1 Salary'],
    datasets: [
      {
        data: [estimatedCost, futureSalary],
        backgroundColor: [
          'rgba(244, 63, 94, 0.8)', // Rose for Cost
          'rgba(16, 185, 129, 0.8)', // Emerald for Salary
        ],
        borderColor: [
          'rgba(244, 63, 94, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        cutout: '75%',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => `₹${(context.raw as number).toLocaleString('en-IN')}`
        }
      }
    },
    maintainAspectRatio: false,
  };

  // ROI Calculation
  const roiMultiplier = (futureSalary / estimatedCost).toFixed(1);

  return (
    <div className="glass-panel p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
      <div className="w-48 h-48 relative">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold">{roiMultiplier}x</span>
          <span className="text-xs text-muted-foreground tracking-widest uppercase">ROI</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-pilot-500" />
            Financial Reality Check
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Compare conservative educational investments against starting packages in this sector.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-semibold">Est. Cost</span>
            </div>
            <p className="text-lg font-bold">₹{estimatedCost.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-semibold">Base Y1 Salary</span>
            </div>
            <p className="text-lg font-bold">₹{futureSalary.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DayInTheLife({ snippet, career }: { snippet: string, career: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-panel overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-pilot-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />

      <div className="p-8 relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white dark:bg-black/50 rounded-xl shadow-sm border border-border">
            <Briefcase className="w-6 h-6 text-pilot-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">AI Simulation</h3>
            <p className="text-sm text-pilot-600 dark:text-pilot-400 font-medium">
              A Day in the Life of a {career}
            </p>
          </div>
        </div>

        <blockquote className="text-lg leading-relaxed text-foreground/90 border-l-4 border-pilot-500 pl-4 italic">
          &quot;{snippet}&quot;
        </blockquote>
      </div>
    </motion.div>
  );
}

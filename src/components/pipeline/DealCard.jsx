import React from 'react';
import { PriorityBadge } from '../common/Badge';
import { pipelineStages } from '../../data/initialData';
import {
  Calendar,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

const DealCard = ({ deal, onEdit, onDelete, onStageChange }) => {
  const currentStageIndex = pipelineStages.findIndex((s) => s.id === deal.stage);

  const handlePrevStage = (e) => {
    e.stopPropagation();
    if (currentStageIndex > 0) {
      onStageChange(deal.id, pipelineStages[currentStageIndex - 1].id);
    }
  };

  const handleNextStage = (e) => {
    e.stopPropagation();
    if (currentStageIndex < pipelineStages.length - 1) {
      onStageChange(deal.id, pipelineStages[currentStageIndex + 1].id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
      <div>
        {/* Priority & Quick Actions */}
        <div className="flex items-center justify-between mb-2">
          <PriorityBadge priority={deal.priority} />
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(deal)}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition cursor-pointer"
              title="Edit Deal"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(deal.id, deal.title)}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition cursor-pointer"
              title="Delete Deal"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Title & Customer */}
        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 leading-snug">
          {deal.title}
        </h4>

        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-1.5 truncate">
          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{deal.customerName}</span>
        </div>

        {/* Value and Probability */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-extrabold text-slate-900">
            ${deal.amount?.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-indigo-600">
            {deal.probability}% win
          </span>
        </div>

        {/* Probability progress bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              deal.stage === 'won'
                ? 'bg-emerald-500'
                : deal.stage === 'lost'
                ? 'bg-rose-400'
                : 'bg-indigo-500'
            }`}
            style={{ width: `${deal.probability}%` }}
          />
        </div>

        {/* Close date & Rep */}
        <div className="flex items-center justify-between mt-2.5 text-[10px] text-slate-400">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{deal.expectedCloseDate}</span>
          </span>
          <span className="font-medium text-slate-600 truncate max-w-[90px]">
            {deal.assignedRep}
          </span>
        </div>
      </div>

      {/* Stage Navigation Arrows */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={handlePrevStage}
          disabled={currentStageIndex <= 0}
          className={`p-1 rounded-md text-[11px] flex items-center space-x-0.5 transition cursor-pointer ${
            currentStageIndex <= 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
          }`}
          title="Move to previous stage"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[10px]">Prev</span>
        </button>

        {/* Fast Won / Lost shortcuts */}
        <div className="flex items-center space-x-1">
          {deal.stage !== 'won' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStageChange(deal.id, 'won');
              }}
              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition cursor-pointer"
              title="Quick Mark Won"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {deal.stage !== 'lost' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStageChange(deal.id, 'lost');
              }}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
              title="Quick Mark Lost"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={handleNextStage}
          disabled={currentStageIndex >= pipelineStages.length - 1}
          className={`p-1 rounded-md text-[11px] flex items-center space-x-0.5 transition cursor-pointer ${
            currentStageIndex >= pipelineStages.length - 1
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
          }`}
          title="Move to next stage"
        >
          <span className="text-[10px]">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DealCard;

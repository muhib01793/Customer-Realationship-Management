import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { pipelineStages, salesReps } from '../../data/initialData';
import DealCard from './DealCard';
import DealModal from './DealModal';
import StatCard from '../common/StatCard';
import {
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Plus,
  Filter,
  Kanban,
  Sparkles
} from 'lucide-react';

const PipelineBoard = () => {
  const { deals, addDeal, updateDeal, updateDealStage, deleteDeal, searchQuery } = useCrm();

  const [selectedRep, setSelectedRep] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      const matchSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.customerName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRep = selectedRep === 'All' || d.assignedRep === selectedRep;
      const matchPriority = selectedPriority === 'All' || d.priority === selectedPriority;

      return matchSearch && matchRep && matchPriority;
    });
  }, [deals, searchQuery, selectedRep, selectedPriority]);

  // Overall Pipeline Analytics
  const activeDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const weightedForecast = activeDeals.reduce(
    (sum, d) => sum + ((Number(d.amount) || 0) * (Number(d.probability) || 0)) / 100,
    0
  );
  const wonDeals = deals.filter((d) => d.stage === 'won');
  const totalWonValue = wonDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const closedDealsCount = deals.filter((d) => d.stage === 'won' || d.stage === 'lost').length;
  const winRate = closedDealsCount > 0 ? Math.round((wonDeals.length / closedDealsCount) * 100) : 0;

  const handleOpenAdd = () => {
    setDealToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (deal) => {
    setDealToEdit(deal);
    setIsModalOpen(true);
  };

  const handleSaveDeal = (formData) => {
    if (dealToEdit) {
      updateDeal(dealToEdit.id, formData);
    } else {
      addDeal(formData);
    }
  };

  const handleDeleteDeal = (id, title) => {
    if (window.confirm(`Are you sure you want to delete deal "${title}"?`)) {
      deleteDeal(id);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      updateDealStage(dealId, targetStageId);
    }
  };

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Pipeline Value"
          value={`$${totalPipelineValue.toLocaleString()}`}
          change={`${activeDeals.length} active deals`}
          isPositive={true}
          icon={DollarSign}
          color="indigo"
        />
        <StatCard
          title="Weighted Forecast"
          value={`$${Math.round(weightedForecast).toLocaleString()}`}
          change="Probability adjusted"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Closed Won Deals"
          value={`$${totalWonValue.toLocaleString()}`}
          change={`${wonDeals.length} deals finalized`}
          isPositive={true}
          icon={CheckCircle2}
          color="purple"
        />
        <StatCard
          title="Sales Win Rate"
          value={`${winRate}%`}
          change="Won vs Lost deals"
          isPositive={winRate >= 50}
          icon={Percent}
          color="amber"
        />
      </div>

      {/* Control bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Pipeline:</span>
          </div>

          <select
            value={selectedRep}
            onChange={(e) => setSelectedRep(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Sales Reps</option>
            {salesReps.map((rep) => (
              <option key={rep} value={rep}>{rep}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/20 transition cursor-pointer self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Deal</span>
        </button>
      </div>

      {/* Visual Kanban Board with horizontal scroll */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="flex space-x-4 min-w-[1300px]">
          {pipelineStages.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

            return (
              <div
                key={stage.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={`flex-1 min-w-[240px] max-w-[280px] rounded-2xl border ${stage.border} ${stage.bgLight}/40 p-3.5 flex flex-col min-h-[580px] transition-colors`}
              >
                {/* Stage Header */}
                <div className="pb-3 border-b border-slate-200/60 mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <h4 className="text-xs font-bold text-slate-800">{stage.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between mt-1">
                    <span>Total Value:</span>
                    <span className="text-slate-900">${stageTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deal Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {stageDeals.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs p-3 text-center">
                      Drop deals here
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <DealCard
                          deal={deal}
                          onEdit={handleOpenEdit}
                          onDelete={handleDeleteDeal}
                          onStageChange={updateDealStage}
                        />
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Add at bottom of column */}
                <button
                  onClick={handleOpenAdd}
                  className="mt-3 w-full py-2 border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-white text-slate-500 hover:text-indigo-600 rounded-xl text-xs font-medium flex items-center justify-center space-x-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Deal</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dealToEdit={dealToEdit}
        onSave={handleSaveDeal}
      />
    </div>
  );
};

export default PipelineBoard;
